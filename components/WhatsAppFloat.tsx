import { useEffect, useRef } from "react";
import { Animated, Easing, Linking, Pressable } from "react-native";
import { COLORES } from "../constants/colors";
import { CONTACTO } from "../datos/contenido";
import { useResponsive } from "../hooks/useResponsive";
import { vibrarToque } from "../utilidades/hapticos";
import Icono from "./ui/Icono";
import { estilosWhatsAppFloat as styles } from "../estilos/layout";

export default function WhatsAppFloat() {
  const { esSm } = useResponsive();
  const flotar = useRef(new Animated.Value(0)).current;
  const tamano = esSm ? 52 : 44;
  const margen = esSm ? 20 : 14;

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(flotar, { toValue: -3, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(flotar, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    animacion.start();
    return () => animacion.stop();
  }, [flotar]);

  function abrirWhatsApp() {
    vibrarToque();
    void Linking.openURL(CONTACTO.whatsapp);
  }

  return (
    <Animated.View
      style={[styles.contenedor, { right: margen, bottom: margen, transform: [{ translateY: flotar }] }]}
    >
      <Pressable
        onPress={abrirWhatsApp}
        accessibilityRole="link"
        accessibilityLabel="Contactar por WhatsApp"
        hitSlop={8}
        style={[styles.boton, { width: tamano, height: tamano, borderRadius: tamano / 2 }]}
      >
        <Icono nombre="whatsapp" tamano={esSm ? 26 : 22} color={COLORES.foam} />
      </Pressable>
    </Animated.View>
  );
}
