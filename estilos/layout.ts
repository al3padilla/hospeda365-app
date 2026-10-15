import { StyleSheet } from "react-native";
import { COLORES, conAlfa } from "../constants/colors";

/** Navbar */
export const estilosNavbar = StyleSheet.create({
  nav: {
    backgroundColor: "rgba(232,244,250,0.97)",
    borderBottomWidth: 1,
    borderBottomColor: conAlfa(COLORES.sea, 0.1),
    zIndex: 50,
  },
  barra: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
  },
  izquierda: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1 },
  atras: { padding: 4 },
  enlacesEscritorio: { flexDirection: "row", alignItems: "center", gap: 22 },
  botonMenu: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: COLORES.coral,
    alignItems: "center",
    justifyContent: "center",
  },
  menuMovil: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: conAlfa(COLORES.sea, 0.1),
    backgroundColor: COLORES.celeste,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  enlaceMovil: { paddingVertical: 4 },
  placeholder: {
    height: 36,
    width: 96,
    borderRadius: 6,
    backgroundColor: conAlfa(COLORES.sea, 0.1),
  },
  chipUsuario: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.2),
    borderRadius: 6,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 10,
  },
  avatarChico: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORES.sea,
    alignItems: "center",
    justifyContent: "center",
  },
  bloqueUsuario: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: conAlfa(COLORES.sea, 0.1),
    paddingTop: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORES.sea,
    alignItems: "center",
    justifyContent: "center",
  },
  nombreUsuario: { maxWidth: 140 },
  filaUsuario: { flexDirection: "row", alignItems: "center", gap: 10 },
  datosUsuario: { flex: 1 },
  botonCerrarSesion: { paddingVertical: 8, alignItems: "center" },
});

/** Footer */
export const estilosFooter = StyleSheet.create({
  footer: { backgroundColor: COLORES.seaDeep, marginTop: "auto" },
  columnas: { paddingVertical: 48, gap: 40 },
  columnasFila: { flexDirection: "row" },
  columna: { flex: 1 },
  descripcion: { marginTop: 16, lineHeight: 22, maxWidth: 320 },
  titulo: { marginBottom: 16, letterSpacing: 0.4 },
  item: { marginBottom: 8 },
  copy: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingVertical: 16,
  },
  copyright: { textAlign: "center" },
});

/** PageShell */
export const estilosPageShell = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: COLORES.background },
  flex: { flex: 1 },
  contenido: { flexGrow: 1 },
});

/** WhatsAppFloat */
export const estilosWhatsAppFloat = StyleSheet.create({
  contenedor: { position: "absolute", zIndex: 50 },
  boton: {
    backgroundColor: COLORES.whatsapp,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORES.whatsapp,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});

/** Loader */
export const estilosLoader = StyleSheet.create({
  inline: { alignItems: "center", justifyContent: "center", gap: 12, paddingVertical: 32 },
  pagina: {
    flex: 1,
    minHeight: 420,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 16,
    backgroundColor: COLORES.background,
  },
  circulo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.1),
    backgroundColor: COLORES.foam,
    alignItems: "center",
    justifyContent: "center",
  },
  puntos: { flexDirection: "row", gap: 6, marginTop: 8 },
  punto: { width: 8, height: 8, borderRadius: 4 },
  skeletonCard: {
    overflow: "hidden",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.1),
    backgroundColor: COLORES.foam,
  },
  textosPagina: { alignItems: "center" },
  tituloPagina: { textAlign: "center" },
  subtituloPagina: { marginTop: 4, textAlign: "center" },
  skeletonImagen: { height: 176, borderRadius: 0 },
  skeletonCuerpo: { padding: 20, gap: 12 },
  skeletonTitulo: { height: 24, width: 160 },
  skeletonLinea: { height: 16, width: "100%" },
  skeletonLineaCorta: { height: 16, width: "75%" },
  skeletonPie: { flexDirection: "row", justifyContent: "space-between", paddingTop: 8 },
  skeletonPrecio: { height: 20, width: 80 },
  skeletonBoton: { height: 36, width: 112 },
});

/** HojaModal */
export const estilosHojaModal = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: conAlfa(COLORES.seaDeep, 0.55) },
  fondoAbajo: { justifyContent: "flex-end" },
  fondoCentro: { justifyContent: "center", alignItems: "center", padding: 24 },
  panel: {
    width: "100%",
    backgroundColor: COLORES.foam,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: conAlfa(COLORES.sea, 0.1),
  },
  panelAbajo: { borderTopLeftRadius: 20, borderTopRightRadius: 20, alignSelf: "center" },
  panelCentro: { borderRadius: 16 },
  agarradera: { position: "absolute", top: 8, left: 0, right: 0, alignItems: "center" },
  barraAgarradera: { width: 40, height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.9)" },
});

/** FotoLightbox */
export const estilosFotoLightbox = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", alignItems: "center", justifyContent: "center" },
  cerrar: {
    position: "absolute",
    right: 16,
    zIndex: 20,
    borderRadius: 6,
    backgroundColor: COLORES.foam,
    padding: 10,
  },
});

/** Logo */
export const estilosLogo = StyleSheet.create({
  contenedor: { flexDirection: "row", alignItems: "center", gap: 10 },
  nombre: { letterSpacing: -0.3 },
  subtitulo: { letterSpacing: 1.3 },
});
