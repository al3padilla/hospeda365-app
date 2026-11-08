import { collection, onSnapshot, query, where, type DocumentData } from "firebase/firestore";
import { getFirebase } from "../services/firebase";
import type { Habitacion, HabitacionFisica } from "../types/hotel";
import {
  COLECCIONES,
  IMAGEN_POR_DEFECTO,
  claveTipo,
  imagenDe,
  listaTexto,
  numero,
  texto,
} from "./esquemaFirestore";

type Fila = { fisica: HabitacionFisica; datos: DocumentData };

function leerHabitacion(id: string, datos: DocumentData): Fila | null {
  const tipo = texto(datos.tipo) || texto(datos.nombre);
  const capacidad = numero(datos.capacidad);
  const precioNoche = numero(datos.precioNoche);
  // Un registro incompleto no se puede reservar: se omite del catálogo.
  if (!tipo || capacidad <= 0 || precioNoche <= 0) return null;
  return {
    fisica: {
      id,
      numero: texto(datos.numero),
      tipo,
      capacidad,
      precioNoche,
      estado: texto(datos.estado).toLowerCase(),
    },
    datos,
  };
}

/** Agrupa las habitaciones físicas por tipo, como las ve el huésped. */
export function agruparPorTipo(filas: Fila[]): Habitacion[] {
  const grupos = new Map<string, Fila[]>();
  for (const fila of filas) {
    const clave = claveTipo(fila.fisica.tipo);
    grupos.set(clave, [...(grupos.get(clave) ?? []), fila]);
  }

  return [...grupos.entries()]
    .map(([clave, miembros]) => {
      const conDescripcion = miembros.find((m) => texto(m.datos.descripcion));
      const conImagen = miembros.map((m) => imagenDe(m.datos)).find(Boolean);
      const amenidades = miembros
        .map((m) => listaTexto(m.datos.amenidades ?? m.datos.caracteristicas))
        .find((l) => l.length > 0);
      return {
        id: clave,
        name: miembros[0].fisica.tipo,
        description: conDescripcion ? texto(conDescripcion.datos.descripcion) : "",
        pricePerNight: Math.min(...miembros.map((m) => m.fisica.precioNoche)),
        capacity: Math.max(...miembros.map((m) => m.fisica.capacidad)),
        imagen: conImagen ?? IMAGEN_POR_DEFECTO,
        highlights: amenidades ?? [],
        habitaciones: miembros.map((m) => m.fisica),
      };
    })
    .sort((a, b) => a.pricePerNight - b.pricePerNight);
}

/**
 * Elige la habitación física para una reserva: con capacidad suficiente,
 * fuera de mantenimiento, priorizando las disponibles y la de menor precio.
 * La disponibilidad por fechas la valida el personal al confirmar.
 */
export function elegirHabitacion(habitacion: Habitacion, personas: number): HabitacionFisica | null {
  const candidatas = habitacion.habitaciones
    .filter((h) => h.capacidad >= personas && h.estado !== "mantenimiento")
    .sort(
      (a, b) =>
        Number(b.estado === "disponible") - Number(a.estado === "disponible") ||
        a.precioNoche - b.precioNoche,
    );
  return candidatas[0] ?? null;
}

/**
 * Suscripción en tiempo real al catálogo publicado. Las reglas solo permiten
 * al huésped leer habitaciones con `activa == true`, y Firestore rechaza
 * cualquier consulta que no lo filtre explícitamente.
 */
export function observarHabitaciones(
  alCambiar: (habitaciones: Habitacion[]) => void,
  alFallar: (error: unknown) => void,
): () => void {
  const { db } = getFirebase();
  return onSnapshot(
    query(collection(db, COLECCIONES.habitaciones), where("activa", "==", true)),
    (snapshot) => {
      const filas = snapshot.docs
        .map((d) => leerHabitacion(d.id, d.data()))
        .filter((f): f is Fila => f !== null);
      if (__DEV__) {
        // Diagnóstico de esquema en desarrollo: solo nombres de campos, nunca valores.
        const omitidas = snapshot.docs.filter((d) => !filas.some((f) => f.fisica.id === d.id));
        console.log(
          `[rooms] documentos: ${snapshot.size}, válidos: ${filas.length}, omitidos: ${omitidas.length}`,
          omitidas.slice(0, 3).map((d) => Object.keys(d.data()).sort().join(", ")),
        );
      }
      alCambiar(agruparPorTipo(filas));
    },
    alFallar,
  );
}
