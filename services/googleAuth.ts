import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirebase } from './firebase';
import { restoreSession } from './auth';

// Firebase owns the web callback: https://<authDomain>/__/auth/handler.
// Call directly from the click handler so the browser allows the popup.
export async function loginGoogle() {
  const { auth } = getFirebase();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await signInWithPopup(auth, provider);
    return await restoreSession(result.user);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
    throw error;
  }
}
