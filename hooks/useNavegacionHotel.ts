import { useCallback } from "react";
import { useRouter } from "expo-router";

/** Secciones del inicio, equivalentes a los anclas `/#...` de la web. */
export type SeccionInicio =
  | "inicio"
  | "buscar"
  | "sobre"
  | "amenidades"
  | "daypass"
  | "ubicacion"
  | "habitaciones";

export function useNavegacionHotel() {
  const router = useRouter();

  const irASeccion = useCallback(
    (seccion: SeccionInicio) => {
      // Habitaciones / reservar → tab Habitaciones.
      if (seccion === "habitaciones" || seccion === "buscar") {
        router.navigate("/(tabs)/habitaciones");
        return;
      }
      // `t` fuerza el scroll aunque se pida la misma sección dos veces.
      router.navigate({ pathname: "/", params: { seccion, t: String(Date.now()) } });
    },
    [router],
  );

  return { router, irASeccion };
}
