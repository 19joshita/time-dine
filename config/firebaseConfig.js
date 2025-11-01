// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA06UMYKUaH3jRW9OkpnICpV7Q4tBtN950",
  authDomain: "dine-time-79abd.firebaseapp.com",
  projectId: "dine-time-79abd",
  storageBucket: "dine-time-79abd.firebasestorage.app",
  messagingSenderId: "931848988343",
  appId: "1:931848988343:web:27aab0880f44796369cf32",
  measurementId: "G-RQTCSXY00R",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
