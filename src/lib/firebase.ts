import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUwYcgSBg1npx7iurwvHBJj7fszByjLm0",
  authDomain: "imoob-90bd7.firebaseapp.com",
  projectId: "imoob-90bd7",
  storageBucket: "imoob-90bd7.firebasestorage.app",
  messagingSenderId: "33674472865",
  appId: "1:33674472865:web:87d11bf71d6950fdf2afe0",
  measurementId: "G-686KX4TM2D"
};

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialize Firebase safely for Next.js (SSR friendly)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics conditionally (only runs on client side to prevent SSR crashes)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => yes && (analytics = getAnalytics(app)));
}

export { app, analytics, db, auth };
