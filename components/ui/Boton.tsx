import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { COLORES, conAlfa } from "../../constants/colors";
import { vibrarToque } from "../../utilidades/hapticos";
import Icono, { type NombreIcono } from "./Icono";
import Texto from "./Texto";
import { estilosBoton as styles } from "../../estilos/ui";

type Variante = "coral" | "sea" | "borde" | "bordeClaro" | "texto";

type BotonProps = {
  texto: string;
  onPress?: () => void;
  variante?: Variante;
  icono?: NombreIcono;
  cargando?: boolean;
  textoCargando?: string;
  deshabilitado?: boolean;
  /** Mayúsculas con tracking, como los CTA de la web. */
  mayusculas?: boolean;
  tamano?: "md" | "sm";
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  children?: ReactNode;
};

const ESTILOS_VARIANTE: Record<
  Variante,
  { fondo: string; fondoPresionado: string; borde: string; texto: string }
> = {
  coral: { fondo: COLORES.coral, fondoPresionado: COLORES.coralHover, borde: "transparent", texto: COLORES.foam },
  sea: { fondo: COLORES.sea, fondoPresionado: COLORES.seaDeep, borde: "transparent", texto: COLORES.foam },
  borde: { fondo: "transparent", fondoPresionado: COLORES.background, borde: conAlfa(COLORES.sea, 0.2), texto: COLORES.sea },
  bordeClaro: { fondo: "transparent", fondoPresionado: "rgba(255,255,255,0.1)", borde: "rgba(255,255,255,0.7)", texto: COLORES.foam },
  texto: { fondo: "transparent", fondoPresionado: "transparent", borde: "transparent", texto: COLORES.coral },
};

export default function Boton({
  texto,
  onPress,
  variante = "coral",
  icono,
  cargando = false,
  textoCargando,
  deshabilitado = false,
  mayusculas = false,
  tamano = "md",
  style,
  accessibilityLabel,
}: BotonProps) {
  const v = ESTILOS_VARIANTE[variante];
  const inactivo = deshabilitado || cargando;

  return (
    <Pressable
      onPress={
        onPress
          ? () => {
              vibrarToque();
              onPress();
            }
          : undefined
      }
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? texto}
      accessibilityState={{ disabled: inactivo, busy: cargando }}
      style={({ pressed }) => [
        styles.base,
        tamano === "sm" ? styles.sm : styles.md,
        {
          backgroundColor: pressed ? v.fondoPresionado : v.fondo,
          borderColor: v.borde,
          opacity: deshabilitado && !cargando ? 0.45 : cargando ? 0.8 : 1,
        },
        style,
      ]}
    >
      <View style={styles.fila}>
        {cargando ? (
          <ActivityIndicator size="small" color={v.texto} />
        ) : icono ? (
          <Icono nombre={icono} tamano={16} color={v.texto} />
        ) : null}
        <Texto
          peso="semi"
          color={v.texto}
          tamano={tamano === "sm" ? 14 : 15}
          style={mayusculas ? styles.mayusculas : undefined}
        >
          {cargando && textoCargando ? textoCargando : texto}
        </Texto>
      </View>
    </Pressable>
  );
}
