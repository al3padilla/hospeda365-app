import { Timestamp, type DocumentData } from "firebase/firestore";
import type { ImageSourcePropType } from "react-native";
import { IMAGENES_INICIO } from "../datos/inicio";
import { toIsoLocal } from "../datos/fechas";

/**
 * Nombres de colecciones y lectura tolerante de los documentos que comparte
 * la app con el panel web. Si el esquema cambia, se ajusta solo este archivo.
 */
export const COLECCIONES = {
  habitaciones: "rooms",
  reservas: "reservations",
} as const;

/** Foto genérica del hotel cuando la habitación no tiene imagen en la base. */
export const IMAGEN_POR_DEFECTO: ImageSourcePropType = IMAGENES_INICIO[0];

export function texto(valor: unknown, alterno = ""): string {
  if (typeof valor === "string") return valor.trim();
  if (typeof valor === "number" && Number.isFinite(valor)) return String(valor);
  return alterno;
}

export function numero(valor: unknown, alterno = 0): number {
  const n = typeof valor === "string" ? Number(valor) : valor;
  return typeof n === "number" && Number.isFinite(n) ? n : alterno;
}

export function listaTexto(valor: unknown): string[] {
  return Array.isArray(valor)
    ? valor.filter((v): v is string => typeof v === "string" && v.trim() !== "").map((v) => v.trim())
    : [];
}

/** Acepta Timestamp, Date o texto `YYYY-MM-DD...` y devuelve `YYYY-MM-DD`. */
export function fechaIso(valor: unknown): string {
  if (valor instanceof Timestamp) return toIsoLocal(valor.toDate());
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) return toIsoLocal(valor);
  if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}/.test(valor)) return valor.slice(0, 10);
  return "";
}

/** `YYYY-MM-DD` → Timestamp a medianoche local. */
export function aTimestamp(fecha: string): Timestamp {
  const [y, m, d] = fecha.split("-").map(Number);
  return Timestamp.fromDate(new Date(y, m - 1, d));
}

/** Primera URL http(s) disponible entre los campos de imagen conocidos. */
export function imagenDe(datos: DocumentData): ImageSourcePropType | null {
  const candidatos = [
    datos.imagenUrl,
    datos.imagen,
    datos.foto,
    datos.fotoUrl,
    ...(Array.isArray(datos.fotos) ? datos.fotos : []),
    ...(Array.isArray(datos.imagenes) ? datos.imagenes : []),
  ];
  const url = candidatos.find((c): c is string => typeof c === "string" && /^https?:\/\//i.test(c));
  return url ? { uri: url } : null;
}

/** Clave estable para agrupar por tipo: "Suite Lujo" → "suite-lujo". */
export function claveTipo(tipo: string): string {
  return tipo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function mensajeErrorDatos(error: unknown, recurso: string): string {
  const code = (error as { code?: string })?.code ?? "";
  if (code.includes("permission-denied")) {
    return `No tienes permiso para ver ${recurso}. Si tu cuenta está activa, contacta al hotel.`;
  }
  if (code.includes("unavailable") || code.includes("network")) {
    return `No se pudo conectar para cargar ${recurso}. Revisa tu conexión e inténtalo de nuevo.`;
  }
  return `No se pudo cargar ${recurso}. Inténtalo de nuevo.`;
}
