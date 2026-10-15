import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";

import type { Usuario } from "../datos/usuarios";
import { servicioAuth, ErrorAuth, MENSAJES_ERROR } from "../servicios";
import type { Credenciales, DatosRegistro } from "../servicios/tiposAuth";
import {
  authReducer,
  estadoInicial,
  estaAutenticado as selEstaAutenticado,
  estaCargando as selEstaCargando,
  iniciales as selIniciales,
  nombreCompleto as selNombreCompleto,
  type AuthState,
  type ErrorVisible,
} from "./authReducer";

type AuthContextValue = {
  state: AuthState;
  usuario: Usuario | null;
  token: string | null;
  error: ErrorVisible | null;

  estaAutenticado: boolean;
  estaCargando: boolean;
  nombreCompleto: string;
  iniciales: string;

  // Devuelven `true` si salió bien, para que la pantalla navegue.
  login: (credenciales: Credenciales) => Promise<boolean>;
  registrar: (datos: DatosRegistro) => Promise<boolean>;
  logout: () => Promise<void>;
  actualizarPerfil: (cambios: Partial<Usuario>) => Promise<boolean>;
  limpiarError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, estadoInicial);
  const operacion = useRef(false);
  const generacion = useRef(0);

  useEffect(() => {
    let cancelado = false;
    const restaurar = async () => {
      if (operacion.current) return;
      const actual = ++generacion.current;
      try {
        const sesion = await servicioAuth.restaurarSesion();
        if (!cancelado && actual === generacion.current) dispatch({ type: "RESTAURAR_SESION", payload: sesion });
      } catch (error) {
        if (!cancelado && actual === generacion.current) dispatch({ type: 'AUTENTICACION_FALLIDA', payload: {
          codigo: error instanceof ErrorAuth ? error.codigo : 'error_desconocido',
          mensaje: error instanceof ErrorAuth ? error.message : MENSAJES_ERROR.error_desconocido,
        } });
      }
    };
    let unsubscribe: (() => void) | undefined;
    try {
      if (servicioAuth.observarCambiosSesion) unsubscribe = servicioAuth.observarCambiosSesion(() => void restaurar());
      else void restaurar();
    } catch (error) {
      dispatch({ type: 'AUTENTICACION_FALLIDA', payload: {
        codigo: 'error_desconocido', mensaje: error instanceof ErrorAuth ? error.message : MENSAJES_ERROR.error_desconocido,
      } });
    }

    return () => {
      cancelado = true;
      generacion.current++;
      unsubscribe?.();
    };
  }, []);

  const manejarError = useCallback((error: unknown, conservarSesion = false) => {
    const codigo =
      error instanceof ErrorAuth ? error.codigo : "error_desconocido";

    dispatch({
      type: conservarSesion ? 'OPERACION_FALLIDA' : "AUTENTICACION_FALLIDA",
      payload: { codigo, mensaje: error instanceof ErrorAuth ? error.message : MENSAJES_ERROR[codigo] },
    });
  }, []);

  const login = useCallback(
    async (credenciales: Credenciales): Promise<boolean> => {
      if (operacion.current) return false;
      operacion.current = true;
      generacion.current++;
      dispatch({ type: "OPERACION_INICIADA" });
      try {
        const sesion = await servicioAuth.login(credenciales);
        dispatch({ type: "AUTENTICACION_EXITOSA", payload: sesion });
        return true;
      } catch (error) {
        manejarError(error);
        return false;
      } finally {
        operacion.current = false;
      }
    },
    [manejarError],
  );

  const registrar = useCallback(
    async (datos: DatosRegistro): Promise<boolean> => {
      if (operacion.current) return false;
      operacion.current = true;
      generacion.current++;
      dispatch({ type: "OPERACION_INICIADA" });
      try {
        const sesion = await servicioAuth.registrar(datos);
        dispatch({ type: "AUTENTICACION_EXITOSA", payload: sesion });
        return true;
      } catch (error) {
        manejarError(error);
        return false;
      } finally {
        operacion.current = false;
      }
    },
    [manejarError],
  );

  const logout = useCallback(async (): Promise<void> => {
    if (operacion.current) return;
    operacion.current = true;
    generacion.current++;
    dispatch({ type: 'OPERACION_INICIADA' });
    try {
      await servicioAuth.logout();
      dispatch({ type: "SESION_CERRADA" });
    } catch (error) {
      manejarError(error, true);
    } finally {
      operacion.current = false;
    }
  }, [manejarError]);

  const actualizarPerfil = useCallback(
    async (cambios: Partial<Usuario>): Promise<boolean> => {
      if (!state.usuario || operacion.current) return false;
      operacion.current = true;
      generacion.current++;
      try {
        const actualizado = await servicioAuth.actualizarPerfil(
          state.usuario.id,
          cambios,
        );
        dispatch({ type: "PERFIL_ACTUALIZADO", payload: actualizado });
        return true;
      } catch (error) {
        manejarError(error, !(error instanceof ErrorAuth && error.codigo === 'sesion_expirada'));
        return false;
      } finally {
        operacion.current = false;
      }
    },
    [state.usuario, manejarError],
  );

  const limpiarError = useCallback(() => {
    dispatch({ type: "ERROR_LIMPIADO" });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      state,
      usuario: state.usuario,
      token: state.token,
      error: state.error,
      estaAutenticado: selEstaAutenticado(state),
      estaCargando: selEstaCargando(state),
      nombreCompleto: selNombreCompleto(state),
      iniciales: selIniciales(state),
      login,
      registrar,
      logout,
      actualizarPerfil,
      limpiarError,
    }),
    [state, login, registrar, logout, actualizarPerfil, limpiarError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);

  if (contexto === null) {
    throw new Error("useAuth() debe usarse dentro de un <AuthProvider>.");
  }

  return contexto;
}
