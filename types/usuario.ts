export type Rol = "huesped" | "recepcionista" | "admin";

/** Perfil del usuario autenticado (colección `users`). Nunca incluye la contraseña. */
export type Usuario = {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  rol: Rol;
  activo: boolean;
  /** Fecha ISO 8601. */
  creadoEn: string;
};
