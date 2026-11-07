import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DELAYS, esperar } from "../datos/carga";
import {
  RESERVAS_HISTORIAL,
  type ReservaHistorial,
} from "../datos/historialReservas";

type ReservasContextValue = {
  reservas: ReservaHistorial[];
  pendientes: number;
  /** Carga inicial de la lista. */
  cargando: boolean;
  /** Refresh por pull-to-refresh (mantiene lista visible). */
  refrescando: boolean;
  error: string | null;
  refrescar: () => Promise<void>;
  reintentar: () => Promise<void>;
  /** Agrega una reserva al historial (mock / tras confirmar). */
  agregarReserva: (reserva: ReservaHistorial) => void;
};

const ReservasContext = createContext<ReservasContextValue | null>(null);

/**
 * Historial con estados de carga/error sobre datos mock.
 * Misma forma que usara la suscripcion Firestore del punto 3.
 */
export function ReservasProvider({ children }: { children: ReactNode }) {
  const [reservas, setReservas] = useState<ReservaHistorial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async (modo: "inicial" | "refresco") => {
    if (modo === "inicial") setCargando(true);
    else setRefrescando(true);
    setError(null);

    try {
      await esperar(modo === "inicial" ? DELAYS.ruta : DELAYS.busqueda);
      setReservas((prev) => {
        // Conserva reservas agregadas en sesion (p. ej. recien confirmadas).
        const idsMock = new Set(RESERVAS_HISTORIAL.map((r) => r.id));
        const locales = prev.filter((r) => !idsMock.has(r.id));
        return [...locales, ...RESERVAS_HISTORIAL];
      });
    } catch {
      setError("No se pudo cargar tu historial de reservas.");
      if (modo === "inicial") setReservas([]);
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, []);

  useEffect(() => {
    void cargar("inicial");
  }, [cargar]);

  const refrescar = useCallback(() => cargar("refresco"), [cargar]);
  const reintentar = useCallback(() => cargar("inicial"), [cargar]);

  const agregarReserva = useCallback((reserva: ReservaHistorial) => {
    setReservas((prev) => [reserva, ...prev.filter((r) => r.id !== reserva.id)]);
  }, []);

  const pendientes = useMemo(
    () => reservas.filter((r) => r.estado === "pendiente").length,
    [reservas],
  );

  const value = useMemo(
    () => ({
      reservas,
      pendientes,
      cargando,
      refrescando,
      error,
      refrescar,
      reintentar,
      agregarReserva,
    }),
    [reservas, pendientes, cargando, refrescando, error, refrescar, reintentar, agregarReserva],
  );

  return (
    <ReservasContext.Provider value={value}>{children}</ReservasContext.Provider>
  );
}

export function useReservas() {
  const ctx = useContext(ReservasContext);
  if (!ctx) {
    throw new Error("useReservas debe usarse dentro de ReservasProvider");
  }
  return ctx;
}
