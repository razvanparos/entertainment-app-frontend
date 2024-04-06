import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCPMTJ9wQUacUODTos1q-FdwUpny0aWo5E",
  authDomain: "fir-db-cce73.firebaseapp.com",
  projectId: "fir-db-cce73",
  storageBucket: "fir-db-cce73.appspot.com",
  messagingSenderId: "348917971007",
  appId: "1:348917971007:web:48e521fc57ff2f2806e08a",
  measurementId: "G-72017SG1W7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
