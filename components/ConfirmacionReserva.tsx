import { useState } from "react";
import { ActivityIndicator, Image, Pressable, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { COLORES, conAlfa } from "../constants/colors";
import { DELAYS } from "../datos/carga";
import {
  armarResumen,
  calcularNoches,
  calcularTotal,
  formatearPrecio,
  obtenerHabitacionPorId,
} from "../datos/reserva";
import { useDelayedAction } from "../hooks/useDelayedAction";
import { useResponsive } from "../hooks/useResponsive";
import DatePicker from "./DatePicker";
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

type Comprobante = { nombre: string; uri: string };

export default function ConfirmacionReserva({
  habitacionId,
  checkInInicial,
  checkOutInicial,
}: ConfirmacionReservaProps) {
  const { esSm, esLg } = useResponsive();
  const habitacion = obtenerHabitacionPorId(habitacionId);
  const inicial = armarResumen(habitacionId, checkInInicial, checkOutInicial);
  const { runAfter } = useDelayedAction();

  const [checkIn, setCheckIn] = useState(inicial.checkIn);
  const [checkOut, setCheckOut] = useState(inicial.checkOut);
  const [archivo, setArchivo] = useState<Comprobante | null>(null);
  const [confirmado, setConfirmado] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const noches = calcularNoches(checkIn, checkOut);
  const total = calcularTotal(habitacion.pricePerNight, noches);
  const ocupado = subiendo || enviando;

  function actualizarFechas(campo: "in" | "out", value: string) {
    if (campo === "in") {
      setCheckIn(value);
      if (checkOut && value && checkOut <= value) setCheckOut("");
    } else {
      setCheckOut(value);
    }
    setConfirmado(false);
  }

  async function seleccionarArchivo() {
    if (ocupado) return;
    const resultado = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
    });
    if (resultado.canceled || !resultado.assets[0]) return;

    const asset = resultado.assets[0];
    setSubiendo(true);
    setConfirmado(false);
    setArchivo(null);

    runAfter(DELAYS.subida, () => {
      setArchivo({ nombre: asset.name, uri: asset.uri });
      setSubiendo(false);
    });
  }

  function handleSubmit() {
    if (!archivo || ocupado) return;

    setEnviando(true);
    setConfirmado(false);

    runAfter(DELAYS.confirmar, () => {
      setEnviando(false);
      setConfirmado(true);
    });
  }

  return (
    <View style={[styles.seccion, { paddingVertical: esSm ? 56 : 40 }]}>
      <EncabezadoSeccion
        script="Casi listo"
        titulo="Confirmación de reserva"
        tamanoTitulo={esSm ? 44 : 34}
        descripcion="Revisa el resumen de tu estancia, verifica el total y sube tu comprobante de pago para confirmar."
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
                <Texto color={COLORES.mist} tamano={14} style={styles.descripcionHabitacion}>
                  {habitacion.description}
                </Texto>
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
                  {formatearPrecio(habitacion.pricePerNight)} × {pluralizar(noches, "noche")}
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
              Comprobante de pago
            </Texto>
            <Texto color={COLORES.mist} tamano={14} style={styles.textoPago}>
              Sube una captura o PDF de tu transferencia. Luego
              confirma la reserva.
            </Texto>
          </View>

          <Pressable
            onPress={() => void seleccionarArchivo()}
            disabled={ocupado}
            accessibilityRole="button"
            accessibilityLabel="Seleccionar comprobante"
            style={({ pressed }) => [
              styles.zonaArchivo,
              archivo && { borderColor: conAlfa(COLORES.sea, 0.3), backgroundColor: COLORES.background },
              pressed && { borderColor: conAlfa(COLORES.coral, 0.5), backgroundColor: COLORES.background },
              ocupado && { opacity: 0.7 },
            ]}
          >
            {subiendo ? (
              <>
                <ActivityIndicator size="large" color={COLORES.coral} />
                <Texto peso="medio" color={COLORES.sea} tamano={14}>
                  Procesando comprobante…
                </Texto>
                <Texto color={COLORES.mist} tamano={12}>
                  Validando archivo, un momento
                </Texto>
              </>
            ) : archivo ? (
              <>
                <Icono nombre="archivoImagen" tamano={40} color={COLORES.sea} />
                <Texto peso="medio" color={COLORES.sea} tamano={14} style={styles.textoCentrado}>
                  {archivo.nombre}
                </Texto>
                <Texto color={COLORES.mist} tamano={12}>
                  Toca para cambiar el archivo
                </Texto>
              </>
            ) : (
              <>
                <Icono nombre="subir" tamano={40} color={COLORES.mist} />
                <Texto peso="medio" color={COLORES.sea} tamano={14}>
                  Sube tu comprobante aquí
                </Texto>
                <Texto color={COLORES.mist} tamano={12} style={styles.textoCentrado}>
                  Toca para seleccionar (JPG, PNG o PDF)
                </Texto>
              </>
            )}
          </Pressable>

          <Boton
            texto="Confirmar reserva"
            cargando={enviando}
            textoCargando="Confirmando reserva…"
            deshabilitado={!archivo || ocupado}
            onPress={handleSubmit}
            style={styles.botonConfirmar}
          />

          {confirmado ? (
            <View style={styles.exito}>
              <Icono nombre="checkCirculo" tamano={20} color={COLORES.coral} />
              <Texto color={COLORES.sea} tamano={14} style={styles.expandir}>
                ¡Reserva realizada con éxito! Tu comprobante{" "}
                <Texto peso="bold" color={COLORES.sea} tamano={14}>
                  {archivo?.nombre}
                </Texto>{" "}
                fue recibido correctamente.
              </Texto>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
