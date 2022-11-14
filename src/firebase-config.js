import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "comment-e73dc.firebaseapp.com",
  projectId: "comment-e73dc",
  storageBucket: "comment-e73dc.appspot.com",
  messagingSenderId: "217451857520",
  appId: "1:217451857520:web:0770087489b25bcfe316b5",
  measurementId: "G-6FMC33H3RB",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
