// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtGcRdJlOHN5KhEzVf7E6q3ZbTKGcrUHY",
  authDomain: "prepwise-4a067.firebaseapp.com",
  projectId: "prepwise-4a067",
  storageBucket: "prepwise-4a067.firebasestorage.app",
  messagingSenderId: "786882660615",
  appId: "1:786882660615:web:9bd4ca08c180385f4d5da2",
  measurementId: "G-KMPJPN12B1"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);