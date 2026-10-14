
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";

import { habitaciones } from "../../data/habitaciones";
import HabitacionCard from "../../components/habitacionCard";

const COLORS = {
  background: "#F8FAFC",
  primary: "#0C3B66",
  accent: "#E8911A",
  secondary: "#5A7A9A",
  white: "#FFFFFF",
  lightBlue: "#E8F4FA",
};

const imagenesCarrusel = [
  require("../../assets/images/Hbasica.jpg"),
  require("../../assets/images/Hintermedia.jpg"),
  require("../../assets/images/Hvip.jpg"),
];

export default function Inicio() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [imagenActual, setImagenActual] = useState(0);

  const anchoCarrusel = Math.max(width - 40, 1);

  const siguienteImagen = () => {
    setImagenActual(
      (actual) => (actual + 1) % imagenesCarrusel.length
    );
  };

  const imagenAnterior = () => {
    setImagenActual(
      (actual) =>
        (actual - 1 + imagenesCarrusel.length) %
        imagenesCarrusel.length
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>Hotel Terra Azul</Text>
        <Text style={styles.marca}>by Hospeda365</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.etiquetaHero}>
          BIENVENIDO A TU PRÓXIMA ESTADÍA
        </Text>

        <Text style={styles.tituloHero}>
          Descubre tu lugar ideal
        </Text>

        <Text style={styles.descripcionHero}>
          Encuentra comodidad, descanso y una
          experiencia especial en cada habitación.
        </Text>

        <View style={styles.carrusel}>
          <Image
            source={imagenesCarrusel[imagenActual]}
            style={[
              styles.imagenCarrusel,
              { width: anchoCarrusel },
            ]}
            resizeMode="cover"
          />

          <View style={styles.controles}>
            <Pressable
              onPress={imagenAnterior}
              style={styles.control}
              accessibilityRole="button"
              accessibilityLabel="Fotografía anterior"
            >
              <Text style={styles.textoControl}>‹</Text>
            </Pressable>

            <Text style={styles.contador}>
              {imagenActual + 1} / {imagenesCarrusel.length}
            </Text>

            <Pressable
              onPress={siguienteImagen}
              style={styles.control}
              accessibilityRole="button"
              accessibilityLabel="Fotografía siguiente"
            >
              <Text style={styles.textoControl}>›</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={styles.botonExplorar}
          onPress={() =>
            router.push("/(tabs)/habitaciones")
          }
          accessibilityRole="button"
        >
          <Text style={styles.textoBoton}>
            Explorar habitaciones
          </Text>
        </Pressable>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.etiquetaSeccion}>
          DESCUBRE TU ESPACIO
        </Text>

        <Text style={styles.tituloSeccion}>
          Nuestras habitaciones
        </Text>

        <Text style={styles.descripcionSeccion}>
          Desde la opción Básica hasta Platinum:
          elige el nivel de comodidad que mejor
          se adapte a tu viaje.
        </Text>

        {habitaciones.map((habitacion) => (
          <HabitacionCard
            key={String(habitacion.id)}
            habitacion={habitacion}
            onPress={() =>
              router.push({
                pathname: "/habitaciones/[id]",
                params: { id: String(habitacion.id) },
              })
            }
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerMarca}>
          Hotel Terra Azul
        </Text>
        <Text style={styles.footerTexto}>
          Una experiencia Hospeda365
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contenido: {
    paddingBottom: 25,
  },
  header: {
    backgroundColor: COLORS.lightBlue,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  logo: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.primary,
  },
  marca: {
    fontSize: 12,
    color: COLORS.secondary,
    letterSpacing: 1,
    marginTop: 4,
  },
  hero: {
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  etiquetaHero: {
    color: "#F6B64A",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
  },
  tituloHero: {
    color: COLORS.white,
    fontSize: 29,
    fontWeight: "800",
    lineHeight: 36,
    marginBottom: 12,
  },
  descripcionHero: {
    color: COLORS.lightBlue,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 22,
  },
  carrusel: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#082A47",
    marginBottom: 18,
  },
  imagenCarrusel: {
    height: 205,
    width: "100%",
  },
  controles: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  control: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF22",
    alignItems: "center",
    justifyContent: "center",
  },
  textoControl: {
    color: COLORS.white,
    fontSize: 27,
    lineHeight: 30,
  },
  contador: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  botonExplorar: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBoton: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 15,
  },
  seccion: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  etiquetaSeccion: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  tituloSeccion: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 12,
  },
  descripcionSeccion: {
    fontSize: 15,
    color: COLORS.secondary,
    lineHeight: 23,
    marginBottom: 24,
  },
  footer: {
    backgroundColor: COLORS.lightBlue,
    alignItems: "center",
    padding: 24,
    marginTop: 20,
  },
  footerMarca: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 17,
  },
  footerTexto: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 5,
  },
});
