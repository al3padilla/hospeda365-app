import { StyleSheet } from "react-native";
import { COLORES } from "../constants/colors";

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

/** AccionesFlotantes (+ / subir / actualizar) */
export const estilosAccionesFlotantes = StyleSheet.create({
  contenedor: {
    position: "absolute",
    zIndex: 51,
    alignItems: "center",
    gap: 10,
  },
  menu: { alignItems: "center", gap: 10 },
  fab: {
    backgroundColor: COLORES.coral,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORES.sea,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 7,
  },
  accion: {
    backgroundColor: COLORES.sea,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORES.sea,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  accionUpdate: { backgroundColor: COLORES.coralHover },
  accionPressed: { opacity: 0.88 },
});