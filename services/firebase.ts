import { getApp, getApps, initializeApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { initializeAppAuth } from './firebaseAuth';

// Expo replaces explicit EXPO_PUBLIC accesses when bundling. These are public
// app identifiers, never Admin SDK credentials or service-account secrets.
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

export const firebaseConfigured = [config.apiKey, config.authDomain, config.projectId, config.appId].every((value) => !!value?.trim());
let client: { auth: Auth; db: Firestore } | undefined;

export function getFirebase() {
  if (!firebaseConfigured) throw new Error('app/firebase-not-configured');
  if (client) return client;
  const app = getApps().length ? getApp() : initializeApp(config);
  const auth = initializeAppAuth(app);
  client = { auth, db: getFirestore(app) };
  return client;
}
