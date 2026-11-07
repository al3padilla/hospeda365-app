import { View } from "react-native";
import { COLORES, conAlfa } from "../constants/colors";
import { estilosEstadoVista as styles } from "../estilos/feedback";
import Boton from "./ui/Boton";
import Icono, { type NombreIcono } from "./ui/Icono";
import Texto from "./ui/Texto";

type EstadoVacioProps = {
  icono?: NombreIcono;
  titulo: string;
  descripcion: string;
  accionTexto?: string;
  onAccion?: () => void;
};

/** Estado vacío con icono, copy y CTA opcional. */
export function EstadoVacio({
  icono = "calendario",
  titulo,
  descripcion,
  accionTexto,
  onAccion,
}: EstadoVacioProps) {
  return (
    <View style={styles.caja} accessibilityRole="summary">
      <View style={styles.iconoCirculo}>
        <Icono nombre={icono} tamano={28} color={COLORES.coral} />
      </View>
      <Texto peso="display" color={COLORES.sea} tamano={22} style={styles.titulo}>
        {titulo}
      </Texto>
      <Texto color={COLORES.mist} tamano={14} style={styles.descripcion}>
        {descripcion}
      </Texto>
      {accionTexto && onAccion ? (
        <Boton texto={accionTexto} onPress={onAccion} variante="borde" tamano="sm" style={styles.accion} />
      ) : null}
    </View>
  );
}

type EstadoErrorProps = {
  mensaje?: string;
  onReintentar?: () => void;
};

/** Estado de error con reintento (listo para fallos de red/Firestore). */
export function EstadoError({
  mensaje = "No pudimos cargar la información. Inténtalo de nuevo.",
  onReintentar,
}: EstadoErrorProps) {
  return (
    <View
      style={[styles.caja, { borderColor: COLORES.rojoBorde, backgroundColor: COLORES.rojoClaro }]}
      accessibilityRole="alert"
    >
      <View style={[styles.iconoCirculo, { backgroundColor: conAlfa(COLORES.rojo, 0.1) }]}>
        <Icono nombre="alerta" tamano={28} color={COLORES.rojo} />
      </View>
      <Texto peso="display" color={COLORES.rojo} tamano={20} style={styles.titulo}>
        Algo salió mal
      </Texto>
      <Texto color={COLORES.rojo} tamano={14} style={styles.descripcion}>
        {mensaje}
      </Texto>
      {onReintentar ? (
        <Boton texto="Reintentar" onPress={onReintentar} variante="borde" tamano="sm" style={styles.accion} />
      ) : null}
    </View>
  );
}
