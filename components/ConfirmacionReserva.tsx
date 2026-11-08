import { useState } from "react";
import { useRouter } from "expo-router";
import { Image, View } from "react-native";
import { COLORES } from "../constants/colors";
import { useAlerta } from "../contexto/AlertaContext";
import { useHabitaciones } from "../contexto/HabitacionesContext";
import { useReservas } from "../contexto/ReservasContext";
import { calcularNoches, calcularTotal, fechasPorDefecto, formatearPrecio } from "../datos/reserva";
import { useResponsive } from "../hooks/useResponsive";
import { elegirHabitacion } from "../servicios/habitaciones";
import type { Habitacion } from "../types/hotel";
import DatePicker from "./DatePicker";
import { EstadoError, EstadoVacio } from "./EstadoVista";
import GuestsPicker, { totalParaCapacidad, type Huespedes } from "./GuestsPicker";
import { PageLoader } from "./Loader";
import Boton from "./ui/Boton";
import EncabezadoSeccion from "./ui/EncabezadoSeccion";
import Icono from "./ui/Icono";
import Texto from "./ui/Texto";
import { pluralizar } from "../datos/texto";
import { estilosConfirmacionReserva as styles } from "../estilos/reservas";

type ConfirmacionReservaProps = {
  habitacionId?: string | null;
  checkInInicial?: string | null;
  checkOutInicial?: string | null;
};

export default function ConfirmacionReserva({
  habitacionId,
  checkInInicial,
  checkOutInicial,
}: ConfirmacionReservaProps) {
  const router = useRouter();
  const { obtenerHabitacion, cargando, error, reintentar } = useHabitaciones();
  const habitacion = obtenerHabitacion(habitacionId);

  if (cargando) return <PageLoader titulo="Cargando habitación…" />;
  if (error) return <EstadoError mensaje={error} onReintentar={reintentar} />;
  if (!habitacion) {
    return (
      <EstadoVacio
        icono="cama"
        titulo="Habitación no encontrada"
        descripcion="La habitación que elegiste ya no está disponible en el catálogo del hotel."
        accionTexto="Ver habitaciones"
        onAccion={() => router.replace("/(tabs)/habitaciones")}
      />
    );
  }

  return (
    <FormularioReserva
      habitacion={habitacion}
      checkInInicial={checkInInicial}
      checkOutInicial={checkOutInicial}
    />
  );
}

function FormularioReserva({
  habitacion,
  checkInInicial,
  checkOutInicial,
}: {
  habitacion: Habitacion;
  checkInInicial?: string | null;
  checkOutInicial?: string | null;
}) {
  const { esSm, esLg } = useResponsive();
  const { exito, error: alertaError } = useAlerta();
  const { busqueda } = useHabitaciones();
  const { crearReserva } = useReservas();
  const router = useRouter();
  const defaults = fechasPorDefecto();

  const [checkIn, setCheckIn] = useState(checkInInicial || defaults.checkIn);
  const [checkOut, setCheckOut] = useState(checkOutInicial || defaults.checkOut);
  const [huespedes, setHuespedes] = useState<Huespedes>(
    busqueda
      ? { adultos: busqueda.adultos, ninos: busqueda.ninos, bebes: busqueda.bebes }
      : { adultos: Math.min(2, habitacion.capacity), ninos: 0, bebes: 0 },
  );
  const [enviando, setEnviando] = useState(false);

  const personas = totalParaCapacidad(huespedes);
  const asignada = elegirHabitacion(habitacion, personas);
  const precioNoche = asignada?.precioNoche ?? habitacion.pricePerNight;
  const fechasValidas = !!checkIn && !!checkOut && checkOut > checkIn;
  const noches = calcularNoches(checkIn, checkOut);
  const total = calcularTotal(precioNoche, noches);

  const aviso = !fechasValidas
    ? "Selecciona la fecha de salida."
    : !asignada
      ? `No hay habitaciones ${habitacion.name} disponibles para ${pluralizar(personas, "persona")}.`
      : null;

  function actualizarFechas(campo: "in" | "out", value: string) {
    if (campo === "in") {
      setCheckIn(value);
      if (checkOut && value && checkOut <= value) setCheckOut("");
    } else {
      setCheckOut(value);
    }
  }

  async function handleSubmit() {
    if (enviando || aviso) return;
    setEnviando(true);
    try {
      await crearReserva({ habitacion, checkIn, checkOut, ...huespedes });
      exito("Reserva registrada. Recepción la revisará y te confirmará.");
      router.replace("/(tabs)/reservas");
    } catch (e) {
      const code = (e as { code?: string })?.code ?? "";
      alertaError(
        code.includes("permission-denied")
          ? "No se pudo registrar la reserva: tu cuenta no tiene permiso. Contacta al hotel."
          : e instanceof Error && !code
            ? e.message
            : "No se pudo registrar la reserva. Inténtalo de nuevo.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={[styles.seccion, { paddingVertical: esSm ? 56 : 40 }]}>
      <EncabezadoSeccion
        script="Casi listo"
        titulo="Confirmación de reserva"
        tamanoTitulo={esSm ? 44 : 34}
        descripcion="Revisa el resumen de tu estancia y confirma. Tu reserva quedará pendiente hasta que recepción la valide."
        style={styles.encabezado}
      />

      <View style={[{ gap: 32 }, esLg && { flexDirection: "row", alignItems: "stretch" }]}>
        <View style={[styles.tarjeta, esLg && { flex: 3 }]}>
          <Image
            source={habitacion.imagen}
            resizeMode="cover"
            accessibilityLabel={habitacion.name}
            style={[styles.foto, esSm ? styles.fotoAmplia : styles.fotoMovil]}
          />
          <View style={[styles.cuerpo, esSm ? styles.cuerpoAmplio : styles.cuerpoMovil]}>
            <View style={styles.filaTitulo}>
              <Icono nombre="cama" tamano={24} color={COLORES.coral} style={styles.iconoTitulo} />
              <View style={styles.expandir}>
                <Texto peso="display" color={COLORES.sea} tamano={24}>
                  Habitación {habitacion.name}
                </Texto>
                {habitacion.description ? (
                  <Texto color={COLORES.mist} tamano={14} style={styles.descripcionHabitacion}>
                    {habitacion.description}
                  </Texto>
                ) : null}
              </View>
            </View>

            <View style={[{ gap: 16 }, esSm && { flexDirection: "row" }]}>
              <View style={esSm ? styles.flex : undefined}>
                <DatePicker
                  label="Check-in"
                  value={checkIn}
                  onChange={(v) => actualizarFechas("in", v)}
                  icon={<Icono nombre="calendarioCheck" tamano={14} color={COLORES.mist} />}
                  placeholder="Fecha de llegada"
                />
              </View>
              <View style={esSm ? styles.flex : undefined}>
                <DatePicker
                  label="Check-out"
                  value={checkOut}
                  onChange={(v) => actualizarFechas("out", v)}
                  min={checkIn || undefined}
                  icon={<Icono nombre="calendarioX" tamano={14} color={COLORES.mist} />}
                  placeholder="Fecha de salida"
                />
              </View>
            </View>

            <GuestsPicker value={huespedes} onChange={setHuespedes} />

            <View style={[{ gap: 12 }, esSm && { flexDirection: "row" }]}>
              <View style={[styles.dato, esSm && styles.flex]}>
                <Icono nombre="luna" tamano={16} color={COLORES.coral} />
                <Texto color={COLORES.sea} tamano={14}>
                  {pluralizar(noches, "noche")}
                </Texto>
              </View>
              <View style={[styles.dato, esSm && styles.flex]}>
                <Icono nombre="personas" tamano={16} color={COLORES.coral} />
                <Texto color={COLORES.sea} tamano={14}>
                  Hasta {pluralizar(habitacion.capacity, "persona")}
                </Texto>
              </View>
            </View>

            <View style={styles.desglose}>
              <View style={styles.filaTituloDesglose}>
                <Icono nombre="recibo" tamano={20} color={COLORES.coral} />
                <Texto peso="semi" color={COLORES.sea} tamano={16} style={styles.tituloDesglose}>
                  Desglose de precio
                </Texto>
              </View>
              <View style={styles.filaPrecio}>
                <Texto color={COLORES.mist} tamano={14}>
                  {formatearPrecio(precioNoche)} × {pluralizar(noches, "noche")}
                </Texto>
                <Texto color={COLORES.mist} tamano={14}>
                  {formatearPrecio(total)}
                </Texto>
              </View>
              <View style={styles.filaTotal}>
                <Texto peso="semi" color={COLORES.sea} tamano={16}>
                  Total
                </Texto>
                <Texto peso="display" color={COLORES.sea} tamano={30}>
                  {formatearPrecio(total)}
                </Texto>
              </View>
              <Texto color={COLORES.mist} tamano={12}>
                El total se recalcula automáticamente al cambiar las fechas.
              </Texto>
            </View>
          </View>
        </View>

        <View style={[styles.tarjeta, { gap: 20, padding: esSm ? 28 : 20 }, esLg && { flex: 2 }]}>
          <View>
            <Texto peso="display" color={COLORES.sea} tamano={24} style={styles.tituloPago}>
              Pago
            </Texto>
            <Texto color={COLORES.mist} tamano={14} style={styles.textoPago}>
              Al confirmar, la reserva queda registrada como pendiente. Recepción
              validará la disponibilidad y te indicará cómo realizar el pago.
            </Texto>
          </View>

          {aviso ? (
            <Texto color={COLORES.coral} tamano={14}>
              {aviso}
            </Texto>
          ) : null}

          <Boton
            texto="Confirmar reserva"
            cargando={enviando}
            textoCargando="Registrando reserva…"
            deshabilitado={!!aviso || enviando}
            onPress={() => void handleSubmit()}
            style={styles.botonConfirmar}
          />
        </View>
      </View>
    </View>
  );
}
