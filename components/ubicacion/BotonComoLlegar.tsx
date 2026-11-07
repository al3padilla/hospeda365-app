import { useEffect, useRef } from "react";
import { Animated, Easing, Platform, Pressable } from "react-native";
import { COLORES } from "../../constants/colors";
import { estilosUbicacionHotel as styles } from "../../estilos/ubicacion";
import Icono from "../ui/Icono";
import Texto from "../ui/Texto";

const USA_NATIVE_DRIVER = Platform.OS !== "web";

type Props = { onPress: () => void };

/** Botón flotante con pulso (estilo WhatsApp) sobre el pie del mapa. */
export default function BotonComoLlegar({ onPress }: Props) {
  const flotar = useRef(new Animated.Value(0)).current;
  const escala = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(flotar, {
          toValue: -4,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USA_NATIVE_DRIVER,
        }),
        Animated.timing(flotar, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USA_NATIVE_DRIVER,
        }),
      ]),
    );
    animacion.start();
    return () => animacion.stop();
  }, [flotar]);

  function alPresionarIn() {
    Animated.spring(escala, {
      toValue: 0.94,
      useNativeDriver: USA_NATIVE_DRIVER,
      speed: 40,
      bounciness: 0,
    }).start();
  }

  function alPresionarOut() {
    Animated.spring(escala, {
      toValue: 1,
      useNativeDriver: USA_NATIVE_DRIVER,
      speed: 20,
      bounciness: 8,
    }).start();
  }

  return (
    <Animated.View
      style={[styles.botonFlotanteWrap, { transform: [{ translateY: flotar }, { scale: escala }] }]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={alPresionarIn}
        onPressOut={alPresionarOut}
        accessibilityRole="button"
        accessibilityLabel="Como llegar"
        style={({ pressed }) => [styles.mapaChip, pressed && styles.mapaChipPressed]}
      >
        <Icono nombre="navegacion" tamano={18} color={COLORES.foam} />
        <Texto peso="semi" color={COLORES.foam} tamano={14}>
          Como llegar
        </Texto>
      </Pressable>
    </Animated.View>
  );
}