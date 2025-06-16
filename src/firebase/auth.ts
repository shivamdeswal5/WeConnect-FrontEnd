import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebase';

export async function signUpWithEmail(name: string, email: string, password: string) {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  if (res.user) {
    await updateProfile(res.user, { displayName: name });
  }
  return res.user;
}

export async function loginWithEmail(email: string, password: string) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  return res.user;
}
