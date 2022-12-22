// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC-hjuYvRH1M_J0CFHWTudG5Zt3M0QdkqQ",
    authDomain: "to-do-list-react-c34bd.firebaseapp.com",
    projectId: "to-do-list-react-c34bd",
    storageBucket: "to-do-list-react-c34bd.appspot.com",
    messagingSenderId: "967144183973",
    appId: "1:967144183973:web:49922dc12cc078d7b8954c",
    measurementId: "G-7TNSYVX7DP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
export { db };