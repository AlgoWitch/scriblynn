// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUZoWBQ-FeaGxX0EftFEMbF518dYp2ifU",
  authDomain: "blogpage-login.firebaseapp.com",
  projectId: "blogpage-login",
  storageBucket: "blogpage-login.firebasestorage.app",
  messagingSenderId: "976565438529",
  appId: "1:976565438529:web:d04de275c9acbc2c749ec0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export const db=getFirestore(app);
export default app;