import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "onecart-14b32.firebaseapp.com",
  projectId: "onecart-14b32",
  storageBucket: "onecart-14b32.firebasestorage.app",
  messagingSenderId: "892033895164",
  appId: "1:892033895164:web:724f9d38e2c3e6f02de579"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider =new GoogleAuthProvider;

export { auth, provider };