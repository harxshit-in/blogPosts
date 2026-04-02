import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBiRQKpQD_DR2hIph1CN6GFna804o6wofc",
  authDomain: "blogsbassc.firebaseapp.com",
  projectId: "blogsbassc",
  storageBucket: "blogsbassc.firebasestorage.app",
  messagingSenderId: "946473688557",
  appId: "1:946473688557:web:2024240183bf092c3cdbe4"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
