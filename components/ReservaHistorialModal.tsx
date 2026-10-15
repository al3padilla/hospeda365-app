import { Image, Pressable, ScrollView, View } from "react-native";
import { COLORES } from "../constants/colors";
import { calcularNoches, formatearFecha } from "../datos/fechas";
import type { ReservaHistorial } from "../datos/historialReservas";
import { formatearPrecio } from "../datos/reserva";
import { useResponsive } from "../hooks/useResponsive";
import BadgeEstado from "./BadgeEstado";
import { Chip } from "./DetalleHabitacion";
import HojaModal from "./HojaModal";
import Boton from "./ui/Boton";
import Icono, { type NombreIcono } from "./ui/Icono";
import Texto from "./ui/Texto";
import { pluralizar } from "../datos/texto";
import { estilosReservaHistorialModal as styles } from "../estilos/reservas";

type ReservaHistorialModalProps = {
  reserva: ReservaHistorial | null;
  onClose: () => void;
};

function textoHuespedes(reserva: ReservaHistorial): string {
  const partes = [pluralizar(reserva.adultos, "adulto")];
  if (reserva.ninos > 0) partes.push(pluralizar(reserva.ninos, "niño"));
  if (reserva.bebes > 0) partes.push(pluralizar(reserva.bebes, "bebé"));
  return partes.join(", ");
}

function CajaFecha({
  icono,
  etiqueta,
  fecha,
  compacta,
}: {
  icono: NombreIcono;
  etiqueta: string;
  fecha: string;
  compacta: boolean;
}) {
  return (
    <View style={[styles.cajaFecha, compacta && styles.cajaFechaCompacta]}>
      <View style={styles.filaEtiquetaFecha}>
        <Icono nombre={icono} tamano={compacta ? 12 : 14} color={COLORES.coral} />
        <Texto color={COLORES.mist} tamano={compacta ? 10 : 12} style={styles.etiquetaMayusculas}>
          {etiqueta}
        </Texto>
      </View>
      <Texto peso="medio" color={COLORES.sea} tamano={compacta ? 13 : 15}>
        {formatearFecha(fecha)}
      </Texto>
    </View>
  );
}

export default function ReservaHistorialModal({ reserva, onClose }: ReservaHistorialModalProps) {
  const { esSm } = useResponsive();
  const movil = !esSm;
  const noches = reserva ? calcularNoches(reserva.checkIn, reserva.checkOut) : 0;

  return (
    <HojaModal visible={reserva !== null} onClose={onClose} anchoMaximo={512} etiqueta="Detalle de reserva">
      {reserva ? (
        <>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <View style={[styles.cabecera, { height: movil ? 150 : 224 }]}>
              <Image source={reserva.imagen} resizeMode="cover" style={styles.foto} />
              <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar" style={styles.cerrar}>
                <Icono nombre="cerrar" tamano={18} />
              </Pressable>
            </View>

            <View style={[styles.cuerpo, movil ? styles.cuerpoMovil : styles.cuerpoAmplio]}>
              <View style={styles.titulo}>
                <View style={styles.titulos}>
                  {movil ? null : (
                    <Texto peso="script" color={COLORES.mist} tamano={26}>
                      Detalle de reserva
                    </Texto>
                  )}
                  <Texto peso="display" color={COLORES.sea} tamano={movil ? 22 : 28}>
                    Habitación {reserva.habitacionNombre}
                  </Texto>
                  <Texto color={COLORES.mist} tamano={13} style={styles.codigo}>
                    Código{" "}
                    <Texto peso="semi" color={COLORES.sea} tamano={13} style={styles.codigoValor}>
                      {reserva.id}
                    </Texto>
                  </Texto>
                </View>
                <BadgeEstado estado={reserva.estado} />
              </View>

              <View style={movil ? styles.filaFechasMovil : styles.filaFechas}>
                <CajaFecha compacta={movil} icono="calendarioCheck" etiqueta="Check-in" fecha={reserva.checkIn} />
                <CajaFecha compacta={movil} icono="calendarioX" etiqueta="Check-out" fecha={reserva.checkOut} />
              </View>

              <View style={styles.chips}>
                <Chip compacto={movil} icono="luna" texto={pluralizar(noches, "noche")} />
                <Chip compacto={movil} icono="personas" texto={textoHuespedes(reserva)} />
                <Chip compacto={movil} icono="cama" texto={`${formatearPrecio(reserva.precioPorNoche)} / noche`} />
              </View>

              {movil ? null : (
                <>
                  <View style={styles.total}>
                    <Texto color={COLORES.mist} tamano={12} style={styles.etiquetaMayusculas}>
                      Total
                    </Texto>
                    <Texto peso="semi" color={COLORES.sea} tamano={24}>
                      {formatearPrecio(reserva.total)}
                    </Texto>
                  </View>
                  <Boton texto="Cerrar" variante="borde" onPress={onClose} />
                </>
              )}
            </View>
          </ScrollView>

          {movil ? (
            <View style={styles.barraTotal}>
              <View>
                <Texto color={COLORES.mist} tamano={11} style={styles.etiquetaMayusculas}>
                  Total
                </Texto>
                <Texto peso="bold" color={COLORES.sea} tamano={18}>
                  {formatearPrecio(reserva.total)}
                </Texto>
              </View>
              <Boton texto="Cerrar" variante="borde" tamano="sm" onPress={onClose} style={styles.botonCerrar} />
            </View>
          ) : null}
        </>
      ) : null}
    </HojaModal>
  );
}
