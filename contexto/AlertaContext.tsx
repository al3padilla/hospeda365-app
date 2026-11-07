import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import AlertaToast from "../components/AlertaToast";
import { vibrarError, vibrarExito } from "../utilidades/hapticos";

export type TipoAlerta = "exito" | "error" | "info";

export type Alerta = {
  id: number;
  tipo: TipoAlerta;
  mensaje: string;
};

type MostrarAlerta = {
  tipo: TipoAlerta;
  mensaje: string;
  /** ms visibles; default 3200 */
  duracion?: number;
};

type AlertaContextValue = {
  alerta: Alerta | null;
  mostrar: (opts: MostrarAlerta) => void;
  exito: (mensaje: string) => void;
  error: (mensaje: string) => void;
  info: (mensaje: string) => void;
  ocultar: () => void;
};

const AlertaContext = createContext<AlertaContextValue | null>(null);

const DURACION_DEFAULT = 3200;

export function AlertaProvider({ children }: { children: ReactNode }) {
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ocultar = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setAlerta(null);
  }, []);

  const mostrar = useCallback(
    ({ tipo, mensaje, duracion = DURACION_DEFAULT }: MostrarAlerta) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      idRef.current += 1;
      setAlerta({ id: idRef.current, tipo, mensaje });

      if (tipo === "exito") vibrarExito();
      if (tipo === "error") vibrarError();

      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setAlerta(null);
      }, duracion);
    },
    [],
  );

  const value = useMemo<AlertaContextValue>(
    () => ({
      alerta,
      mostrar,
      exito: (mensaje) => mostrar({ tipo: "exito", mensaje }),
      error: (mensaje) => mostrar({ tipo: "error", mensaje }),
      info: (mensaje) => mostrar({ tipo: "info", mensaje }),
      ocultar,
    }),
    [alerta, mostrar, ocultar],
  );

  return (
    <AlertaContext.Provider value={value}>
      {children}
      <AlertaToast alerta={alerta} onCerrar={ocultar} />
    </AlertaContext.Provider>
  );
}

export function useAlerta() {
  const ctx = useContext(AlertaContext);
  if (!ctx) {
    throw new Error("useAlerta debe usarse dentro de AlertaProvider");
  }
  return ctx;
}
