import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DetalleHabitacion from "../../components/DetalleHabitacion";
import Navbar from "../../components/Navbar";
import { obtenerHabitacionPorId, rutaConfirmacion } from "../../datos/reserva";
import { estilosPantallaHabitacion as styles } from "../../estilos/habitaciones";

/** Detalle de habitación como pantalla propia (enlaces directos / deep links). */
export default function DetalleHabitacionPantalla() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const habitacion = obtenerHabitacionPorId(id);

  return (
    <View style={styles.pantalla}>
      <Navbar mostrarAtras />
      <View style={styles.contenido}>
        <DetalleHabitacion
          habitacion={habitacion}
          onReservar={() => router.push(rutaConfirmacion({ habitacionId: habitacion.id }))}
        />
      </View>
    </View>
  );
}
