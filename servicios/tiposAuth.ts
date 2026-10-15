import type { Usuario } from "../datos/usuarios";

export type Credenciales = {
  email: string;
  password: string;
};

export type DatosRegistro = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
};

export type Sesion = {
  usuario: Usuario;
  token: string;
  /** Fecha ISO de expiración. */
  expiraEn: string;
};

/** Códigos independientes del proveedor de autenticación. */
export type CodigoErrorAuth =
  | "credenciales_invalidas"
  | "email_ya_registrado"
  | "usuario_inactivo"
  | "acceso_solo_huespedes"
  | "usuario_no_encontrado"
  | "password_debil"
  | "sesion_expirada"
  | "error_red"
  | "error_desconocido";

export class ErrorAuth extends Error {
  readonly codigo: CodigoErrorAuth;

  constructor(codigo: CodigoErrorAuth, mensaje: string) {
    super(mensaje);
    this.name = "ErrorAuth";
    this.codigo = codigo;
  }
}

export const MENSAJES_ERROR: Record<CodigoErrorAuth, string> = {
  credenciales_invalidas: "El correo o la contraseña son incorrectos.",
  email_ya_registrado: "Ya existe una cuenta con este correo electrónico.",
  usuario_inactivo: "Esta cuenta está desactivada. Contacta al hotel.",
  acceso_solo_huespedes: "Esta app es solo para huéspedes. El personal del hotel ingresa desde el panel web.",
  usuario_no_encontrado: "No encontramos una cuenta con ese correo.",
  password_debil: "La contraseña no cumple con los requisitos mínimos.",
  sesion_expirada: "Tu sesión expiró. Vuelve a iniciar sesión.",
  error_red: "No pudimos conectar con el servidor. Revisa tu conexión.",
  error_desconocido: "Ocurrió un error inesperado. Intenta de nuevo.",
};

/** Contrato común para cualquier proveedor de autenticación (mock, Firebase, API). */
export type ServicioAuth = {
  /** Firebase token/session changes. Mock providers may omit this hook. */
  observarCambiosSesion?: (listener: () => void) => () => void;
  /** Lanza `ErrorAuth` si las credenciales no son válidas. */
  login(credenciales: Credenciales): Promise<Sesion>;

  registrar(datos: DatosRegistro): Promise<Sesion>;

  logout(): Promise<void>;

  /** `null` si no hay sesión guardada o ya expiró. */
  restaurarSesion(): Promise<Sesion | null>;

  actualizarPerfil(
    usuarioId: string,
    cambios: Partial<Usuario>,
  ): Promise<Usuario>;
};
