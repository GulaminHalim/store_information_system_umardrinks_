// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuZ8AsIEzJwGVeCPn63xrLU-jR8dt7b6g",
  authDomain: "umardrinksordersystem.firebaseapp.com",
  projectId: "umardrinksordersystem",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
