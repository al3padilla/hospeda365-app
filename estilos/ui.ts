import { StyleSheet } from "react-native";

/** Boton */
export const estilosBoton = StyleSheet.create({
  base: {
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  md: { paddingHorizontal: 24, paddingVertical: 12 },
  sm: { paddingHorizontal: 14, paddingVertical: 9 },
  fila: { flexDirection: "row", alignItems: "center", gap: 8 },
  mayusculas: { letterSpacing: 0.6 },
});

/** EncabezadoSeccion */
export const estilosEncabezadoSeccion = StyleSheet.create({
  script: { marginBottom: 2 },
  filaTitulo: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  descripcion: { lineHeight: 25 },
});
