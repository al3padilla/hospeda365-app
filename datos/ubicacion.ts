/** Ubicación real (Villa Altia / Playa Costa Azul) como Hotel Terra Azul. */
export const UBICACION = {
  nombre: "Hotel Terra Azul",
  direccion:
    "Primera fila frente al mar, Playa Costa Azul, Departamento de Sonsonate, El Salvador",
  lat: 13.6456463,
  lng: -89.9147224,
  mapsPlaceUrl: "https://maps.app.goo.gl/JXQvt7LYvonGYVQN8",
} as const;

export type UbicacionHotel = typeof UBICACION;