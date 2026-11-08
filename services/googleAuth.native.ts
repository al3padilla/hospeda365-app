import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { getFirebase } from './firebase';
import { restoreSession } from './auth';

export async function loginGoogle() {
  // Do not load a native module in Expo Go: email/password must still work.
  if (Constants.appOwnership === 'expo') throw new Error('app/google-development-build-required');
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  if (!webClientId || (Platform.OS === 'ios' && !iosClientId)) {
    throw new Error('app/google-not-configured');
  }
  const { auth } = getFirebase();
  const { GoogleSignin, isSuccessResponse, statusCodes } = await import('@react-native-google-signin/google-signin');
  try {
    GoogleSignin.configure({ webClientId, iosClientId, offlineAccess: false });
    if (Platform.OS === 'android') await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Clear the Google SDK selection, without revoking the user's consent.
    if (GoogleSignin.hasPreviousSignIn()) await GoogleSignin.signOut();
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) return null;
    if (!response.data.idToken) throw new Error('app/google-missing-token');
    const credential = GoogleAuthProvider.credential(response.data.idToken);
    const result = await signInWithCredential(auth, credential);
    return await restoreSession(result.user);
  } catch (error) {
    if ((error as { code?: string }).code === statusCodes.SIGN_IN_CANCELLED) return null;
    throw error;
  }
}
