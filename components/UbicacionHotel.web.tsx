import MapaWeb from "./ubicacion/MapaWeb";
import UbicacionShell from "./ubicacion/UbicacionShell";

/** Web: mapa embebido (sin react-native-maps). */
export default function UbicacionHotel() {
  return <UbicacionShell mapa={<MapaWeb />} />;
}