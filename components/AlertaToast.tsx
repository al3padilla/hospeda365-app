import { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORES, conAlfa } from "../constants/colors";
import type { Alerta, TipoAlerta } from "../contexto/AlertaContext";
import { estilosAlertaToast as styles } from "../estilos/feedback";
import Icono, { type NombreIcono } from "./ui/Icono";
import Texto from "./ui/Texto";

const META: Record<
  TipoAlerta,
  { icono: NombreIcono; fondo: string; borde: string; color: string }
> = {
  exito: {
    icono: "checkCirculo",
    fondo: "#ECFDF5",
    borde: "#A7F3D0",
    color: COLORES.verde,
  },
  error: {
    icono: "alerta",
    fondo: COLORES.rojoClaro,
    borde: COLORES.rojoBorde,
    color: COLORES.rojo,
  },
  info: {
    icono: "alerta",
    fondo: COLORES.celeste,
    borde: conAlfa(COLORES.sea, 0.2),
    color: COLORES.sea,
  },
};

type AlertaToastProps = {
  alerta: Alerta | null;
  onCerrar: () => void;
};

/** Toast flotante para éxito, error e info (feedback global de UX). */
export default function AlertaToast({ alerta, onCerrar }: AlertaToastProps) {
  const insets = useSafeAreaInsets();
  const opacidad = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    if (!alerta) return;

    opacidad.setValue(0);
    translateY.setValue(-12);

    Animated.parallel([
      Animated.timing(opacidad, { toValue: 1, duration: 220, useNativeDriver: Platform.OS !== "web" }),
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: Platform.OS !== "web" }),
    ]).start();
  }, [alerta, opacidad, translateY]);

  if (!alerta) return null;

  const meta = META[alerta.tipo];

  return (
    <View
      pointerEvents="box-none"
      style={[styles.capa, { paddingTop: Math.max(insets.top, 12) + 8 }]}
    >
      <Animated.View
        style={[
          styles.toast,
          { backgroundColor: meta.fondo, borderColor: meta.borde, opacity: opacidad, transform: [{ translateY }] },
        ]}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        <Icono nombre={meta.icono} tamano={20} color={meta.color} style={styles.icono} />
        <Texto color={meta.color} tamano={14} peso="medio" style={styles.mensaje}>
          {alerta.mensaje}
        </Texto>
        <Pressable onPress={onCerrar} accessibilityLabel="Cerrar alerta" hitSlop={10}>
          <Icono nombre="cerrar" tamano={16} color={meta.color} />
        </Pressable>
      </Animated.View>
    </View>
  );
}
