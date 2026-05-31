import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjbfOKvbGMf88Csx4FEDVm700dxx1v7f8",
  authDomain: "rupeetask-ai.firebaseapp.com",
  projectId: "rupeetask-ai",
  storageBucket: "rupeetask-ai.firebasestorage.app",
  messagingSenderId: "340243649384",
  appId: "1:340243649384:web:d08bee51bcb03bd96c3cdd",
  measurementId: "G-7Y7YGLM5G6"
};

// Initialize Firebase only once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
