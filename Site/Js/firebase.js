import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9CBfW7JEOckMtljccHct4QYCR_OsvKQ8",
  authDomain: "katiejae-78ed5.firebaseapp.com",
  projectId: "katiejae-78ed5",
  storageBucket: "katiejae-78ed5.firebasestorage.app",
  messagingSenderId: "141000263321",
  appId: "1:141000263321:web:b90fdb6f8096331bfb9a08",
  measurementId: "G-0XX2B7VW71"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


export { auth, db };
