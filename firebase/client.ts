// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVULzA5CQgUY-c4kMg2q7YQWx4CTaGtK4",
  authDomain: "interviews-b7996.firebaseapp.com",
  projectId: "interviews-b7996",
  storageBucket: "interviews-b7996.firebasestorage.app",
  messagingSenderId: "110067293227",
  appId: "1:110067293227:web:86b48509974024338ede6e",
  measurementId: "G-H3QXFCVKZY"
};

// Initialize Firebase
const app = !getApps.length ?  initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);