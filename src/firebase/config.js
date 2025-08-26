// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiRHw5wilWQY5fSsHnOqJxRVoeUPwcc4I",
  authDomain: "tailortech-c7d77.firebaseapp.com",
  projectId: "tailortech-c7d77",
  storageBucket: "tailortech-c7d77.firebasestorage.app",
  messagingSenderId: "124555400425",
  appId: "1:124555400425:web:9f441fcfbf4e0bdfaf0c78",
  measurementId: "G-4XY93FQP0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider with your OAuth Client ID
googleProvider.setCustomParameters({
  prompt: 'select_account',
  client_id: '32113548126-1750n497pi68lj2gtbnp00cb32v4vgib.apps.googleusercontent.com'
});

export default app;
