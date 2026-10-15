import { Text, type TextProps } from "react-native";
import { COLORES } from "../../constants/colors";
import { FUENTES, type PesoFuente } from "../../constants/fuentes";

type TextoProps = TextProps & {
  peso?: PesoFuente;
  color?: string;
  tamano?: number;
};

/** `Text` con la tipografía y color base de la web. */
export default function Texto({
  peso = "regular",
  color = COLORES.foreground,
  tamano,
  style,
  ...props
}: TextoProps) {
  return (
    <Text
      {...props}
      style={[
        { fontFamily: FUENTES[peso], color },
        tamano !== undefined ? { fontSize: tamano } : null,
        style,
      ]}
    />
  );
}
