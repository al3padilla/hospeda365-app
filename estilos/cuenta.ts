import { StyleSheet } from "react-native";
import { COLORES, conAlfa, SOMBRA_TARJETA } from "../constants/colors";
import { FUENTES } from "../constants/fuentes";

/** FormularioLogin */
export const estilosFormularioLogin = StyleSheet.create({
  separador: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 24 },
  linea: { height: 1, flex: 1, backgroundColor: conAlfa(COLORES.sea, 0.1) },
  banner: { marginBottom: 20 },
  campos: { gap: 16 },
  botonEnviar: { marginTop: 4 },
});

/** FormularioRegistro */
export const estilosFormularioRegistro = StyleSheet.create({
  flex: { flex: 1 },
  fuerza: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 8 },
  barras: { flex: 1, flexDirection: "row", gap: 4 },
  barra: { height: 4, flex: 1, borderRadius: 999 },
  pie: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: conAlfa(COLORES.sea, 0.1),
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  banner: { marginBottom: 20 },
  campos: { gap: 16 },
  botonEnviar: { marginTop: 4 },
});

/** CampoAuth */
export const estilosCampoAuth = StyleSheet.create({
  etiqueta: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  etiquetaTexto: { textTransform: "uppercase", letterSpacing: 0.8 },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: COLORES.foam,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: COLORES.sea,
    fontFamily: FUENTES.regular,
  },
  ojo: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  textoError: { marginTop: 6 },
});

/** BannerError */
export const estilosBannerError = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORES.rojoBorde,
    backgroundColor: COLORES.rojoClaro,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  icono: { marginTop: 1 },
  mensaje: { flex: 1 },
});

/** TarjetaFormulario */
export const estilosTarjetaFormulario = StyleSheet.create({
  seccion: { width: "100%", alignSelf: "center", paddingHorizontal: 16, paddingVertical: 56 },
  tarjeta: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.1),
    backgroundColor: COLORES.foam,
    ...SOMBRA_TARJETA,
  },
  cabecera: { marginBottom: 24 },
  descripcion: { marginTop: 6 },
});

/** PanelCuenta */
export const estilosPanelCuenta = StyleSheet.create({
  seccion: { width: "100%", maxWidth: 896, alignSelf: "center", paddingHorizontal: 16, paddingVertical: 48 },
  tarjeta: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.1),
    backgroundColor: COLORES.foam,
  },
  cabecera: { gap: 16, marginBottom: 24, padding: 24, alignItems: "flex-start" },
  cabeceraFila: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORES.sea,
    alignItems: "center",
    justifyContent: "center",
  },
  datos: { marginBottom: 32, paddingHorizontal: 20 },
  filaDato: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  separadorDato: { borderTopWidth: 1, borderTopColor: conAlfa(COLORES.sea, 0.08) },
  opcion: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 14, padding: 20 },
  opcionPresionada: { borderColor: conAlfa(COLORES.coral, 0.4) },
  iconoOpcion: {
    width: 40,
    height: 40,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: conAlfa(COLORES.coral, 0.1),
  },
  etiquetaCabecera: { textTransform: "uppercase", letterSpacing: 1.4 },
  etiquetaDato: { textTransform: "uppercase", letterSpacing: 1 },
  subtitulo: { marginTop: 2 },
  tituloSeccion: { marginBottom: 16 },
  expandir: { flex: 1 },
});