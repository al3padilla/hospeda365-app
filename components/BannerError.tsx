import { Pressable, View } from "react-native";
import Icono from "./ui/Icono";
import Texto from "./ui/Texto";
import { estilosBannerError as styles } from "../estilos/cuenta";

type BannerErrorProps = {
  mensaje: string;
  onCerrar?: () => void;
};

/** Error general del formulario (no de un campo específico). */
export default function BannerError({ mensaje, onCerrar }: BannerErrorProps) {
  return (
    <View style={styles.banner} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Icono nombre="alerta" tamano={16} color="#B91C1C" style={styles.icono} />
      <Texto color="#B91C1C" tamano={14} style={styles.mensaje}>
        {mensaje}
      </Texto>
      {onCerrar ? (
        <Pressable onPress={onCerrar} accessibilityLabel="Cerrar mensaje de error" hitSlop={8}>
          <Icono nombre="cerrar" tamano={16} color="#F87171" />
        </Pressable>
      ) : null}
    </View>
  );
}
