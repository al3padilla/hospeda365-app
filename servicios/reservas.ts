import {
  addDoc,
  collection,
  doc,
  runTransaction,
  getDocsFromServer,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore";
import { calcularNoches, startOfDay, toIsoLocal } from "../datos/fechas";
import { getFirebase } from "../services/firebase";
import type { Habitacion, HabitacionFisica, ReservaHistorial } from "../types/hotel";
import {
  COLECCIONES,
  IMAGEN_POR_DEFECTO,
  aTimestamp,
  fechaIso,
  numero,
  texto,
} from "./esquemaFirestore";
import { elegirHabitacion } from "./habitaciones";

/** Datos de la reserva tal como están en Firestore, sin resolver la habitación. */
export type ReservaDocumento = {
  id: string;
  habitacionId: string;
  habitacionNombre: string;
  checkIn: string;
  checkOut: string;
  total: number;
  estado: string;
  estadoPago: string;
  comprobanteGenerado: boolean;
  comprobanteUrl: string | null;
  adultos: number;
  ninos: number;
  bebes: number;
  precioNoche: number;
};

function leerReserva(id: string, datos: DocumentData): ReservaDocumento {
  const checkIn = fechaIso(datos.fechaEntrada);
  const checkOut = fechaIso(datos.fechaSalida);
  const total = numero(datos.total);
  const noches = numero(datos.noches) || calcularNoches(checkIn, checkOut);
  const huespedes = numero(datos.numeroHuespedes, 1);
  return {
    id,
    habitacionId: texto(datos.habitacionId),
    habitacionNombre: texto(datos.habitacionNombre) || texto(datos.tipoHabitacion),
    checkIn,
    checkOut,
    total,
    estado: texto(datos.estado, "pendiente").toLowerCase(),
    estadoPago: texto(datos.estadoPago),
    comprobanteGenerado: datos.comprobanteGenerado === true,
    comprobanteUrl: texto(datos.comprobanteUrl) || null,
    adultos: numero(datos.adultos, huespedes),
    ninos: numero(datos.ninos),
    bebes: numero(datos.bebes),
    precioNoche: numero(datos.precioNoche) || (noches > 0 ? total / noches : 0),
  };
}

function ordenar(snapshot: QuerySnapshot): ReservaDocumento[] {
  return snapshot.docs
    .map((d) => leerReserva(d.id, d.data()))
    .sort((a, b) => b.checkIn.localeCompare(a.checkIn));
}

/** Solo las reservas del usuario: las reglas rechazan cualquier consulta sin este filtro. */
function consultaDelUsuario(usuarioId: string) {
  const { db } = getFirebase();
  return query(collection(db, COLECCIONES.reservas), where("usuarioId", "==", usuarioId));
}

export function observarReservas(
  usuarioId: string,
  alCambiar: (reservas: ReservaDocumento[]) => void,
  alFallar: (error: unknown) => void,
): () => void {
  return onSnapshot(consultaDelUsuario(usuarioId), (s) => alCambiar(ordenar(s)), alFallar);
}

export async function cancelarReservaHuesped(id: string): Promise<void> {
  const { db } = getFirebase();
  const referencia = doc(db, COLECCIONES.reservas, id);
  await runTransaction(db, async (transaction) => {
    const reserva = await transaction.get(referencia);
    if (reserva.get("estado") === "cancelada") return;
    if (!["pendiente", "confirmada"].includes(reserva.get("estado")) ||
        reserva.get("estadoPago") !== "sin_comprobante") {
      throw new Error("Esta reserva ya no se puede cancelar.");
    }
    transaction.update(referencia, { estado: "cancelada", actualizadaEn: serverTimestamp() });
  });
}

export async function registrarComprobanteSimulado(id: string): Promise<void> {
  const { db } = getFirebase();
  const referencia = doc(db, COLECCIONES.reservas, id);
  await runTransaction(db, async (transaction) => {
    const reserva = await transaction.get(referencia);
    const nombre = "comprobante-simulado-" + id + ".pdf";
    if (reserva.get("estadoPago") === "en_revision" && reserva.get("comprobanteGenerado") === true &&
        reserva.get("comprobanteNombre") === nombre) return;
    if (reserva.get("estado") !== "confirmada" || reserva.get("estadoPago") !== "sin_comprobante") {
      throw new Error("Esta reserva ya no está disponible para el pago simulado.");
    }
    transaction.update(referencia, {
      estadoPago: "en_revision",
      comprobanteGenerado: true,
      comprobanteNombre: nombre,
      comprobanteUrl: null,
      actualizadaEn: serverTimestamp(),
    });
  });
}

export function etiquetaEstadoPago(reserva: ReservaHistorial): string | undefined {
  if (reserva.estadoPago === "aprobado") return "Pago aprobado";
  if (reserva.estadoPago === "rechazado") return "Pago rechazado";
  if (reserva.estadoPago === "en_revision") return "Pago en revisión";
  if (reserva.estado === "confirmada" && reserva.estadoPago === "sin_comprobante") return "Pendiente de pagar";
}

export async function obtenerReservas(usuarioId: string): Promise<ReservaDocumento[]> {
  return ordenar(await getDocsFromServer(consultaDelUsuario(usuarioId)));
}

/** Completa nombre, imagen y precio con el catálogo de habitaciones. */
export function resolverReserva(reserva: ReservaDocumento, habitaciones: Habitacion[]): ReservaHistorial {
  const grupo = habitaciones.find((h) => h.habitaciones.some((f) => f.id === reserva.habitacionId));
  return {
    id: reserva.id,
    habitacionId: reserva.habitacionId,
    habitacionNombre: grupo?.name || reserva.habitacionNombre || "Habitación",
    imagen: grupo?.imagen ?? IMAGEN_POR_DEFECTO,
    checkIn: reserva.checkIn,
    checkOut: reserva.checkOut,
    total: reserva.total,
    estado: reserva.estado,
    estadoPago: reserva.estadoPago,
    comprobanteGenerado: reserva.comprobanteGenerado,
    comprobanteUrl: reserva.comprobanteUrl,
    adultos: reserva.adultos,
    ninos: reserva.ninos,
    bebes: reserva.bebes,
    precioPorNoche: reserva.precioNoche,
  };
}

export type NuevaReserva = {
  usuarioId: string;
  habitacion: Habitacion;
  checkIn: string;
  checkOut: string;
  adultos: number;
  ninos: number;
  bebes: number;
};

export type ResultadoReserva = { id: string; asignada: HabitacionFisica; total: number; noches: number };

/**
 * Crea la reserva en estado `pendiente`. Las reglas exigen que sea del propio
 * usuario; el total y la disponibilidad los revisa el personal al confirmar.
 */
export async function crearReserva(datos: NuevaReserva): Promise<ResultadoReserva> {
  const personas = datos.adultos + datos.ninos;
  if (!datos.checkIn || !datos.checkOut || datos.checkOut <= datos.checkIn) {
    throw new Error("Selecciona fechas de entrada y salida válidas.");
  }
  if (datos.checkIn < toIsoLocal(startOfDay(new Date()))) {
    throw new Error("La fecha de entrada no puede ser anterior a hoy.");
  }
  if (datos.adultos < 1) throw new Error("La reserva necesita al menos un adulto.");

  const asignada = elegirHabitacion(datos.habitacion, personas);
  if (!asignada) {
    throw new Error(`No hay habitaciones ${datos.habitacion.name} disponibles para ${personas} personas.`);
  }

  const noches = calcularNoches(datos.checkIn, datos.checkOut);
  const total = asignada.precioNoche * noches;
  const { auth, db } = getFirebase();
  const ref = await addDoc(collection(db, COLECCIONES.reservas), {
    usuarioId: datos.usuarioId,
    habitacionId: asignada.id,
    habitacionNumero: asignada.numero,
    habitacionNombre: datos.habitacion.name,
    huespedNombre: auth.currentUser?.displayName || auth.currentUser?.email || "Huésped",
    estado: "pendiente",
    estadoPago: "sin_comprobante",
    fechaEntrada: aTimestamp(datos.checkIn),
    fechaSalida: aTimestamp(datos.checkOut),
    noches,
    numeroHuespedes: personas,
    adultos: datos.adultos,
    ninos: datos.ninos,
    bebes: datos.bebes,
    precioNoche: asignada.precioNoche,
    total,
    creadaEn: serverTimestamp(),
    actualizadaEn: serverTimestamp(),
  });
  return { id: ref.id, asignada, total, noches };
}
