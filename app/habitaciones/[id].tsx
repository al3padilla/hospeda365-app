import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DetalleHabitacion from "../../components/DetalleHabitacion";
import { EstadoError, EstadoVacio } from "../../components/EstadoVista";
import { PageLoader } from "../../components/Loader";
import Navbar from "../../components/Navbar";
import { useHabitaciones } from "../../contexto/HabitacionesContext";
import { rutaConfirmacion } from "../../datos/reserva";
import { estilosPantallaHabitacion as styles } from "../../estilos/habitaciones";

/** Detalle de habitación como pantalla propia (enlaces directos / deep links). */
export default function DetalleHabitacionPantalla() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { obtenerHabitacion, cargando, error, reintentar } = useHabitaciones();
  const habitacion = obtenerHabitacion(id);

  return (
    <View style={styles.pantalla}>
      <Navbar mostrarAtras />
      <View style={styles.contenido}>
        {cargando ? (
          <PageLoader titulo="Cargando habitación…" />
        ) : error ? (
          <EstadoError mensaje={error} onReintentar={reintentar} />
        ) : !habitacion ? (
          <EstadoVacio
            icono="cama"
            titulo="Habitación no encontrada"
            descripcion="Esta habitación ya no está disponible en el catálogo del hotel."
            accionTexto="Ver habitaciones"
            onAccion={() => router.replace("/(tabs)/habitaciones")}
          />
        ) : (
          <DetalleHabitacion
            habitacion={habitacion}
            onReservar={() => router.push(rutaConfirmacion({ habitacionId: habitacion.id }))}
          />
        )}
      </View>
    </View>
  );
}
