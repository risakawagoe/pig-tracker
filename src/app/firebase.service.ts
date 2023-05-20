// Import the functions you need from the SDKs you need
import { getDatabase } from "firebase/database"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsx9Ziwlq9X9tdazeA-C87w0W8c8r_r_Y",
  authDomain: "pig-tracker-30472.firebaseapp.com",
  databaseURL: "https://pig-tracker-30472-default-rtdb.firebaseio.com",
  projectId: "pig-tracker-30472",
  storageBucket: "pig-tracker-30472.appspot.com",
  messagingSenderId: "929835463021",
  appId: "1:929835463021:web:025a9593d92e185163aa64",
  measurementId: "G-7CCZYSFM8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app)