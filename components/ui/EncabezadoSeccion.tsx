import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { COLORES } from "../../constants/colors";
import Texto from "./Texto";
import { estilosEncabezadoSeccion as styles } from "../../estilos/ui";

type EncabezadoSeccionProps = {
  script?: string;
  titulo: string;
  descripcion?: string;
  /** Contenido a la izquierda del título (ej. icono). */
  icono?: ReactNode;
  tamanoTitulo?: number;
  style?: StyleProp<ViewStyle>;
};

/** Patrón de la web: frase en Great Vibes + título en Fraunces + descripción. */
export default function EncabezadoSeccion({
  script,
  titulo,
  descripcion,
  icono,
  tamanoTitulo = 34,
  style,
}: EncabezadoSeccionProps) {
  return (
    <View style={[{ maxWidth: 640 }, style]}>
      {script ? (
        <Texto peso="script" color={COLORES.mist} tamano={30} style={styles.script}>
          {script}
        </Texto>
      ) : null}
      <View style={styles.filaTitulo}>
        {icono}
        <Texto
          peso="display"
          color={COLORES.sea}
          tamano={tamanoTitulo}
          style={{ lineHeight: tamanoTitulo * 1.15, flexShrink: 1 }}
        >
          {titulo}
        </Texto>
      </View>
      {descripcion ? (
        <Texto color={COLORES.mist} tamano={16} style={styles.descripcion}>
          {descripcion}
        </Texto>
      ) : null}
    </View>
  );
}
