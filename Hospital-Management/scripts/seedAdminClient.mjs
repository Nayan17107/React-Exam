import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '../Config/firebase.config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const email = 'admin123@gmail.com';
const password = 'admin123';

async function seedAdmin() {
    try {
        let userCred;
        try {
            userCred = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Admin user created:', userCred.user.uid);
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                console.log('Admin already exists, attempting sign-in to set role...');
                const signInRes = await signInWithEmailAndPassword(auth, email, password);
                userCred = signInRes;
            } else {
                throw err;
            }
        }

        const uid = userCred.user.uid;

        await setDoc(doc(db, 'users', uid), {
            uid,
            email,
            name: 'Admin',
            role: 'admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        console.log('Admin role set in Firestore for', email);
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seedAdmin();
