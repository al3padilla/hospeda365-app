import type { ReactNode } from "react";
import { View } from "react-native";
import { COLORES } from "../constants/colors";
import { useResponsive } from "../hooks/useResponsive";
import Aparecer from "./ui/Aparecer";
import Texto from "./ui/Texto";
import { estilosTarjetaFormulario as styles } from "../estilos/cuenta";

type TarjetaFormularioProps = {
  titulo: string;
  descripcion: string;
  anchoMaximo: number;
  children: ReactNode;
};

/** Tarjeta blanca centrada de login/registro. */
export default function TarjetaFormulario({
  titulo,
  descripcion,
  anchoMaximo,
  children,
}: TarjetaFormularioProps) {
  const { esSm } = useResponsive();

  return (
    <View style={[styles.seccion, { maxWidth: anchoMaximo }]}>
      <Aparecer style={[styles.tarjeta, { padding: esSm ? 32 : 24 }]}>
        <View style={styles.cabecera}>
          <Texto peso="display" color={COLORES.sea} tamano={30}>
            {titulo}
          </Texto>
          <Texto color={COLORES.mist} tamano={14} style={styles.descripcion}>
            {descripcion}
          </Texto>
        </View>
        {children}
      </Aparecer>
    </View>
  );
}
