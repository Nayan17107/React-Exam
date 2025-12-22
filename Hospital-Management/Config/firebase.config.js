import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAm4zQYZYvwwNdjboqmbNpLlapIvvaRePE",
    authDomain: "hotel-management-d2e57.firebaseapp.com",
    projectId: "hotel-management-d2e57",
    storageBucket: "hotel-management-d2e57.firebasestorage.app",
    messagingSenderId: "1046045427228",
    appId: "1:1046045427228:web:2d28c343f8e77d1cabc1d9",
    measurementId: "G-H37VSF4NMS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { firebaseConfig };