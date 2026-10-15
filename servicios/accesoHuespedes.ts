import { ErrorAuth, MENSAJES_ERROR, type ServicioAuth, type Sesion } from "./tiposAuth";

const esHuesped = (sesion: Sesion) => sesion.usuario.rol === "huesped";

/**
 * La app es solo para huéspedes: el personal del hotel usa el panel web.
 * Envuelve cualquier proveedor (mock, Firebase, API) para que la regla no dependa de él.
 */
export function soloHuespedes(servicio: ServicioAuth): ServicioAuth {
  return {
    ...servicio,

    async login(credenciales) {
      const sesion = await servicio.login(credenciales);
      if (esHuesped(sesion)) return sesion;

      await servicio.logout();
      throw new ErrorAuth("acceso_solo_huespedes", MENSAJES_ERROR.acceso_solo_huespedes);
    },

    async restaurarSesion() {
      const sesion = await servicio.restaurarSesion();
      if (!sesion || esHuesped(sesion)) return sesion;

      await servicio.logout();
      return null;
    },
  };
}
