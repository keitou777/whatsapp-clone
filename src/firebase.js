// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import * as firestore from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbaQ0e1GAfcd6Ch5xTEVMQMiE32rj-wkk",
  authDomain: "whatsapp-clone-99bf0.firebaseapp.com",
  projectId: "whatsapp-clone-99bf0",
  storageBucket: "whatsapp-clone-99bf0.appspot.com",
  messagingSenderId: "950753599007",
  appId: "1:950753599007:web:5e1521c9a3b46e74da3f2a",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export { auth, provider, firebaseApp };

export default db;
