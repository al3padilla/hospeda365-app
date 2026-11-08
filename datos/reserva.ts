import { calcularNoches, fechasPorDefecto, formatearFecha } from "./fechas";

export { calcularNoches, fechasPorDefecto, formatearFecha };

export function calcularTotal(precioPorNoche: number, noches: number): number {
  return precioPorNoche * noches;
}

export function formatearPrecio(valor: number): string {
  return `$${valor.toLocaleString("es-MX")}`;
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
