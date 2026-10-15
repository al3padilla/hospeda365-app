import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, View } from "react-native";
import { COLORES, conAlfa } from "../constants/colors";
import Texto from "./ui/Texto";
import { estilosLoader as styles } from "../estilos/layout";

export function Spinner({
  color = COLORES.coral,
  grande = false,
}: {
  color?: string;
  grande?: boolean;
}) {
  return <ActivityIndicator color={color} size={grande ? "large" : "small"} />;
}

export function LoaderInline({ texto = "Cargando…" }: { texto?: string }) {
  return (
    <View style={styles.inline} accessibilityRole="progressbar" accessibilityLabel={texto}>
      <Spinner grande />
      <Texto peso="medio" color={COLORES.mist} tamano={14}>
        {texto}
      </Texto>
    </View>
  );
}

function PuntoPulso({ retraso, opacidad }: { retraso: number; opacidad: number }) {
  const valor = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.delay(retraso),
        Animated.timing(valor, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(valor, { toValue: 0.3, duration: 500, useNativeDriver: true }),
      ]),
    );
    animacion.start();
    return () => animacion.stop();
  }, [retraso, valor]);

  return (
    <Animated.View
      style={[styles.punto, { backgroundColor: conAlfa(COLORES.coral, opacidad), opacity: valor }]}
    />
  );
}

export function PageLoader({
  titulo = "Cargando…",
  subtitulo = "Preparando tu experiencia en Hotel Terra Azul",
}: {
  titulo?: string;
  subtitulo?: string;
}) {
  return (
    <View style={styles.pagina} accessibilityRole="progressbar" accessibilityLabel={titulo}>
      <View style={styles.circulo}>
        <Spinner grande />
      </View>
      <View style={styles.textosPagina}>
        <Texto peso="display" color={COLORES.sea} tamano={24} style={styles.tituloPagina}>
          {titulo}
        </Texto>
        <Texto color={COLORES.mist} tamano={14} style={styles.subtituloPagina}>
          {subtitulo}
        </Texto>
      </View>
      <View style={styles.puntos}>
        <PuntoPulso retraso={0} opacidad={1} />
        <PuntoPulso retraso={150} opacidad={0.7} />
        <PuntoPulso retraso={300} opacidad={0.4} />
      </View>
    </View>
  );
}

function Skeleton({ style }: { style: object }) {
  const valor = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(valor, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(valor, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    animacion.start();
    return () => animacion.stop();
  }, [valor]);

  return (
    <Animated.View
      style={[{ backgroundColor: conAlfa(COLORES.sea, 0.2), borderRadius: 6, opacity: valor }, style]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <Skeleton style={styles.skeletonImagen} />
      <View style={styles.skeletonCuerpo}>
        <Skeleton style={styles.skeletonTitulo} />
        <Skeleton style={styles.skeletonLinea} />
        <Skeleton style={styles.skeletonLineaCorta} />
        <View style={styles.skeletonPie}>
          <Skeleton style={styles.skeletonPrecio} />
          <Skeleton style={styles.skeletonBoton} />
        </View>
      </View>
    </View>
  );
}
