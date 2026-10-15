import { View } from "react-native";
import { COLORES } from "../constants/colors";
import { AMENIDADES } from "../datos/contenido";
import { useResponsive } from "../hooks/useResponsive";
import Contenedor from "./ui/Contenedor";
import EncabezadoSeccion from "./ui/EncabezadoSeccion";
import Icono, { type NombreIcono } from "./ui/Icono";
import Rejilla from "./ui/Rejilla";
import Texto from "./ui/Texto";
import { estilosAmenidades as styles } from "../estilos/inicio";

const ICONOS: Record<(typeof AMENIDADES)[number]["icono"], NombreIcono> = {
  bed: "cama",
  utensils: "cubiertos",
  waves: "olas",
  sun: "sol",
  parking: "parqueo",
  party: "fiesta",
  wifi: "wifi",
  clock: "reloj",
};

export default function Amenidades() {
  const { columnas } = useResponsive();

  return (
    <View style={styles.seccion}>
      <Contenedor>
        <EncabezadoSeccion
          script="Todo lo que necesitas"
          titulo="Nuestras amenidades"
          descripcion="Entretenimiento y descanso en un solo lugar, pensado para tu día de playa o tu estancia completa."
          style={styles.encabezado}
        />

        <Rejilla columnas={columnas({ base: 1, sm: 2, lg: 4 })} separacion={24}>
          {AMENIDADES.map((item) => (
            <View key={item.id} style={styles.item}>
              <Icono nombre={ICONOS[item.icono]} tamano={28} color={COLORES.sea} />
              <Texto peso="medio" color={COLORES.sea} tamano={16} style={styles.texto}>
                {item.titulo}
              </Texto>
            </View>
          ))}
        </Rejilla>
      </Contenedor>
    </View>
  );
}
