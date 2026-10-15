import { Linking, View } from "react-native";
import { COLORES } from "../constants/colors";
import { CONTACTO, DAYPASS_INCLUYE } from "../datos/contenido";
import { useResponsive } from "../hooks/useResponsive";
import Boton from "./ui/Boton";
import Contenedor from "./ui/Contenedor";
import EncabezadoSeccion from "./ui/EncabezadoSeccion";
import Icono from "./ui/Icono";
import Texto from "./ui/Texto";
import { estilosDayPass as styles } from "../estilos/inicio";

export default function DayPass() {
  const { esSm, esLg } = useResponsive();

  return (
    <View style={styles.seccion}>
      <Contenedor style={[styles.rejilla, esLg && styles.rejillaFila]}>
        <View style={esLg ? styles.flex : undefined}>
          <EncabezadoSeccion
            script="Día de playa en el paraíso"
            titulo="Day Pass"
            descripcion="Disfruta el hotel sin hospedarte: piscinas, playa, áreas comunes y un vale de consumo. Ideal para un día completo de sol y descanso."
            style={styles.encabezado}
          />
          <Boton
            texto="Consultar Day Pass"
            variante="sea"
            onPress={() => void Linking.openURL(CONTACTO.whatsapp)}
            style={styles.botonConsultar}
          />
        </View>

        <View style={[styles.tarjeta, { padding: esSm ? 32 : 24 }, esLg && styles.flex]}>
          <Texto peso="semi" color={COLORES.sea} tamano={18} style={styles.tituloIncluye}>
            ¿Qué incluye?
          </Texto>
          <View style={styles.listaIncluye}>
            {DAYPASS_INCLUYE.map((item) => (
              <View key={item} style={styles.item}>
                <Icono nombre="check" tamano={20} color={COLORES.coral} />
                <Texto color={COLORES.mist} tamano={15} style={styles.textoIncluye}>
                  {item}
                </Texto>
              </View>
            ))}
          </View>
        </View>
      </Contenedor>
    </View>
  );
}
