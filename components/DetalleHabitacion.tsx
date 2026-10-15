import { useState } from "react";
import { Image, Linking, Pressable, ScrollView, Share, StyleSheet, View } from "react-native";
import { COLORES } from "../constants/colors";
import { CONTACTO } from "../datos/contenido";
import type { Habitacion } from "../datos/habitaciones";
import { formatearPrecio } from "../datos/reserva";
import { useResponsive } from "../hooks/useResponsive";
import { vibrarToque } from "../utilidades/hapticos";
import FotoLightbox from "./FotoLightbox";
import Boton from "./ui/Boton";
import Icono from "./ui/Icono";
import Texto from "./ui/Texto";
import { pluralizar } from "../datos/texto";
import { estilosDetalleHabitacion as styles } from "../estilos/habitaciones";

type DetalleHabitacionProps = {
  habitacion: Habitacion;
  onReservar: () => void;
  onClose?: () => void;
};

export function Chip({
  icono,
  texto,
  compacto = false,
}: {
  icono: Parameters<typeof Icono>[0]["nombre"];
  texto: string;
  compacto?: boolean;
}) {
  return (
    <View style={[styles.chip, compacto && styles.chipCompacto]}>
      <Icono nombre={icono} tamano={compacto ? 14 : 16} color={COLORES.coral} />
      <Texto color={COLORES.sea} tamano={compacto ? 12 : 14}>
        {texto}
      </Texto>
    </View>
  );
}

/** Contenido del detalle de habitación (usado en el modal y en la pantalla /habitaciones/[id]). */
export default function DetalleHabitacion({ habitacion, onReservar, onClose }: DetalleHabitacionProps) {
  const { esSm } = useResponsive();
  const [fotoAmpliada, setFotoAmpliada] = useState(false);
  const { name, description, pricePerNight, capacity, imagen, highlights } = habitacion;
  const movil = !esSm;

  async function compartir() {
    vibrarToque();
    const mensaje = `Mira la habitación ${name} del Hotel Terra Azul: ${formatearPrecio(pricePerNight)} por noche, hasta ${pluralizar(capacity, "persona")}. Reserva por WhatsApp: ${CONTACTO.whatsapp}`;
    try {
      await Share.share({ title: `Habitación ${name} · Hotel Terra Azul`, message: mensaje });
    } catch {
      await Linking.openURL(`https://wa.me/?text=${encodeURIComponent(mensaje)}`).catch(() => undefined);
    }
  }

  return (
    <>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={[styles.cabecera, { height: movil ? 190 : 256 }]}>
          <Pressable
            onPress={() => setFotoAmpliada(true)}
            accessibilityRole="button"
            accessibilityLabel={`Ampliar foto de ${name}`}
            style={StyleSheet.absoluteFill}
          >
            <Image source={imagen} resizeMode="cover" style={styles.foto} accessibilityLabel={name} />
            <View style={styles.ampliar}>
              <Icono nombre="zoom" tamano={13} color={COLORES.foam} />
              <Texto peso="medio" color={COLORES.foam} tamano={11}>
                Ampliar
              </Texto>
            </View>
          </Pressable>
          <View style={styles.accionesFoto}>
            <Pressable
              onPress={() => void compartir()}
              accessibilityRole="button"
              accessibilityLabel={`Compartir ${name}`}
              style={styles.botonFoto}
            >
              <Icono nombre="compartir" tamano={18} />
            </Pressable>
            {onClose ? (
              <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar" style={styles.botonFoto}>
                <Icono nombre="cerrar" tamano={18} />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={[styles.cuerpo, movil ? styles.cuerpoMovil : styles.cuerpoAmplio]}>
          <View style={styles.titulos}>
            {movil ? null : (
              <Texto peso="script" color={COLORES.mist} tamano={26}>
                Detalle de habitación
              </Texto>
            )}
            <Texto peso="display" color={COLORES.sea} tamano={movil ? 24 : 30}>
              {name}
            </Texto>
          </View>

          <View style={styles.chips}>
            <Chip compacto={movil} icono="personas" texto={`Hasta ${pluralizar(capacity, "persona")}`} />
            {movil ? null : <Chip icono="cama" texto={`${formatearPrecio(pricePerNight)} / noche`} />}
          </View>

          <Texto color={COLORES.mist} tamano={movil ? 14 : 15} style={movil ? styles.descripcionMovil : styles.descripcion}>
            {description}
          </Texto>

          {highlights.length > 0 ? (
            <View>
              <Texto peso="semi" color={COLORES.sea} tamano={movil ? 14 : 16} style={styles.tituloIncluye}>
                Incluye
              </Texto>
              <View style={styles.listaIncluye}>
                {highlights.map((item) => (
                  <View key={item} style={styles.highlight}>
                    <Icono nombre="check" tamano={14} color={COLORES.coral} />
                    <Texto color={COLORES.mist} tamano={movil ? 13 : 14} style={styles.textoIncluye}>
                      {item}
                    </Texto>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {movil ? (
        <View style={styles.barraReserva}>
          <View>
            <Texto peso="bold" color={COLORES.sea} tamano={18}>
              {formatearPrecio(pricePerNight)}
            </Texto>
            <Texto color={COLORES.mist} tamano={12}>
              por noche
            </Texto>
          </View>
          <Boton texto="Reservar" tamano="sm" onPress={onReservar} style={styles.botonReservar} />
        </View>
      ) : (
        <View style={[styles.acciones, { flexDirection: "row" }]}>
          {onClose ? <Boton texto="Cerrar" variante="borde" onPress={onClose} style={styles.flex} /> : null}
          <Boton texto="Reservar" onPress={onReservar} style={styles.flex} />
        </View>
      )}

      <FotoLightbox
        visible={fotoAmpliada}
        src={imagen}
        alt={`${name} — vista ampliada`}
        onClose={() => setFotoAmpliada(false)}
      />
    </>
  );
}
