// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzQqU0BDg6uvkLPhRNR2aofyX1lfTYqPc",
  authDomain: "airs-bc7e8.firebaseapp.com",
  projectId: "airs-bc7e8",
  storageBucket: "airs-bc7e8.firebasestorage.app",
  messagingSenderId: "655800118761",
  appId: "1:655800118761:web:565c32bd0b335db21daf78",
  measurementId: "G-6W609Z3WVM"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);