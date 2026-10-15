import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, updateProfile, type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirebase } from './firebase';
import { type AuthValues, normalizeName, validateAuth } from '../utils/authValidation';

// Only a single document is addressed by the authenticated UID. No user lookup
// by email, dynamic query text, password storage, or client-selected admin role.
async function ensureProfile(user: User, name: string, surname: string) {
  const { db } = getFirebase();
  const ref = doc(db, 'users', user.uid);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    if (snapshot.data().activo !== true) throw new Error('app/account-inactive');
  } else {
    await setDoc(ref, {
      uid: user.uid,
      nombre: name,
      apellido: surname,
      email: user.email?.toLowerCase(),
      rol: 'huesped',
      activo: true,
      createdAt: serverTimestamp(),
    });
  }
}

export async function authenticate(values: AuthValues, register: boolean) {
  if (Object.keys(validateAuth(values, register)).length) throw new Error('app/invalid-input');
  const { auth } = getFirebase();
  const email = values.email.trim().toLowerCase();
  let created = false;
  try {
    const credential = register
      ? await createUserWithEmailAndPassword(auth, email, values.password)
      : await signInWithEmailAndPassword(auth, email, values.password);
    created = register;
    const name = register ? normalizeName(values.name) : (credential.user.displayName || 'Huésped');
    const surname = register ? normalizeName(values.surname) : '';
    if (register) await updateProfile(credential.user, { displayName: `${name} ${surname}` });
    // A login also repairs a missing profile after a previous partial failure.
    await ensureProfile(credential.user, name, surname);
    return credential.user;
  } catch (error) {
    if (auth.currentUser) await signOut(auth);
    if (created) throw new Error('app/profile-incomplete', { cause: error });
    throw error;
  }
}

// Restored sessions must also respect the web's logical account deactivation.
export async function restoreSession(user: User) {
  try {
    await ensureProfile(user, user.displayName || 'Huésped', '');
    return user;
  } catch (error) {
    await signOut(getFirebase().auth);
    throw error;
  }
}

export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string; message?: string })?.code
    || (error as { message?: string })?.message;
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/user-disabled':
    case 'app/account-inactive':
      return 'No pudimos iniciar sesión. Revisa tus credenciales e inténtalo de nuevo.';
    case 'auth/email-already-in-use':
      return 'No se pudo completar el registro con esos datos. Intenta iniciar sesión si ya tienes una cuenta.';
    case 'auth/too-many-requests':
    case 'auth/quota-exceeded':
      return 'Demasiados intentos. Espera unos minutos antes de volver a intentarlo.';
    case 'auth/network-request-failed':
      return 'No se pudo conectar. Revisa tu conexión a internet e inténtalo de nuevo.';
    case 'auth/weak-password':
    case 'auth/password-does-not-meet-requirements':
      return 'La contraseña no cumple la política de seguridad del servicio.';
    case 'app/profile-incomplete':
      return 'La cuenta se creó, pero no se pudo guardar el perfil. Intenta iniciar sesión para completar el proceso.';
    case 'permission-denied':
    case 'firestore/permission-denied':
      return 'No se pudo acceder a tu perfil. Contacta al administrador para revisar los permisos de la base de datos.';
    case 'auth/operation-not-allowed':
    case 'auth/invalid-api-key':
    case 'auth/app-not-authorized':
    case 'app/firebase-not-configured':
      return 'El servicio de acceso aún no está configurado. Contacta al administrador.';
    default:
      return 'No se pudo completar la operación. Inténtalo de nuevo más tarde.';
  }
}
