import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyAUJAB1CUxehMjArJiijIp8I3WEVlzu-rw",
  authDomain: "silent-queue-95d6d.firebaseapp.com",
  databaseURL: "https://silent-queue-95d6d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "silent-queue-95d6d",
  storageBucket: "silent-queue-95d6d.firebasestorage.app",
  messagingSenderId: "151366853266",
  appId: "1:151366853266:web:ba809f22128d12fb6e7c4b",
  measurementId: "G-25MV0FBP8F" // Needed for Analytics
};



// Initialize app
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// --- Authentication ---
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

export const observeAuthState = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

// --- Analytics ---
// ✅ ANALYTICS
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

export const trackEvent = (eventName: string, params?: any) => {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
};

// --- Cloud Messaging (Push) ---
export const messaging = getMessaging(app);

export const requestPushPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
    console.log("FCM Token:", token);
    return token;
  } else {
    console.log("Push notification permission denied");
    return null;
  }
};

export const onPushMessage = (callback: (payload: any) => void) => {
  onMessage(messaging, callback);
};