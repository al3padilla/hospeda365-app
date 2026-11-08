import { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { COLORES, conAlfa } from "../constants/colors";
import { useReservas } from "../contexto/ReservasContext";
import { formatearFecha } from "../datos/fechas";
import type { ReservaHistorial } from "../types/hotel";
import { formatearPrecio } from "../datos/reserva";
import { useResponsive } from "../hooks/useResponsive";
import BadgeEstado from "./BadgeEstado";
import { EstadoError, EstadoVacio } from "./EstadoVista";
import { SkeletonReserva } from "./Loader";
import ReservaHistorialModal from "./ReservaHistorialModal";
import EncabezadoSeccion from "./ui/EncabezadoSeccion";
import Icono from "./ui/Icono";
import Rejilla from "./ui/Rejilla";
import Texto from "./ui/Texto";
import { estilosHistorialReservas as styles } from "../estilos/reservas";

function ReservaCard({
  reserva,
  onAbrir,
  horizontal,
}: {
  reserva: ReservaHistorial;
  onAbrir: () => void;
  horizontal: boolean;
}) {
  return (
    <Pressable
      onPress={onAbrir}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de reserva Habitación ${reserva.habitacionNombre}`}
      style={({ pressed }) => [
        styles.tarjeta,
        horizontal && styles.tarjetaFila,
        pressed && { borderColor: conAlfa(COLORES.sea, 0.25) },
      ]}
    >
      <Image
        source={reserva.imagen}
        resizeMode="cover"
        style={horizontal ? styles.fotoFila : styles.foto}
      />

      <View style={styles.cuerpo}>
        <View style={styles.cabecera}>
          <Texto peso="display" color={COLORES.sea} tamano={20} style={styles.nombreHabitacion}>
            Habitación {reserva.habitacionNombre}
          </Texto>
          <BadgeEstado estado={reserva.estado} />
        </View>

        <View style={styles.filaEstado}>
          <Icono nombre="calendarioRango" tamano={16} color={COLORES.coral} />
          <Texto color={COLORES.mist} tamano={14}>
            {formatearFecha(reserva.checkIn)} — {formatearFecha(reserva.checkOut)}
          </Texto>
        </View>

        <View style={styles.pie}>
          <View style={styles.filaFechas}>
            <Icono nombre="ojo" tamano={14} color={COLORES.coral} />
            <Texto peso="semi" color={COLORES.sea} tamano={12}>
              Ver detalle
            </Texto>
          </View>
          <View style={styles.filaTotal}>
            <Texto color={COLORES.mist} tamano={12} style={styles.etiquetaTotal}>
              Total
            </Texto>
            <Texto peso="semi" color={COLORES.sea} tamano={18}>
              {formatearPrecio(reserva.total)}
            </Texto>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function HistorialReservas() {
  const router = useRouter();
  const { esLg, columnas } = useResponsive();
  const { reservas, cargando, error, reintentar } = useReservas();
  const [seleccionada, setSeleccionada] = useState<ReservaHistorial | null>(null);

  const cols = columnas({ base: 1, md: 2 });
  const horizontal = esLg;

  return (
    <View style={styles.seccion}>
      <EncabezadoSeccion
        script="Tus viajes"
        titulo="Historial de reservas"
        icono={<Icono nombre="historial" tamano={34} color={COLORES.coral} />}
        descripcion="Consulta tus estancias pasadas y próximas. Desliza hacia abajo para actualizar."
        style={styles.encabezado}
      />

      {cargando ? (
        <View accessibilityLabel="Cargando historial de reservas" style={{ gap: 20 }}>
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonReserva key={i} />
          ))}
        </View>
      ) : error ? (
        <EstadoError mensaje={error} onReintentar={() => void reintentar()} />
      ) : reservas.length === 0 ? (
        <EstadoVacio
          icono="calendarioReloj"
          titulo="Sin reservas aún"
          descripcion="Cuando reserves una habitación, aparecerá aquí con su estado en tiempo real."
          accionTexto="Explorar habitaciones"
          onAccion={() => router.push("/(tabs)/habitaciones")}
        />
      ) : (
        <Rejilla columnas={cols} separacion={20}>
          {reservas.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              horizontal={horizontal}
              onAbrir={() => setSeleccionada(reserva)}
            />
          ))}
        </Rejilla>
      )}

      <ReservaHistorialModal reserva={seleccionada} onClose={() => setSeleccionada(null)} />
    </View>
  );
}
