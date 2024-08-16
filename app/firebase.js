// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABurxehqPKtXl5yxV54TItqDgspOQtieo",
  authDomain: "inventory-management-e8bd2.firebaseapp.com",
  projectId: "inventory-management-e8bd2",
  storageBucket: "inventory-management-e8bd2.appspot.com",
  messagingSenderId: "123317287617",
  appId: "1:123317287617:web:5b5a7f17f59a08fdb83240",
  measurementId: "G-6Z1H783XRS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const firestore = getFirestore(app)

export{firestore}