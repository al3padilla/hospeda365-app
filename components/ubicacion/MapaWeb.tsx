import { createElement, useMemo } from "react";
import { View } from "react-native";
import { UBICACION } from "../../datos/ubicacion";
import { estilosUbicacionHotel as styles } from "../../estilos/ubicacion";
import { urlMapaEmbedOsm } from "../../utilidades/navegacionMapas";

/** Mapa embebido para web (sin react-native-maps). */
export default function MapaWeb() {
  const src = useMemo(() => urlMapaEmbedOsm(), []);

  return (
    <View style={styles.mapa}>
      {createElement("iframe", {
        title: `Mapa ${UBICACION.nombre}`,
        src,
        style: { width: "100%", height: "100%", border: 0 },
        allowFullScreen: true,
      })}
    </View>
  );
}