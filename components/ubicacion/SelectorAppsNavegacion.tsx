import { Linking, Pressable, View } from "react-native";
import { COLORES, conAlfa } from "../../constants/colors";
import { UBICACION } from "../../datos/ubicacion";
import { estilosUbicacionHotel as styles } from "../../estilos/ubicacion";
import {
  urlGoogleMapsDesdeMiUbicacion,
  urlWazeDesdeMiUbicacion,
} from "../../utilidades/navegacionMapas";
import { vibrarToque } from "../../utilidades/hapticos";
import HojaModal from "../HojaModal";
import Icono from "../ui/Icono";
import Texto from "../ui/Texto";

type Props = {
  visible: boolean;
  onClose: () => void;
};

/** Hoja para elegir Google Maps o Waze (ruta desde ubicación actual). */
export default function SelectorAppsNavegacion({ visible, onClose }: Props) {
  async function abrirCon(app: "google" | "waze") {
    vibrarToque();
    onClose();
    const url = app === "google" ? urlGoogleMapsDesdeMiUbicacion() : urlWazeDesdeMiUbicacion();
    await Linking.openURL(url);
  }

  return (
    <HojaModal
      visible={visible}
      onClose={onClose}
      etiqueta="Elegir aplicación de navegación"
      anchoMaximo={420}
    >
      <View style={styles.hoja}>
        <Texto peso="display" color={COLORES.sea} tamano={22} style={styles.hojaTitulo}>
          Abrir con
        </Texto>
        <Texto color={COLORES.mist} tamano={14} style={styles.hojaDesc}>
          Calcularemos la ruta desde tu ubicación actual hasta {UBICACION.nombre}.
        </Texto>

        <Pressable
          onPress={() => void abrirCon("google")}
          style={({ pressed }) => [
            styles.opcionApp,
            pressed && { backgroundColor: conAlfa(COLORES.coral, 0.08) },
          ]}
        >
          <View style={styles.opcionIcono}>
            <Icono nombre="maps" tamano={24} color={COLORES.coral} />
          </View>
          <View style={styles.flex}>
            <Texto peso="semi" color={COLORES.sea} tamano={16}>
              Google Maps
            </Texto>
            <Texto color={COLORES.mist} tamano={13}>
              Ruta desde donde estás ahora
            </Texto>
          </View>
          <Icono nombre="chevronDer" tamano={18} color={COLORES.mist} />
        </Pressable>

        <Pressable
          onPress={() => void abrirCon("waze")}
          style={({ pressed }) => [
            styles.opcionApp,
            pressed && { backgroundColor: conAlfa(COLORES.coral, 0.08) },
          ]}
        >
          <View style={styles.opcionIcono}>
            <Icono nombre="waze" tamano={24} color={COLORES.coral} />
          </View>
          <View style={styles.flex}>
            <Texto peso="semi" color={COLORES.sea} tamano={16}>
              Waze
            </Texto>
            <Texto color={COLORES.mist} tamano={13}>
              Navegación desde tu ubicación
            </Texto>
          </View>
          <Icono nombre="chevronDer" tamano={18} color={COLORES.mist} />
        </Pressable>
      </View>
    </HojaModal>
  );
}