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
import { observarHabitaciones } from "../servicios/habitaciones";
import type { Habitacion } from "../types/hotel";
import { useAuth } from "./AuthContext";

export type CriteriosBusqueda = {
  checkIn: string;
  checkOut: string;
  /** Total que exige capacidad (adultos + niños). */
  personas: number;
  adultos: number;
  ninos: number;
  bebes: number;
};

type HabitacionesContextValue = {
  habitaciones: Habitacion[];
  habitacionesFiltradas: Habitacion[];
  busqueda: CriteriosBusqueda | null;
  /** Carga inicial del catálogo desde Firestore. */
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
  obtenerHabitacion: (id?: string | null) => Habitacion | null;
  buscar: (criterios: CriteriosBusqueda) => Promise<Habitacion[]>;
  limpiarBusqueda: () => void;
};

const HabitacionesContext = createContext<HabitacionesContextValue | null>(null);

function filtrar(habitaciones: Habitacion[], personas: number) {
  return habitaciones.filter((h) => h.capacity >= personas);
}

/** Catálogo en tiempo real desde `rooms`; solo se consulta con sesión iniciada. */
export function HabitacionesProvider({ children }: { children: ReactNode }) {
  const { estaAutenticado } = useAuth();
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [busqueda, setBusqueda] = useState<CriteriosBusqueda | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!estaAutenticado) {
      setHabitaciones([]);
      setBusqueda(null);
      setCargando(true);
      setError(null);
      return;
    }

    setCargando(true);
    setError(null);
    let cancelar = () => {};
    try {
      cancelar = observarHabitaciones(
        (lista) => {
          setHabitaciones(lista);
          setCargando(false);
        },
        (e) => {
          setError(mensajeErrorDatos(e, "las habitaciones"));
          setCargando(false);
        },
      );
    } catch (e) {
      setError(mensajeErrorDatos(e, "las habitaciones"));
      setCargando(false);
    }
    return () => cancelar();
  }, [estaAutenticado, intento]);

  const habitacionesFiltradas = useMemo(
    () => (busqueda ? filtrar(habitaciones, busqueda.personas) : habitaciones),
    [habitaciones, busqueda],
  );

  const obtenerHabitacion = useCallback(
    (id?: string | null) => habitaciones.find((h) => h.id === id) ?? null,
    [habitaciones],
  );

  const buscar = useCallback(
    async (criterios: CriteriosBusqueda) => {
      setBusqueda(criterios);
      return filtrar(habitaciones, criterios.personas);
    },
    [habitaciones],
  );

  const limpiarBusqueda = useCallback(() => setBusqueda(null), []);
  const reintentar = useCallback(() => setIntento((n) => n + 1), []);

  const value = useMemo(
    () => ({
      habitaciones,
      habitacionesFiltradas,
      busqueda,
      cargando,
      error,
      reintentar,
      obtenerHabitacion,
      buscar,
      limpiarBusqueda,
    }),
    [habitaciones, habitacionesFiltradas, busqueda, cargando, error, reintentar, obtenerHabitacion, buscar, limpiarBusqueda],
  );

  return <HabitacionesContext.Provider value={value}>{children}</HabitacionesContext.Provider>;
}

export function useHabitaciones() {
  const ctx = useContext(HabitacionesContext);
  if (!ctx) {
    throw new Error("useHabitaciones debe usarse dentro de HabitacionesProvider");
  }
  return ctx;
}
