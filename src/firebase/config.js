import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase config from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyAMaHauYpfHWTdBtD-5dWNdLTUozEQ9IKU",
    authDomain: "gestordecuentas-dc416.firebaseapp.com",
    projectId: "gestordecuentas-dc416",
    storageBucket: "gestordecuentas-dc416.firebasestorage.app",
    messagingSenderId: "822673771303",
    appId: "1:822673771303:web:a16b2ccd32feadcf3b7702",
    measurementId: "G-G2PN8PJC3K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
