// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-OX7rqN_1JUYST3mkm4blsL7cdFB90T0",
  authDomain: "propsisters-7c886.firebaseapp.com",
  projectId: "propsisters-7c886",
  storageBucket: "propsisters-7c886.firebasestorage.app",
  messagingSenderId: "341497966822",
  appId: "1:341497966822:web:c2bd865392efafa2cc4b27",
  measurementId: "G-ZJG4CLCG61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app; 