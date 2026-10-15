import type { Credenciales, DatosRegistro } from "../servicios/tiposAuth";
import { AUTH_LIMITS, validateAuth, validPhone } from '../utils/authValidation';

/** Objeto vacío = formulario válido. */
export type ErroresCampo<T> = Partial<Record<keyof T, string>>;

export const REGLAS_PASSWORD = {
  longitudMinima: 12,
  requiereMayuscula: true,
  requiereMinuscula: true,
  requiereNumero: true,
} as const;

/** Devuelve la lista de requisitos que la contraseña NO cumple. */
export function requisitosFaltantes(password: string): string[] {
  const faltantes: string[] = [];

  if (password.length < REGLAS_PASSWORD.longitudMinima) {
    faltantes.push(`al menos ${REGLAS_PASSWORD.longitudMinima} caracteres`);
  }
  if (password.length > AUTH_LIMITS.password || /[\u0000-\u001F\u007F]/.test(password)) faltantes.push('máximo 128 caracteres sin controles');
  if (REGLAS_PASSWORD.requiereMayuscula && !/[A-Z]/.test(password)) {
    faltantes.push("una letra mayúscula");
  }
  if (REGLAS_PASSWORD.requiereMinuscula && !/[a-z]/.test(password)) {
    faltantes.push("una letra minúscula");
  }
  if (REGLAS_PASSWORD.requiereNumero && !/\d/.test(password)) {
    faltantes.push("un número");
  }

  return faltantes;
}

/** 0 = vacía, 1 = débil, 2 = media, 3 = fuerte. */
export function fuerzaPassword(password: string): 0 | 1 | 2 | 3 {
  if (password.length === 0) return 0;

  const faltantes = requisitosFaltantes(password).length;
  if (faltantes > 1) return 1;
  if (faltantes === 1) return 2;

  return password.length >= 12 ? 3 : 2;
}

export function validarLogin(datos: Credenciales): ErroresCampo<Credenciales> {
  const base = validateAuth({ name: '', surname: '', email: datos.email, password: datos.password, confirmation: '' }, false);
  const errores: ErroresCampo<Credenciales> = {};
  if (base.email) errores.email = base.email;
  if (base.password) errores.password = base.password;
  return errores;
}

export function validarRegistro(
  datos: DatosRegistro,
): ErroresCampo<DatosRegistro> {
  const base = validateAuth({ name: datos.nombre, surname: datos.apellido,
    email: datos.email, password: datos.password, confirmation: datos.confirmPassword }, true);
  const errores: ErroresCampo<DatosRegistro> = {};
  if (base.name) errores.nombre = base.name;
  if (base.surname) errores.apellido = base.surname;
  if (base.email) errores.email = base.email;
  if (base.password) errores.password = base.password;
  if (base.confirmation) errores.confirmPassword = base.confirmation;
  if (!validPhone(datos.telefono.trim())) errores.telefono = 'Ingresa un teléfono válido (ej. 7123 4567).';
  return errores;
}

export function sinErrores<T>(errores: ErroresCampo<T>): boolean {
  return Object.keys(errores).length === 0;
}
