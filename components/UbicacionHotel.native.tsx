import { Platform, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useScrollLock } from "../contexto/ScrollLockContext";
import { UBICACION } from "../datos/ubicacion";
import { REGION_HOTEL } from "../utilidades/navegacionMapas";
import UbicacionShell from "./ubicacion/UbicacionShell";

/** Nativo: MapView interactivo con zoom/pan. */
export default function UbicacionHotel() {
  const { bloquearScroll, liberarScroll } = useScrollLock();

  return (
    <UbicacionShell
      mapa={
        <MapView
          style={StyleSheet.absoluteFill}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          initialRegion={REGION_HOTEL}
          scrollEnabled
          zoomEnabled
          pitchEnabled={false}
          rotateEnabled={false}
          toolbarEnabled={false}
          showsCompass
          onTouchStart={bloquearScroll}
          onTouchEnd={liberarScroll}
          onTouchCancel={liberarScroll}
        >
          <Marker
            coordinate={{ latitude: UBICACION.lat, longitude: UBICACION.lng }}
            title={UBICACION.nombre}
            description="Playa Costa Azul, Sonsonate"
          />
        </MapView>
      }
    />
  );
}