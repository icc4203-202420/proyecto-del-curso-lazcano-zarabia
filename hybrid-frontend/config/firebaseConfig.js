// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD3VlcnqTrHYa635YufWM4BWK0z_06PYo",
  authDomain: "project-app-73.firebaseapp.com",
  projectId: "project-app-73",
  storageBucket: "project-app-73.firebasestorage.app",
  messagingSenderId: "1011112541415",
  appId: "1:1011112541415:web:64a6459c52441fc5bcb642",
  measurementId: "G-DKDX6BWPWN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
