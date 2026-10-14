
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";

import type { Habitacion } from "../data/habitaciones";

type Props = {
  habitacion: Habitacion;
  onPress: () => void;
};

const COLORS = {
  primary: "#0C3B66",
  accent: "#E8911A",
  secondary: "#5A7A9A",
  white: "#FFFFFF",
  lightBlue: "#E8F4FA",
};

export default function HabitacionCard({
  habitacion,
  onPress,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.imagenContenedor}>
        <Image
          source={habitacion.imagen}
          style={styles.imagen}
          resizeMode="cover"
          accessibilityLabel={`Imagen de ${habitacion.nombre}`}
        />

        <View style={styles.etiquetaImagen}>
          <Text style={styles.textoEtiquetaImagen}>
            HOTEL TERRA AZUL
          </Text>
        </View>
      </View>

      <View style={styles.contenido}>
        <View style={styles.encabezado}>
          <View style={styles.etiqueta}>
            <Text style={styles.textoEtiqueta}>
              ALOJAMIENTO
            </Text>
          </View>

          <Text style={styles.icono}>✦</Text>
        </View>

        <Text style={styles.nombre}>
          {habitacion.nombre}
        </Text>

        <Text style={styles.descripcion}>
          Descubre esta opción de alojamiento
          y conoce sus características.
        </Text>

        <View style={styles.separador} />

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            pressed && styles.botonPresionado,
          ]}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalles de ${habitacion.nombre}`}
        >
          <Text style={styles.textoBoton}>
            Ver detalles
          </Text>

          <Text style={styles.flecha}>
            →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    marginBottom: 22,
    overflow: "hidden",

    elevation: 4,
    shadowColor: "#0C3B66",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  imagenContenedor: {
    position: "relative",
  },

  imagen: {
    width: "100%",
    height: 215,
  },

  etiquetaImagen: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(12,59,102,0.88)",
    borderRadius: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  textoEtiquetaImagen: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  contenido: {
    padding: 18,
  },

  encabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  etiqueta: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  textoEtiqueta: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  icono: {
    color: COLORS.accent,
    fontSize: 22,
  },

  nombre: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 9,
  },

  descripcion: {
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 21,
    marginBottom: 17,
  },

  separador: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 17,
  },

  boton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  botonPresionado: {
    opacity: 0.85,
  },

  textoBoton: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 15,
  },

  flecha: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 19,
    marginLeft: 10,
  },
});
