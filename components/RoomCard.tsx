import { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { COLORES } from "../constants/colors";
import type { Habitacion } from "../datos/habitaciones";
import { rutaConfirmacion } from "../datos/reserva";
import DetalleHabitacion from "./DetalleHabitacion";
import HojaModal from "./HojaModal";
import Boton from "./ui/Boton";
import Icono from "./ui/Icono";
import Texto from "./ui/Texto";
import { pluralizar } from "../datos/texto";
import { estilosRoomCard as styles } from "../estilos/habitaciones";

type RoomCardProps = {
  habitacion: Habitacion;
  checkIn?: string;
  checkOut?: string;
};

export default function RoomCard({ habitacion, checkIn, checkOut }: RoomCardProps) {
  const router = useRouter();
  const [detalleAbierto, setDetalleAbierto] = useState(false);
  const { id, name, description, pricePerNight, capacity, imagen } = habitacion;

  function reservar() {
    setDetalleAbierto(false);
    router.push(rutaConfirmacion({ habitacionId: id, checkIn, checkOut }));
  }

  return (
    <>
      <View style={styles.tarjeta}>
        <Pressable
          onPress={() => setDetalleAbierto(true)}
          accessibilityRole="button"
          accessibilityLabel={`Ver más sobre habitación ${name}`}
          style={({ pressed }) => [styles.imagenContenedor, pressed && { opacity: 0.92 }]}
        >
          <Image source={imagen} resizeMode="cover" style={styles.imagen} />
          <View style={styles.verMasFlotante}>
            <Icono nombre="ojo" tamano={14} color={COLORES.coral} />
            <Texto peso="semi" color={COLORES.sea} tamano={12}>
              Ver más
            </Texto>
          </View>
        </Pressable>

        <View style={styles.cuerpo}>
          <Texto peso="display" color={COLORES.sea} tamano={24}>
            {name}
          </Texto>
          <Texto color={COLORES.mist} tamano={14} numberOfLines={3} style={styles.descripcion}>
            {description}
          </Texto>
          <View style={styles.fila}>
            <Texto color={COLORES.mist} tamano={14}>
              Hasta {pluralizar(capacity, "persona")}
            </Texto>
            <Texto peso="semi" color={COLORES.sea} tamano={14}>
              ${pricePerNight.toLocaleString("es-MX")}
              <Texto color={COLORES.mist} tamano={14}>
                {" "}/ noche
              </Texto>
            </Texto>
          </View>
          <View style={styles.botones}>
            <Boton
              texto="Ver más"
              icono="ojo"
              variante="borde"
              tamano="sm"
              onPress={() => setDetalleAbierto(true)}
              style={styles.flex}
            />
            <Boton texto="Reservar" variante="sea" tamano="sm" onPress={reservar} style={styles.flex} />
          </View>
        </View>
      </View>

      <HojaModal
        visible={detalleAbierto}
        onClose={() => setDetalleAbierto(false)}
        anchoMaximo={672}
        etiqueta={`Detalle de habitación ${name}`}
      >
        <DetalleHabitacion
          habitacion={habitacion}
          onReservar={reservar}
          onClose={() => setDetalleAbierto(false)}
        />
      </HojaModal>
    </>
  );
}
