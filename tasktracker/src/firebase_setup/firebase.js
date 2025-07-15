// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_6LUHfyOtAqX2UrT-YAQ4DmAufxk0cVU",
  authDomain: "tasktracker-80549.firebaseapp.com",
  projectId: "tasktracker-80549",
  storageBucket: "tasktracker-80549.firebasestorage.app",
  messagingSenderId: "172718868364",
  appId: "1:172718868364:web:09fb6f963df6365c7cb8a9",
  measurementId: "G-B2NRJVR1H2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export the auth object for use in other parts of the application
export const auth = getAuth(app);
// You can also export the app if needed
export { app };