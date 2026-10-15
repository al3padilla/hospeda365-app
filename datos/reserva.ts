import type { Habitacion } from "./habitaciones";
import { HABITACIONES_DESTACADAS } from "./habitaciones";
import {
  calcularNoches,
  fechasPorDefecto,
  formatearFecha,
} from "./fechas";

export type DatosReserva = {
  habitacion: Habitacion;
  checkIn: string;
  checkOut: string;
  noches: number;
  subtotal: number;
  total: number;
};

export { calcularNoches, fechasPorDefecto, formatearFecha };

export function calcularTotal(precioPorNoche: number, noches: number): number {
  return precioPorNoche * noches;
}

export function formatearPrecio(valor: number): string {
  return `$${valor.toLocaleString("es-MX")}`;
}

export function obtenerHabitacionPorId(id?: string | null): Habitacion {
  return (
    HABITACIONES_DESTACADAS.find((h) => h.id === id) ??
    HABITACIONES_DESTACADAS[0]
  );
}

export function armarResumen(
  habitacionId: string | null | undefined,
  checkIn?: string | null,
  checkOut?: string | null,
): DatosReserva {
  const habitacion = obtenerHabitacionPorId(habitacionId);
  const defaults = fechasPorDefecto();
  const inDate = checkIn || defaults.checkIn;
  const outDate = checkOut || defaults.checkOut;
  const noches = calcularNoches(inDate, outDate);
  const total = calcularTotal(habitacion.pricePerNight, noches);

  return {
    habitacion,
    checkIn: inDate,
    checkOut: outDate,
    noches,
    subtotal: total,
    total,
  };
}

/** Ruta + parámetros hacia la pantalla de confirmación de reserva. */
export function rutaConfirmacion(opts: {
  habitacionId?: string;
  checkIn?: string;
  checkOut?: string;
}) {
  const params: Record<string, string> = {};
  if (opts.habitacionId) params.habitacion = opts.habitacionId;
  if (opts.checkIn) params.checkIn = opts.checkIn;
  if (opts.checkOut) params.checkOut = opts.checkOut;
  return { pathname: "/confirmacion" as const, params };
}
