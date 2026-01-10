import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAUJAB1CUxehMjArJiijIp8I3WEVlzu-rw",
  authDomain: "silent-queue-95d6d.firebaseapp.com",
  databaseURL: "https://silent-queue-95d6d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "silent-queue-95d6d",
  storageBucket: "silent-queue-95d6d.firebasestorage.app",
  messagingSenderId: "151366853266",
  appId: "1:151366853266:web:ba809f22128d12fb6e7c4b"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);
