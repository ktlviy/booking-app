import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp4wh6rJGofVYuxPt_5NiUczOGODf9-f4",
  authDomain: "booking-app-57a3a.firebaseapp.com",
  projectId: "booking-app-57a3a",
  storageBucket: "booking-app-57a3a.firebasestorage.app",
  messagingSenderId: "824913757132",
  appId: "1:824913757132:web:3a4033365bff493b98d369",
  measurementId: "G-TL5Y2Y2X5Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set authentication persistence to LOCAL
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

export { auth, db };
