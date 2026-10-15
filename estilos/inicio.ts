import { StyleSheet } from "react-native";
import { COLORES, conAlfa, SOMBRA_TARJETA } from "../constants/colors";

/** HeroCarousel */
export const estilosHeroCarousel = StyleSheet.create({
  hero: { overflow: "hidden", backgroundColor: COLORES.seaDeep },
  contenido: {
    width: "100%",
    maxWidth: 768,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  descripcion: { maxWidth: 448, lineHeight: 28, marginBottom: 32 },
  botones: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  puntos: {
    position: "absolute",
    bottom: 56,
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
  },
  punto: { height: 10, width: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.55)" },
  puntoActivo: { width: 28, backgroundColor: COLORES.coral },
  script: { marginBottom: 4 },
});

/** SearchBar */
export const estilosSearchBar = StyleSheet.create({
  seccion: {
    width: "100%",
    maxWidth: 1024,
    alignSelf: "center",
    paddingHorizontal: 16,
    marginTop: -40,
    marginBottom: 64,
    zIndex: 30,
  },
  formulario: {
    gap: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.1),
    backgroundColor: COLORES.foam,
    padding: 16,
    ...SOMBRA_TARJETA,
  },
  formularioFila: { flexDirection: "row", alignItems: "flex-start", padding: 20 },
  flex: { flex: 1 },
  mensaje: { marginTop: 12, textAlign: "center" },
});

/** DatePicker */
export const estilosDatePicker = StyleSheet.create({
  etiqueta: { flexDirection: "row", alignItems: "center", gap: 6 },
  etiquetaTexto: { textTransform: "uppercase", letterSpacing: 1 },
  campo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.15),
    borderRadius: 6,
    backgroundColor: COLORES.foam,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  cabecera: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  flecha: { padding: 6, borderRadius: 6 },
  semana: { flexDirection: "row", flexWrap: "wrap" },
  celda: { width: `${100 / 7}%`, alignItems: "center", paddingVertical: 2 },
  dia: { width: 38, height: 38, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  pie: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: conAlfa(COLORES.sea, 0.1),
    paddingTop: 10,
  },
  calendario: { padding: 14 },
  diaSemana: { textTransform: "uppercase" },
  contenedorCampo: { gap: 6 },
});

/** GuestsPicker */
export const estilosGuestsPicker = StyleSheet.create({
  etiqueta: { textTransform: "uppercase", letterSpacing: 1 },
  campo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.15),
    borderRadius: 6,
    backgroundColor: COLORES.foam,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  total: {
    borderRadius: 999,
    backgroundColor: conAlfa(COLORES.sea, 0.1),
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 8,
  },
  botonContador: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.2),
    alignItems: "center",
    justifyContent: "center",
  },
  filaEtiqueta: { flexDirection: "row", alignItems: "flex-start", gap: 10, flex: 1 },
  iconoEtiqueta: { marginTop: 2 },
  controles: { flexDirection: "row", alignItems: "center", gap: 8 },
  contador: { width: 24, textAlign: "center" },
  etiquetaCampo: { flexDirection: "row", alignItems: "center", gap: 6 },
  resumen: { flex: 1 },
  hoja: { padding: 16 },
  botonListo: { marginTop: 10 },
  contenedorCampo: { gap: 6 },
});

/** SobreHotel */
export const estilosSobreHotel = StyleSheet.create({
  seccion: { backgroundColor: COLORES.foam, paddingVertical: 64 },
  rejilla: { gap: 40 },
  rejillaFila: { flexDirection: "row", alignItems: "center" },
  imagen: { width: "100%", borderRadius: 8 },
  flex: { flex: 1 },
});

/** Amenidades */
export const estilosAmenidades = StyleSheet.create({
  seccion: { backgroundColor: COLORES.background, paddingVertical: 64 },
  item: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  texto: { flex: 1, lineHeight: 22, marginTop: 2 },
  encabezado: { marginBottom: 40 },
});

/** DayPass */
export const estilosDayPass = StyleSheet.create({
  seccion: { backgroundColor: COLORES.foam, paddingVertical: 64 },
  rejilla: { gap: 40 },
  rejillaFila: { flexDirection: "row", alignItems: "center" },
  flex: { flex: 1 },
  tarjeta: {
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.1),
    borderRadius: 8,
    backgroundColor: COLORES.background,
  },
  item: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  encabezado: { marginBottom: 24 },
  botonConsultar: { alignSelf: "flex-start" },
  tituloIncluye: { marginBottom: 16, letterSpacing: 0.3 },
  listaIncluye: { gap: 12 },
  textoIncluye: { flex: 1 },
});

/** PantallaInicio */
export const estilosPantallaInicio = StyleSheet.create({
  buscador: { zIndex: 30 },
});
