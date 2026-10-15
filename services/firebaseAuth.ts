import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export function initializeAppAuth(app: FirebaseApp) {
  return getAuth(app);
}
