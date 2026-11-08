import type { ImageSourcePropType } from "react-native";

/** Habitación física tal como está en la colección `rooms`. */
export type HabitacionFisica = {
  id: string;
  numero: string;
  tipo: string;
  capacidad: number;
  precioNoche: number;
  estado: string;
};

/**
 * Tipo de habitación que ve el huésped: agrupa las habitaciones de `rooms`
 * con el mismo `tipo`. El precio mostrado es el menor del grupo.
 */
export type Habitacion = {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  imagen: ImageSourcePropType;
  highlights: string[];
  habitaciones: HabitacionFisica[];
};

export type EstadoReserva = "confirmada" | "pendiente" | "cancelada" | (string & {});

/** Reserva del usuario autenticado (colección `reservations`). */
export type ReservaHistorial = {
  id: string;
  habitacionId: string;
  habitacionNombre: string;
  imagen: ImageSourcePropType;
  checkIn: string;
  checkOut: string;
  total: number;
  estado: EstadoReserva;
  estadoPago: string;
  adultos: number;
  ninos: number;
  bebes: number;
  precioPorNoche: number;
};
