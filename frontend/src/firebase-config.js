// src/firebase-config.js

// Import necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import Auth module
import { getFirestore } from "firebase/firestore";  // If you plan to use Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwXK4TW3FkP5yylY-Kyqtf5s4P3YGtNaE",
  authDomain: "myjobtrackerapp.firebaseapp.com",
  projectId: "myjobtrackerapp",
  storageBucket: "myjobtrackerapp.firebasestorage.app",
  messagingSenderId: "739935514877",
  appId: "1:739935514877:web:76e96c12db8828ba4ace94",
  measurementId: "G-5HXDK54EQV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firebase services you'll use (Auth, Firestore, etc.)
export const auth = getAuth(app);  // For Firebase Authentication
export const db = getFirestore(app);  // For Firestore (if needed)