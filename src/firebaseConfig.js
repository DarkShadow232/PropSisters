// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2_19pKRHTJFXDag9dLdzqx7ZGQZzQCI",
  authDomain: "property-sister.firebaseapp.com",
  projectId: "property-sister",
  storageBucket: "property-sister.appspot.com",
  messagingSenderId: "835065812279",
  appId: "1:835065812279:web:16b8334a6f843ea43ea",
  measurementId: "G-HSHCVSTPF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; 