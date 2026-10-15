import { View } from "react-native";
import { COLORES } from "../constants/colors";
import Icono from "./ui/Icono";
import Texto from "./ui/Texto";
import { estilosLogo as styles } from "../estilos/layout";

type LogoProps = {
  claro?: boolean;
  compacto?: boolean;
};

export default function Logo({ claro = false, compacto = false }: LogoProps) {
  return (
    <View style={styles.contenedor}>
      <Icono
        nombre="palmera"
        tamano={compacto ? 30 : 36}
        color={claro ? COLORES.coral : COLORES.sea}
      />
      <View>
        <Texto
          peso="display"
          color={claro ? COLORES.foam : COLORES.sea}
          tamano={compacto ? 19 : 22}
          style={styles.nombre}
        >
          Hotel terra azul
        </Texto>
        <Texto
          color={claro ? "rgba(255,255,255,0.5)" : COLORES.mist}
          tamano={11}
          style={styles.subtitulo}
        >
          by Hospeda365
        </Texto>
      </View>
    </View>
  );
}
