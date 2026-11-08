import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { getFirebase } from "./firebase";

WebBrowser.maybeCompleteAuthSession();

async function ensureProfile(user: any) {
  const { db } = getFirebase();

  const ref = doc(
    db,
    "users",
    user.uid
  );

  const snapshot =
    await getDoc(ref);

  if (!snapshot.exists()) {

    const nombres =
      (
        user.displayName || ""
      ).split(" ");

    await setDoc(ref, {
      uid: user.uid,
      nombre:
        nombres[0] ||
        "Huésped",
      apellido:
        nombres.slice(1).join(" "),
      email:
        user.email?.toLowerCase(),
      rol: "huesped",
      activo: true,
      createdAt:
        serverTimestamp(),
    });
  }
}

export async function loginGoogle(
  idToken: string
) {

  const { auth } =
    getFirebase();

  const credential =
    GoogleAuthProvider.credential(
      idToken
    );

  const result =
    await signInWithCredential(
      auth,
      credential
    );

  await ensureProfile(
    result.user
  );

  return result.user;
}