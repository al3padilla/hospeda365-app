import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORES } from "../constants/colors";
import { IMAGENES_INICIO, INTERVALO_CARRUSEL_MS } from "../datos/inicio";
import { useResponsive } from "../hooks/useResponsive";
import Aparecer from "./ui/Aparecer";
import Boton from "./ui/Boton";
import Texto from "./ui/Texto";
import { estilosHeroCarousel as styles } from "../estilos/inicio";

type HeroCarouselProps = {
  onReservar: () => void;
  onVerHabitaciones: () => void;
};

export default function HeroCarousel({ onReservar, onVerHabitaciones }: HeroCarouselProps) {
  const { alto, esSm, esMd } = useResponsive();
  const [index, setIndex] = useState(0);
  const total = IMAGENES_INICIO.length;
  const opacidades = useRef(IMAGENES_INICIO.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;

  useEffect(() => {
    if (total === 0) return;
    const id = setInterval(() => setIndex((actual) => (actual + 1) % total), INTERVALO_CARRUSEL_MS);
    return () => clearInterval(id);
  }, [index, total]);

  useEffect(() => {
    Animated.parallel(
      opacidades.map((valor, i) =>
        Animated.timing(valor, { toValue: i === index ? 1 : 0, duration: 700, useNativeDriver: true }),
      ),
    ).start();
  }, [index, opacidades]);

  const altoHero = Math.max(520, Math.min(alto * 0.82, 820));
  const tamanoTitulo = esMd ? 68 : esSm ? 58 : 46;

  return (
    <View style={[styles.hero, { height: altoHero, justifyContent: esSm ? "center" : "flex-end" }]}>
      {IMAGENES_INICIO.map((src, i) => (
        <Animated.Image
          key={i}
          source={src}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { opacity: opacidades[i] }]}
          accessibilityElementsHidden={i !== index}
        />
      ))}

      <LinearGradient
        colors={["rgba(8,42,71,0.72)", "rgba(8,42,71,0.35)", "rgba(8,42,71,0.2)"]}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={[styles.contenido, { paddingBottom: esSm ? 0 : 96 }]}>
        <Aparecer>
          <Texto peso="script" color="rgba(255,255,255,0.9)" tamano={esSm ? 38 : 32} style={styles.script}>
            Toma un break
          </Texto>
        </Aparecer>
        <Aparecer retraso={150}>
          <Texto
            peso="display"
            color={COLORES.foam}
            tamano={tamanoTitulo}
            style={{ lineHeight: tamanoTitulo * 1.08, marginBottom: 20 }}
          >
            Hotel Terra Azul
          </Texto>
        </Aparecer>
        <Aparecer retraso={300}>
          <Texto color="rgba(255,255,255,0.85)" tamano={18} style={styles.descripcion}>
            Hotel de playa para vacaciones inolvidables. Reserva tu habitación
            ideal con check-in sencillo y atención personalizada.
          </Texto>
          <View style={styles.botones}>
            <Boton texto="RESERVAR AHORA" mayusculas onPress={onReservar} />
            <Boton texto="Ver habitaciones" variante="bordeClaro" onPress={onVerHabitaciones} />
          </View>
        </Aparecer>
      </View>

      {total > 0 ? (
        <View style={styles.puntos}>
          {IMAGENES_INICIO.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => setIndex(i)}
              accessibilityRole="button"
              accessibilityLabel={`Ir a foto ${i + 1}`}
              accessibilityState={{ selected: i === index }}
              hitSlop={8}
              style={[styles.punto, i === index ? styles.puntoActivo : null]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
