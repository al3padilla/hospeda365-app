import { Image, View } from "react-native";
import { SOBRE_HOTEL } from "../datos/contenido";
import { useResponsive } from "../hooks/useResponsive";
import Contenedor from "./ui/Contenedor";
import EncabezadoSeccion from "./ui/EncabezadoSeccion";
import { estilosSobreHotel as styles } from "../estilos/inicio";

export default function SobreHotel() {
  const { esSm, esLg } = useResponsive();

  return (
    <View style={styles.seccion}>
      <Contenedor style={[styles.rejilla, esLg && styles.rejillaFila]}>
        <Image
          source={SOBRE_HOTEL.imagen}
          resizeMode="cover"
          accessibilityLabel="Vista del Hotel Terra Azul"
          style={[styles.imagen, { height: esSm ? 360 : 280 }, esLg && styles.flex]}
        />
        <View style={esLg ? styles.flex : undefined}>
          <EncabezadoSeccion
            script={SOBRE_HOTEL.script}
            titulo={SOBRE_HOTEL.titulo}
            descripcion={SOBRE_HOTEL.texto}
          />
        </View>
      </Contenedor>
    </View>
  );
}
