import { getApps, initializeApp, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC33Ct3rKTnlmNH26G2IUgpWixifnIj5z0",
  authDomain: "fir-auth-c1b72.firebaseapp.com",
  projectId: "fir-auth-c1b72",
  storageBucket: "fir-auth-c1b72.firebasestorage.app",
  messagingSenderId: "981013142429",
  appId: "1:981013142429:web:c28249bdf2074d5f732d74",
  measurementId: "G-0VXSR62NX4",
  databaseURL: 'https://fir-auth-c1b72-default-rtdb.firebaseio.com'
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getDatabase(app)

