import { soloHuespedes } from "./accesoHuespedes";
import { authMock } from "./authMock";
import type { ServicioAuth } from "./tiposAuth";

// Punto único para cambiar de proveedor (Firebase / API REST) sin tocar las pantallas.
export const servicioAuth: ServicioAuth = soloHuespedes(authMock);

export { ErrorAuth, MENSAJES_ERROR } from "./tiposAuth";
export type {
  Credenciales,
  DatosRegistro,
  Sesion,
  ServicioAuth,
  CodigoErrorAuth,
} from "./tiposAuth";
