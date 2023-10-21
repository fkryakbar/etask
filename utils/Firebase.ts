import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD3WWN20TBlxLGbVKhQ939TI8mub9oQzp8",
    authDomain: "etask-8689b.firebaseapp.com",
    projectId: "etask-8689b",
    storageBucket: "etask-8689b.appspot.com",
    messagingSenderId: "307331816337",
    appId: "1:307331816337:web:d40dabd824d2145e619830",
    measurementId: "G-G5DF7CKEHE"
};

const FirebaseApp = initializeApp(firebaseConfig);
export default FirebaseApp