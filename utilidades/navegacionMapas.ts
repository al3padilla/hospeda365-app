import { UBICACION } from "../datos/ubicacion";

/** Región inicial del MapView nativo. */
export const REGION_HOTEL = {
  latitude: UBICACION.lat,
  longitude: UBICACION.lng,
  latitudeDelta: 0.014,
  longitudeDelta: 0.014,
};

/** Ruta en Google Maps desde la ubicación actual del dispositivo. */
export function urlGoogleMapsDesdeMiUbicacion() {
  const { lat, lng } = UBICACION;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

/** Navegación Waze hasta las coordenadas del hotel. */
export function urlWazeDesdeMiUbicacion() {
  const { lat, lng } = UBICACION;
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

/** Embed OpenStreetMap (web) centrado en el hotel. */
export function urlMapaEmbedOsm(delta = 0.02) {
  const { lat, lng } = UBICACION;
  const left = lng - delta;
  const right = lng + delta;
  const top = lat + delta;
  const bottom = lat - delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}