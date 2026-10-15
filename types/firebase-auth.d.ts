import 'firebase/auth';
import type AsyncStorage from '@react-native-async-storage/async-storage';
import type { Persistence } from 'firebase/auth';

// Firebase's RN entry exports this function, but its shared public declaration
// omits it. Keep the official native signature without weakening Auth's types.
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: Pick<typeof AsyncStorage, 'getItem' | 'setItem' | 'removeItem'>): Persistence;
}
