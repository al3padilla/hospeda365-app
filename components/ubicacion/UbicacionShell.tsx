import { useState, type ReactNode } from "react";
import { View } from "react-native";
import { COLORES } from "../../constants/colors";
import { UBICACION } from "../../datos/ubicacion";
import { estilosUbicacionHotel as styles } from "../../estilos/ubicacion";
import { vibrarToque } from "../../utilidades/hapticos";
import Contenedor from "../ui/Contenedor";
import EncabezadoSeccion from "../ui/EncabezadoSeccion";
import Icono from "../ui/Icono";
import Texto from "../ui/Texto";
import BotonComoLlegar from "./BotonComoLlegar";
import SelectorAppsNavegacion from "./SelectorAppsNavegacion";

type Props = { mapa: ReactNode };

/** Layout de la sección: dirección + mapa + botón Como llegar. */
export default function UbicacionShell({ mapa }: Props) {
  const [elegirApp, setElegirApp] = useState(false);

  function abrirComoLlegar() {
    vibrarToque();
    setElegirApp(true);
  }

  return (
    <View style={styles.seccion}>
      <Contenedor>
        <EncabezadoSeccion
          script="Cómo llegar"
          titulo="Dónde nos ubicamos"
          descripcion="Estamos en primera fila frente al mar. Explora el mapa o toca Como llegar para ir desde tu ubicación."
          style={styles.encabezado}
        />

        <View style={styles.tarjetaDireccion}>
          <View style={styles.iconoDireccion}>
            <Icono nombre="ubicacion" tamano={22} color={COLORES.coral} />
          </View>
          <View style={styles.flex}>
            <Texto peso="semi" color={COLORES.sea} tamano={16}>
              {UBICACION.nombre}
            </Texto>
            <Texto color={COLORES.mist} tamano={14} style={styles.textoDireccion}>
              {UBICACION.direccion}
            </Texto>
          </View>
        </View>

        <View style={styles.mapaBloque}>
          <View style={styles.mapaCaja}>
            {mapa}
            <View style={styles.ocultarAtribucion} pointerEvents="none" />
            <BotonComoLlegar onPress={abrirComoLlegar} />
          </View>
        </View>
      </Contenedor>

      <SelectorAppsNavegacion visible={elegirApp} onClose={() => setElegirApp(false)} />
    </View>
  );
}