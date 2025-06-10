// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyAlFt1WaAxb1v-d7Qh4WF9r2tGf4vUjBQI",
  authDomain: "dia-treze.firebaseapp.com",
  projectId: "dia-treze",
  storageBucket: "dia-treze.firebasestorage.app",
  messagingSenderId: "36759181400",
  appId: "1:36759181400:web:2fefd40d4d7b22b920d22d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
