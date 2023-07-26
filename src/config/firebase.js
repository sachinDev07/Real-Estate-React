import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAlyxFI8jLHHCkzRsPERy2owo7oDegG2G4",
  authDomain: "realtor-clone-react-proj-6625a.firebaseapp.com",
  projectId: "realtor-clone-react-proj-6625a",
  storageBucket: "realtor-clone-react-proj-6625a.appspot.com",
  messagingSenderId: "985788035550",
  appId: "1:985788035550:web:9f7439ee2b10deafaeed4f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore();
