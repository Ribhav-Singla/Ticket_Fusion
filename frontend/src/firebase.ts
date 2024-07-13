// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqoK6QoESO29PjBmdK_vl3CNClNTx3RKE",
  authDomain: "event-management-website-d44c1.firebaseapp.com",
  projectId: "event-management-website-d44c1",
  storageBucket: "event-management-website-d44c1.appspot.com",
  messagingSenderId: "281152638012",
  appId: "1:281152638012:web:ad8d03536a7db81c840739",
  measurementId: "G-3SW49S5CFQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//@ts-ignore
const analytics = getAnalytics(app);
export const storage = getStorage(app);