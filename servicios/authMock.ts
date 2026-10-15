import { USUARIOS_MOCK, type Usuario, type UsuarioMock } from "../datos/usuarios";
import { DELAYS, esperar } from "../datos/carga";
import { almacenamiento } from "./almacenamiento";
import {
  ErrorAuth,
  type Credenciales,
  type DatosRegistro,
  type ServicioAuth,
  type Sesion,
} from "./tiposAuth";

const CLAVE_SESION = "hospeda365.sesion";

/** Copia en memoria para que los usuarios registrados puedan iniciar sesión. */
const usuarios: UsuarioMock[] = USUARIOS_MOCK.map((u) => ({ ...u }));

function sinPassword(usuario: UsuarioMock): Usuario {
  const { password: _password, ...resto } = usuario;
  return resto;
}

function generarToken(usuarioId: string): string {
  const payload = JSON.stringify({ sub: usuarioId, iat: Date.now() });
  return `mock.${encodeURIComponent(payload)}.firma`;
}

function crearSesion(usuario: UsuarioMock): Sesion {
  const expira = new Date();
  expira.setHours(expira.getHours() + 8);

  return {
    usuario: sinPassword(usuario),
    token: generarToken(usuario.id),
    expiraEn: expira.toISOString(),
  };
}

export const authMock: ServicioAuth = {
  async login({ email, password }: Credenciales): Promise<Sesion> {
    await esperar(DELAYS.busqueda);

    const normalizado = email.trim().toLowerCase();
    const usuario = usuarios.find((u) => u.email.toLowerCase() === normalizado);

    // Mismo error para ambos casos: no revela qué correos están registrados.
    if (!usuario || usuario.password !== password) {
      throw new ErrorAuth(
        "credenciales_invalidas",
        "Correo o contraseña incorrectos.",
      );
    }

    if (!usuario.activo) {
      throw new ErrorAuth("usuario_inactivo", "La cuenta está desactivada.");
    }

    const sesion = crearSesion(usuario);
    await almacenamiento.guardar(CLAVE_SESION, sesion);
    return sesion;
  },

  async registrar(datos: DatosRegistro): Promise<Sesion> {
    await esperar(DELAYS.confirmar);

    const normalizado = datos.email.trim().toLowerCase();

    if (usuarios.some((u) => u.email.toLowerCase() === normalizado)) {
      throw new ErrorAuth(
        "email_ya_registrado",
        "Ese correo ya está registrado.",
      );
    }

    const nuevo: UsuarioMock = {
      id: `usr_huesped_${Date.now()}`,
      email: normalizado,
      password: datos.password,
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      telefono: datos.telefono.trim() || null,
      rol: "huesped",
      activo: true,
      creadoEn: new Date().toISOString(),
    };

    usuarios.push(nuevo);

    const sesion = crearSesion(nuevo);
    await almacenamiento.guardar(CLAVE_SESION, sesion);
    return sesion;
  },

  async logout(): Promise<void> {
    await esperar(300);
    await almacenamiento.borrar(CLAVE_SESION);
  },

  async restaurarSesion(): Promise<Sesion | null> {
    const sesion = await almacenamiento.leer<Sesion>(CLAVE_SESION);
    if (!sesion) return null;

    if (new Date(sesion.expiraEn).getTime() <= Date.now()) {
      await almacenamiento.borrar(CLAVE_SESION);
      return null;
    }

    return sesion;
  },

  async actualizarPerfil(
    usuarioId: string,
    cambios: Partial<Usuario>,
  ): Promise<Usuario> {
    await esperar(DELAYS.subida);

    const indice = usuarios.findIndex((u) => u.id === usuarioId);
    if (indice === -1) {
      throw new ErrorAuth("usuario_no_encontrado", "El usuario no existe.");
    }

    const actual = usuarios[indice];

    const { id: _id, email: _email, rol: _rol, ...permitidos } = cambios;

    const actualizado: UsuarioMock = { ...actual, ...permitidos };
    usuarios[indice] = actualizado;

    return sinPassword(actualizado);
  },
};
