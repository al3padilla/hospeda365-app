import { useState } from "react";
import { View } from "react-native";
import { COLORES } from "../constants/colors";
import { useHabitaciones } from "../contexto/HabitacionesContext";
import type { Habitacion } from "../datos/habitaciones";
import { useResponsive } from "../hooks/useResponsive";
import DatePicker from "./DatePicker";
import GuestsPicker, {
  resumenHuespedes,
  totalParaCapacidad,
  type Huespedes,
} from "./GuestsPicker";
import Boton from "./ui/Boton";
import Icono from "./ui/Icono";
import Texto from "./ui/Texto";
import { pluralizar } from "../datos/texto";
import { estilosSearchBar as styles } from "../estilos/inicio";

function mensajeResultado(
  habitaciones: Habitacion[],
  huespedes: Huespedes,
  personas: number,
): string {
  const disponibles = habitaciones.filter((h) => h.capacity >= personas);
  const detalle = resumenHuespedes(huespedes);

  return disponibles.length > 0
    ? `${pluralizar(disponibles.length, "habitación", "habitaciones")} · ${detalle}`
    : `No hay habitaciones para ${personas} o más huéspedes (${detalle})`;
}

type SearchBarProps = {
  /** Se llama al buscar, para desplazar la vista hasta las habitaciones. */
  onBuscar?: () => void;
};

export default function SearchBar({ onBuscar }: SearchBarProps) {
  const { esSm } = useResponsive();
  const { buscar, habitaciones, cargando } = useHabitaciones();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [huespedes, setHuespedes] = useState<Huespedes>({ adultos: 2, ninos: 0, bebes: 0 });
  const [message, setMessage] = useState("");

  function handleSubmit() {
    if (cargando) return;

    const personas = totalParaCapacidad(huespedes);

    buscar({
      checkIn,
      checkOut,
      personas,
      adultos: huespedes.adultos,
      ninos: huespedes.ninos,
      bebes: huespedes.bebes,
    });

    setMessage(mensajeResultado(habitaciones, huespedes, personas));
    onBuscar?.();
  }

  function onCheckInChange(value: string) {
    setCheckIn(value);
    if (checkOut && value && checkOut <= value) setCheckOut("");
  }

  return (
    <View style={styles.seccion}>
      <View style={[styles.formulario, esSm && styles.formularioFila]}>
        <View style={esSm ? styles.flex : undefined}>
          <DatePicker
            label="Check-in"
            value={checkIn}
            onChange={onCheckInChange}
            icon={<Icono nombre="calendarioCheck" tamano={14} color={COLORES.mist} />}
            placeholder="Fecha de llegada"
          />
        </View>

        <View style={esSm ? styles.flex : undefined}>
          <DatePicker
            label="Check-out"
            value={checkOut}
            onChange={setCheckOut}
            min={checkIn || undefined}
            icon={<Icono nombre="calendarioX" tamano={14} color={COLORES.mist} />}
            placeholder="Fecha de salida"
          />
        </View>

        <View style={esSm ? { width: 190 } : undefined}>
          <GuestsPicker value={huespedes} onChange={setHuespedes} />
        </View>

        <Boton
          texto="Buscar"
          icono="buscar"
          cargando={cargando}
          textoCargando="Buscando…"
          onPress={handleSubmit}
          style={esSm ? { marginTop: 24 } : undefined}
        />
      </View>

      {message ? (
        <Texto color={COLORES.mist} tamano={14} style={styles.mensaje}>
          {message}
        </Texto>
      ) : null}
    </View>
  );
}
