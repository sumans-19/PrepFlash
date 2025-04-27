
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
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
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;