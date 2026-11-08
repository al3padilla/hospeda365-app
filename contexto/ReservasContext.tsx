import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mensajeErrorDatos } from "../servicios/esquemaFirestore";
import {
  crearReserva as crearReservaFirestore,
  obtenerReservas,
  observarReservas,
  resolverReserva,
  type NuevaReserva,
  type ReservaDocumento,
  type ResultadoReserva,
} from "../servicios/reservas";
import type { ReservaHistorial } from "../types/hotel";
import { useAuth } from "./AuthContext";
import { useHabitaciones } from "./HabitacionesContext";

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
  crearReserva: (datos: Omit<NuevaReserva, "usuarioId">) => Promise<ResultadoReserva>;
};

const ReservasContext = createContext<ReservasContextValue | null>(null);

/** Reservas del usuario autenticado en tiempo real (`reservations` filtrado por su UID). */
export function ReservasProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const { habitaciones } = useHabitaciones();
  const usuarioId = usuario?.id ?? null;
  const [documentos, setDocumentos] = useState<ReservaDocumento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // Al cerrar sesión se descartan los datos del usuario anterior.
    setDocumentos([]);
    setError(null);
    setCargando(true);
    if (!usuarioId) return;

    let cancelar = () => {};
    try {
      cancelar = observarReservas(
        usuarioId,
        (lista) => {
          setDocumentos(lista);
          setError(null);
          setCargando(false);
        },
        (e) => {
          setError(mensajeErrorDatos(e, "tu historial de reservas"));
          setCargando(false);
        },
      );
    } catch (e) {
      setError(mensajeErrorDatos(e, "tu historial de reservas"));
      setCargando(false);
    }
    return () => cancelar();
  }, [usuarioId, intento]);

  const refrescar = useCallback(async () => {
    if (!usuarioId) return;
    setRefrescando(true);
    try {
      setDocumentos(await obtenerReservas(usuarioId));
      setError(null);
    } catch (e) {
      throw new Error(mensajeErrorDatos(e, "tu historial de reservas"));
    } finally {
      setRefrescando(false);
    }
  }, [usuarioId]);

  const reintentar = useCallback(async () => setIntento((n) => n + 1), []);

  const crearReserva = useCallback(
    async (datos: Omit<NuevaReserva, "usuarioId">) => {
      if (!usuarioId) throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
      return crearReservaFirestore({ ...datos, usuarioId });
    },
    [usuarioId],
  );

  const reservas = useMemo(
    () => documentos.map((d) => resolverReserva(d, habitaciones)),
    [documentos, habitaciones],
  );

  const pendientes = useMemo(
    () => reservas.filter((r) => r.estado === "pendiente").length,
    [reservas],
  );

  const value = useMemo(
    () => ({ reservas, pendientes, cargando, refrescando, error, refrescar, reintentar, crearReserva }),
    [reservas, pendientes, cargando, refrescando, error, refrescar, reintentar, crearReserva],
  );

  return <ReservasContext.Provider value={value}>{children}</ReservasContext.Provider>;
}

export function useReservas() {
  const ctx = useContext(ReservasContext);
  if (!ctx) {
    throw new Error("useReservas debe usarse dentro de ReservasProvider");
  }
  return ctx;
}
