import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';

export function initializeAppAuth(app: FirebaseApp) {
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch (error) {
    if ((error as { code?: string }).code !== 'auth/already-initialized') throw error;
    return getAuth(app);
  }
}
