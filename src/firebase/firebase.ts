import { getApps, initializeApp, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC33Ct3rKTnlmNH26G2IUgpWixifnIj5z0",
  authDomain: "fir-auth-c1b72.firebaseapp.com",
  projectId: "fir-auth-c1b72",
  storageBucket: "fir-auth-c1b72.firebasestorage.app",
  messagingSenderId: "981013142429",
  appId: "1:981013142429:web:c28249bdf2074d5f732d74",
  measurementId: "G-0VXSR62NX4"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db,app};
