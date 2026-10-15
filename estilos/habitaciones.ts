import { StyleSheet } from "react-native";
import { COLORES, conAlfa } from "../constants/colors";

/** HabitacionesDestacadas */
export const estilosHabitacionesDestacadas = StyleSheet.create({
  seccion: { paddingVertical: 64 },
  filtro: { gap: 12 },
  filtroFila: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 24 },
  quitar: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-end" },
  vacio: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: conAlfa(COLORES.sea, 0.2),
    backgroundColor: COLORES.foam,
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  textoFiltro: { lineHeight: 24, flex: 1 },
  encabezado: { marginBottom: 40 },
  descripcion: { lineHeight: 24, maxWidth: 640 },
  textoVacio: { textAlign: "center" },
});

/** RoomCard */
export const estilosRoomCard = StyleSheet.create({
  tarjeta: {
    flex: 1,
    backgroundColor: COLORES.foam,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.1),
    borderRadius: 8,
  },
  imagenContenedor: { height: 224, backgroundColor: conAlfa(COLORES.sea, 0.2) },
  imagen: { width: "100%", height: "100%" },
  verMasFlotante: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cuerpo: { flex: 1, gap: 12, padding: 20 },
  fila: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  botones: { flexDirection: "row", gap: 8, marginTop: 4 },
  flex: { flex: 1, paddingHorizontal: 10 },
  descripcion: { lineHeight: 22 },
});

/** DetalleHabitacion */
export const estilosDetalleHabitacion = StyleSheet.create({
  cabecera: { overflow: "hidden", backgroundColor: conAlfa(COLORES.sea, 0.15) },
  foto: { width: "100%", height: "100%" },
  ampliar: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  accionesFoto: { position: "absolute", top: 20, right: 12, flexDirection: "row", gap: 8 },
  botonFoto: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  cuerpo: { gap: 14 },
  cuerpoMovil: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  cuerpoAmplio: { padding: 28, gap: 20 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.1),
    backgroundColor: COLORES.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipCompacto: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, gap: 5 },
  highlight: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  barraReserva: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORES.foam,
    borderTopWidth: 1,
    borderTopColor: conAlfa(COLORES.sea, 0.08),
  },
  acciones: {
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: COLORES.foam,
    borderTopWidth: 1,
    borderTopColor: conAlfa(COLORES.sea, 0.06),
  },
  flex: { flex: 1 },
  titulos: { gap: 2 },
  tituloIncluye: { marginBottom: 10, letterSpacing: 0.3 },
  listaIncluye: { gap: 6 },
  textoIncluye: { flex: 1 },
  botonReservar: { paddingHorizontal: 28 },
  descripcion: { lineHeight: 24 },
  descripcionMovil: { lineHeight: 21 },
});

/** PantallaHabitacion */
export const estilosPantallaHabitacion = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: COLORES.foam },
  contenido: { flex: 1, width: "100%", maxWidth: 720, alignSelf: "center" },
});
