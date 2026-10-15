import { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { COLORES, conAlfa } from "../constants/colors";
import { formatearFecha } from "../datos/fechas";
import { RESERVAS_HISTORIAL, type ReservaHistorial } from "../datos/historialReservas";
import { formatearPrecio } from "../datos/reserva";
import { useResponsive } from "../hooks/useResponsive";
import BadgeEstado from "./BadgeEstado";
import ReservaHistorialModal from "./ReservaHistorialModal";
import EncabezadoSeccion from "./ui/EncabezadoSeccion";
import Icono from "./ui/Icono";
import Rejilla from "./ui/Rejilla";
import Texto from "./ui/Texto";
import { estilosHistorialReservas as styles } from "../estilos/reservas";

function ReservaCard({ reserva, onAbrir }: { reserva: ReservaHistorial; onAbrir: () => void }) {
  const { esSm } = useResponsive();

  return (
    <Pressable
      onPress={onAbrir}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de reserva Habitación ${reserva.habitacionNombre}`}
      style={({ pressed }) => [
        styles.tarjeta,
        esSm && { flexDirection: "row" },
        pressed && { borderColor: conAlfa(COLORES.sea, 0.25) },
      ]}
    >
      <Image
        source={reserva.imagen}
        resizeMode="cover"
        style={esSm ? { width: 160, minHeight: 150 } : { width: "100%", height: 144 }}
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
  const { columnas } = useResponsive();
  const reservas = RESERVAS_HISTORIAL;
  const [seleccionada, setSeleccionada] = useState<ReservaHistorial | null>(null);

  return (
    <View style={styles.seccion}>
      <EncabezadoSeccion
        script="Tus viajes"
        titulo="Historial de reservas"
        icono={<Icono nombre="historial" tamano={34} color={COLORES.coral} />}
        descripcion="Consulta tus estancias pasadas y próximas. Los estados se actualizan cuando el hotel confirma o cancela tu solicitud."
        style={styles.encabezado}
      />

      {reservas.length === 0 ? (
        <View style={styles.vacio}>
          <Texto color={COLORES.mist} tamano={15} style={styles.textoVacio}>
            Aún no tienes reservas registradas.
          </Texto>
        </View>
      ) : (
        <Rejilla columnas={columnas({ base: 1, lg: 2 })} separacion={20}>
          {reservas.map((reserva) => (
            <ReservaCard key={reserva.id} reserva={reserva} onAbrir={() => setSeleccionada(reserva)} />
          ))}
        </Rejilla>
      )}

      <ReservaHistorialModal reserva={seleccionada} onClose={() => setSeleccionada(null)} />
    </View>
  );
}
