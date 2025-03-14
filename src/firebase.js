// frontend/src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDwo1A8RJFonZHYAP_Pedmyk8C1n7lVyO0",
    authDomain: "sistema-atencion-dsi.firebaseapp.com",
    projectId: "sistema-atencion-dsi",
    storageBucket: "sistema-atencion-dsi.firebasestorage.app",
    messagingSenderId: "416999021991",
    appId: "1:416999021991:web:5dab2255c4e1f5571e6a82",
    measurementId: "G-0RWX61BW43"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);