import { onIdTokenChanged, signOut, updateProfile, type User } from 'firebase/auth';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { authenticate, authErrorMessage, restoreSession } from '../services/auth';
import { getFirebase } from '../services/firebase';
import { normalizeName, validPhone } from '../utils/authValidation';
import { validarRegistro, sinErrores } from '../validacion/auth';
import { ErrorAuth, MENSAJES_ERROR, type ServicioAuth, type Sesion } from './tiposAuth';

async function crearSesion(user: User): Promise<Sesion> {
  const snapshot = await getDoc(doc(getFirebase().db, 'users', user.uid));
  const profile = snapshot.data();
  if (!profile || profile.activo !== true) throw new Error('app/account-inactive');
  if (profile.rol !== 'huesped')
    throw new ErrorAuth('acceso_solo_huespedes', MENSAJES_ERROR.acceso_solo_huespedes);
  const token = await user.getIdTokenResult();
  return {
    usuario: {
      id: user.uid,
      nombre: typeof profile.nombre === 'string' ? profile.nombre : 'Huésped',
      apellido: typeof profile.apellido === 'string' ? profile.apellido : '',
      email: user.email || '',
      telefono: typeof profile.telefono === 'string' ? profile.telefono : null,
      rol: 'huesped',
      activo: true,
      creadoEn: profile.createdAt instanceof Timestamp ? profile.createdAt.toDate().toISOString()
        : user.metadata.creationTime ? new Date(user.metadata.creationTime).toISOString() : new Date().toISOString(),
    },
    token: token.token,
    expiraEn: token.expirationTime,
  };
}

function errorVisible(error: unknown): ErrorAuth {
  if (error instanceof ErrorAuth) return error;
  return new ErrorAuth('error_desconocido', authErrorMessage(error));
}

async function accesoSeguro<T>(action: () => Promise<T>): Promise<T> {
  try { return await action(); }
  catch (error) {
    try { if (getFirebase().auth.currentUser) await signOut(getFirebase().auth); } catch { /* Keep the original controlled error. */ }
    throw errorVisible(error);
  }
}

export const authFirebase: ServicioAuth = {
  login: ({ email, password }) => accesoSeguro(async () => {
    const user = await authenticate({ name: '', surname: '', email, password, confirmation: '' }, false);
    return crearSesion(user);
  }),

  registrar: (datos) => accesoSeguro(async () => {
    // The service repeats UI validation; it never trusts form-only checks.
    if (!sinErrores(validarRegistro(datos))) throw new ErrorAuth('error_desconocido', 'Revisa los datos del formulario.');
    const user = await authenticate({ name: datos.nombre, surname: datos.apellido,
      email: datos.email, phone: datos.telefono, password: datos.password, confirmation: datos.confirmPassword }, true);
    return crearSesion(user);
  }),

  async restaurarSesion() {
    return accesoSeguro(async () => {
      const { auth } = getFirebase();
      await auth.authStateReady();
      if (!auth.currentUser) return null;
      return crearSesion(await restoreSession(auth.currentUser));
    });
  },

  async logout() {
    try { await signOut(getFirebase().auth); }
    catch (error) { throw errorVisible(error); }
  },

  observarCambiosSesion(listener) {
    try { return onIdTokenChanged(getFirebase().auth, () => listener()); }
    catch (error) { throw errorVisible(error); }
  },

  async actualizarPerfil(usuarioId, cambios) {
    try {
      const { auth, db } = getFirebase();
      const user = auth.currentUser;
      if (!user || user.uid !== usuarioId) throw new Error('app/invalid-input');
      await crearSesion(await restoreSession(user));
      const allowed = ['nombre', 'apellido', 'telefono'];
      if (Object.keys(cambios).some((key) => !allowed.includes(key))) throw new Error('app/invalid-input');
      const updates: Record<string, string | null> = {};
      for (const key of ['nombre', 'apellido'] as const) {
        if (cambios[key] === undefined) continue;
        const value = normalizeName(cambios[key]);
        if (value.length > 100 || (key === 'nombre' && value.length < 3)
          || (value !== '' && !/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(value))) throw new Error('app/invalid-input');
        updates[key] = value;
      }
      if (cambios.telefono !== undefined) {
        if (cambios.telefono !== null && !validPhone(cambios.telefono.trim())) throw new Error('app/invalid-input');
        updates.telefono = cambios.telefono?.trim() || null;
      }
      if (Object.keys(updates).length) await updateDoc(doc(db, 'users', user.uid), updates);
      const sesion = await crearSesion(user);
      // Firestore is the profile source of truth; displayName is a convenience.
      try { await updateProfile(user, { displayName: `${sesion.usuario.nombre} ${sesion.usuario.apellido}`.trim() }); } catch { /* Profile was saved successfully. */ }
      return sesion.usuario;
    } catch (error) {
      if (!getFirebase().auth.currentUser) throw new ErrorAuth('sesion_expirada', authErrorMessage(error));
      throw errorVisible(error);
    }
  },
};
