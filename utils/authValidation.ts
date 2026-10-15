export type AuthValues = {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmation: string;
};

export type AuthErrors = Partial<Record<keyof AuthValues, string>>;

export const AUTH_LIMITS = { name: 100, email: 254, password: 128 } as const;
export const normalizeName = (value: string) => value.normalize('NFC').trim().replace(/ +/g, ' ');
const controlCharacters = /[\u0000-\u001F\u007F]/;

export function validateAuth(values: AuthValues, register: boolean): AuthErrors {
  const errors: AuthErrors = {};
  const email = values.email.trim();
  if (!email) errors.email = 'Ingresa tu correo electrónico.';
  else if (email.length > AUTH_LIMITS.email || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(email))
    errors.email = 'Ingresa un correo válido, por ejemplo: huesped@correo.com.';

  if (!values.password.trim()) errors.password = 'Ingresa tu contraseña.';
  else if (values.password.length > AUTH_LIMITS.password || controlCharacters.test(values.password))
    errors.password = 'Usa como máximo 128 caracteres y evita caracteres de control.';

  if (register) {
    const name = normalizeName(values.name);
    if (!name) errors.name = 'Ingresa tu nombre completo.';
    else if (name.length < 3 || name.length > AUTH_LIMITS.name || !/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(name))
      errors.name = 'Escribe un nombre válido, usando letras y espacios.';
    const surname = normalizeName(values.surname);
    if (!surname) errors.surname = 'Ingresa tus apellidos.';
    else if (surname.length > AUTH_LIMITS.name || !/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(surname))
      errors.surname = 'Escribe apellidos válidos, usando letras y espacios.';
    if (!errors.password && (values.password.length < 12 || !/[a-z]/.test(values.password) || !/[A-Z]/.test(values.password) || !/[0-9]/.test(values.password)))
      errors.password = 'Usa de 12 a 128 caracteres, con mayúscula, minúscula y número.';
    if (!values.confirmation) errors.confirmation = 'Confirma tu contraseña.';
    else if (values.password !== values.confirmation)
      errors.confirmation = 'Las contraseñas no coinciden.';
  }
  return errors;
}
