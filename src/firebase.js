// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBa18vpXENBp8ZA_VUnF3bbC7pCSPz-9I0",
  authDomain: "lilholtcafe.firebaseapp.com",
  projectId: "lilholtcafe",
  storageBucket: "lilholtcafe.firebasestorage.app",
  messagingSenderId: "1049101407738",
  appId: "1:1049101407738:web:0c4af8e1784eb8d85ec043",
  measurementId: "G-VWSLXMS27N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Initialize authentication and Firestore
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);