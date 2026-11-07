import { useEffect, useRef, useState } from "react";
import { Animated, Platform, Pressable, View } from "react-native";
import { COLORES } from "../constants/colors";
import { useResponsive } from "../hooks/useResponsive";
import { vibrarToque } from "../utilidades/hapticos";
import Icono from "./ui/Icono";
import { estilosAccionesFlotantes as styles } from "../estilos/flotantes";

type AccionesFlotantesProps = {
  /** Visible cuando el usuario ya bajo en el scroll. */
  visible: boolean;
  onSubir: () => void;
  onActualizar: () => void;
  actualizando?: boolean;
};

/** FAB + encima de WhatsApp: subir al inicio y actualizar pantalla. */
export default function AccionesFlotantes({
  visible,
  onSubir,
  onActualizar,
  actualizando = false,
}: AccionesFlotantesProps) {
  const { esSm } = useResponsive();
  const [abierto, setAbierto] = useState(false);
  const opacidad = useRef(new Animated.Value(0)).current;
  const escala = useRef(new Animated.Value(0.85)).current;
  const nativo = Platform.OS !== "web";

  const tamano = esSm ? 52 : 44;
  const margen = esSm ? 20 : 14;
  const bottom = margen + tamano + 12;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacidad, {
        toValue: visible ? 1 : 0,
        duration: 180,
        useNativeDriver: nativo,
      }),
      Animated.timing(escala, {
        toValue: visible ? 1 : 0.85,
        duration: 180,
        useNativeDriver: nativo,
      }),
    ]).start();
    if (!visible) setAbierto(false);
  }, [visible, opacidad, escala, nativo]);

  function toggle() {
    vibrarToque();
    setAbierto((v) => !v);
  }

  function subir() {
    vibrarToque();
    setAbierto(false);
    onSubir();
  }

  function actualizar() {
    vibrarToque();
    setAbierto(false);
    onActualizar();
  }

  const botonSize = { width: tamano, height: tamano, borderRadius: tamano / 2 };

  return (
    <Animated.View
      pointerEvents={visible ? "box-none" : "none"}
      style={[
        styles.contenedor,
        { right: margen, bottom, opacity: opacidad, transform: [{ scale: escala }] },
      ]}
    >
      {abierto ? (
        <View style={styles.menu}>
          <Pressable
            onPress={subir}
            accessibilityRole="button"
            accessibilityLabel="Volver arriba"
            style={({ pressed }) => [styles.accion, botonSize, pressed && styles.accionPressed]}
          >
            <Icono nombre="flechaArriba" tamano={esSm ? 24 : 20} color={COLORES.foam} />
          </Pressable>

          <Pressable
            onPress={actualizar}
            disabled={actualizando}
            accessibilityRole="button"
            accessibilityLabel="Actualizar pantalla"
            style={({ pressed }) => [
              styles.accion,
              styles.accionUpdate,
              botonSize,
              pressed && styles.accionPressed,
              actualizando && { opacity: 0.7 },
            ]}
          >
            <Icono nombre="refrescar" tamano={esSm ? 24 : 20} color={COLORES.foam} />
          </Pressable>
        </View>
      ) : null}

      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={abierto ? "Cerrar acciones" : "Abrir acciones"}
        accessibilityState={{ expanded: abierto }}
        style={({ pressed }) => [
          styles.fab,
          botonSize,
          abierto && { backgroundColor: COLORES.seaDeep },
          pressed && { opacity: 0.9 },
        ]}
      >
        <Icono nombre={abierto ? "cerrar" : "mas"} tamano={esSm ? 28 : 24} color={COLORES.foam} />
      </Pressable>
    </Animated.View>
  );
}
