import { useState, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import { COLORES, conAlfa } from "../constants/colors";
import { useAlerta } from "../contexto/AlertaContext";
import { useHabitaciones } from "../contexto/HabitacionesContext";
import { formatearFecha } from "../datos/fechas";
import { pluralizar } from "../datos/texto";
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
import { estilosSearchBar as styles } from "../estilos/inicio";

type VarianteBusqueda = "completo" | "secciones";
type PasoSeccion = "llegada" | "salida" | "personas" | null;

type SearchBarProps = {
  /** Se llama al buscar (p. ej. ir al tab Habitaciones desde el inicio). */
  onBuscar?: () => void;
  /**
   * `completo`: todos los campos a la vez (Inicio).
   * `secciones`: un paso a la vez para no cortar en móvil (Habitaciones).
   */
  variante?: VarianteBusqueda;
};

export default function SearchBar({ onBuscar, variante = "completo" }: SearchBarProps) {
  const { esSm } = useResponsive();
  const { buscar, cargando } = useHabitaciones();
  const { exito, info } = useAlerta();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [huespedes, setHuespedes] = useState<Huespedes>({ adultos: 2, ninos: 0, bebes: 0 });
  const [message, setMessage] = useState("");
  const [paso, setPaso] = useState<PasoSeccion>("llegada");

  async function handleSubmit() {
    if (cargando) return;

    const personas = totalParaCapacidad(huespedes);
    const detalle = resumenHuespedes(huespedes);
    onBuscar?.();

    const filtradas = await buscar({
      checkIn,
      checkOut,
      personas,
      adultos: huespedes.adultos,
      ninos: huespedes.ninos,
      bebes: huespedes.bebes,
    });

    if (filtradas.length > 0) {
      const texto = `${pluralizar(filtradas.length, "habitación", "habitaciones")} disponibles · ${detalle}`;
      setMessage(texto);
      exito(texto);
    } else {
      const texto = `No hay habitaciones para ${personas} o más huéspedes (${detalle})`;
      setMessage(texto);
      info(texto);
    }
  }

  function onCheckInChange(value: string) {
    setCheckIn(value);
    if (checkOut && value && checkOut <= value) setCheckOut("");
  }

  function togglePaso(siguiente: Exclude<PasoSeccion, null>) {
    setPaso((actual) => (actual === siguiente ? null : siguiente));
  }

  if (variante === "secciones") {
    return (
      <View style={[styles.seccion, styles.seccionPlana]}>
        <View style={styles.formulario}>
          <Texto peso="semi" color={COLORES.sea} tamano={16} style={styles.tituloSecciones}>
            Filtrar disponibilidad
          </Texto>

          <Acordeon
            abierto={paso === "llegada"}
            titulo="Fecha de llegada"
            resumen={checkIn ? formatearFecha(checkIn) : "Elegir check-in"}
            icono="calendarioCheck"
            onToggle={() => togglePaso("llegada")}
          >
            <DatePicker
              label="Check-in"
              value={checkIn}
              onChange={(v) => {
                onCheckInChange(v);
                setPaso("salida");
              }}
              icon={<Icono nombre="calendarioCheck" tamano={14} color={COLORES.mist} />}
              placeholder="Fecha de llegada"
            />
          </Acordeon>

          <Acordeon
            abierto={paso === "salida"}
            titulo="Fecha de salida"
            resumen={checkOut ? formatearFecha(checkOut) : "Elegir check-out"}
            icono="calendarioX"
            onToggle={() => togglePaso("salida")}
          >
            <DatePicker
              label="Check-out"
              value={checkOut}
              onChange={(v) => {
                setCheckOut(v);
                setPaso("personas");
              }}
              min={checkIn || undefined}
              icon={<Icono nombre="calendarioX" tamano={14} color={COLORES.mist} />}
              placeholder="Fecha de salida"
            />
          </Acordeon>

          <Acordeon
            abierto={paso === "personas"}
            titulo="Huéspedes"
            resumen={resumenHuespedes(huespedes)}
            icono="personas"
            onToggle={() => togglePaso("personas")}
          >
            <GuestsPicker value={huespedes} onChange={setHuespedes} />
          </Acordeon>

          <Boton
            texto="Buscar"
            icono="buscar"
            cargando={cargando}
            textoCargando="Buscando…"
            onPress={() => void handleSubmit()}
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
          onPress={() => void handleSubmit()}
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

function Acordeon({
  abierto,
  titulo,
  resumen,
  icono,
  onToggle,
  children,
}: {
  abierto: boolean;
  titulo: string;
  resumen: string;
  icono: "calendarioCheck" | "calendarioX" | "personas";
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <View
      style={[
        styles.acordeon,
        abierto && { borderColor: conAlfa(COLORES.coral, 0.35), backgroundColor: COLORES.background },
      ]}
    >
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: abierto }}
        style={styles.acordeonCabecera}
      >
        <View style={styles.acordeonTitulo}>
          <Icono nombre={icono} tamano={18} color={COLORES.coral} />
          <View style={styles.flex}>
            <Texto peso="semi" color={COLORES.sea} tamano={14}>
              {titulo}
            </Texto>
            {!abierto ? (
              <Texto color={COLORES.mist} tamano={13}>
                {resumen}
              </Texto>
            ) : null}
          </View>
        </View>
        <Icono
          nombre={abierto ? "chevronAbajo" : "chevronDer"}
          tamano={18}
          color={COLORES.mist}
        />
      </Pressable>
      {abierto ? <View style={styles.acordeonCuerpo}>{children}</View> : null}
    </View>
  );
}
