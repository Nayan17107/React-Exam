import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../Config/firebase.config';
export const LOADING = 'AUTH_LOADING';
export const ERROR_MSG = 'AUTH_ERROR_MSG';
export const SIGNUP_SUCCESS = 'AUTH_SIGNUP_SUCCESS';
export const SIGNIN_SUCCESS = 'AUTH_SIGNIN_SUCCESS';
export const SIGNOUT_SUCCESS = 'AUTH_SIGNOUT_SUCCESS';
export const CLEAR_ERROR = 'AUTH_CLEAR_ERROR';
export const CLEAR_CREATED_FLAG = 'AUTH_CLEAR_CREATED_FLAG';
export const SET_USER = 'AUTH_SET_USER';

export const loading = () => ({
    type: LOADING
});

export const errorMsg = (msg) => ({
    type: ERROR_MSG,
    payload: msg
});

export const signUpSuccess = () => ({
    type: SIGNUP_SUCCESS
});

export const signInSuccess = (user) => ({
    type: SIGNIN_SUCCESS,
    payload: user
});

export const signOutSuccess = () => ({
    type: SIGNOUT_SUCCESS
});

export const clearError = () => ({
    type: CLEAR_ERROR
});

export const clearCreatedFlag = () => ({
    type: CLEAR_CREATED_FLAG
});

export const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

const getErrorMessage = (error) => {
    return error.message || 'An error occurred';
};

const loadUserFromStorage = () => {
    try {
        const userData = localStorage.getItem('luxurystay_user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error loading user from storage:', error);
        return null;
    }
};

export const signUpAsync = (userData) => {
    return async (dispatch) => {
        dispatch(loading());
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );

            const user = userCredential.user;

            await updateProfile(user, {
                displayName: userData.name
            });

            const userDoc = {
                uid: user.uid,
                email: userData.email,
                name: userData.name,
                phone: userData.phone || '',
                role: 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await setDoc(doc(db, 'users', user.uid), userDoc);

            const token = await user.getIdToken();
            const userWithToken = {
                ...userDoc,
                token
            };

            dispatch(signUpSuccess());
            dispatch(signInSuccess(userWithToken));

            localStorage.setItem('luxurystay_user', JSON.stringify(userWithToken));

            return userWithToken;

        } catch (error) {
            dispatch(errorMsg(getErrorMessage(error)));
            throw error;
        }
    };
};

export const signInAsync = (credentials) => {
    return async (dispatch) => {
        dispatch(loading());
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );

            const user = userCredential.user;
            const userDocSnap = await getDoc(doc(db, 'users', user.uid));

            let userData;

            if (!userDocSnap.exists()) {
                const newUserDoc = {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || 'User',
                    phone: '',
                    role: 'user',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                await setDoc(doc(db, 'users', user.uid), newUserDoc);
                userData = newUserDoc;
            } else {
                userData = userDocSnap.data();
            }

            const token = await user.getIdToken();

            const userWithToken = {
                uid: user.uid,
                email: user.email,
                name: userData.name || user.displayName || 'User',
                phone: userData.phone || '',
                role: userData.role || 'user',
                token
            };

            dispatch(signInSuccess(userWithToken));

            localStorage.setItem('luxurystay_user', JSON.stringify(userWithToken));

            return userWithToken;

        } catch (error) {
            dispatch(errorMsg(getErrorMessage(error)));
            throw error;
        }
    };
};

export const signInWithGoogleAsync = () => {
    return async (dispatch) => {
        dispatch(loading());
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            const userDocSnap = await getDoc(doc(db, 'users', user.uid));

            let userData;

            if (!userDocSnap.exists()) {
                const newUserDoc = {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || 'User',
                    phone: '',
                    role: 'user',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                await setDoc(doc(db, 'users', user.uid), newUserDoc);
                userData = newUserDoc;
            } else {
                userData = userDocSnap.data();
            }

            const token = await user.getIdToken();

            const userWithToken = {
                uid: user.uid,
                email: user.email,
                name: userData.name || user.displayName || 'User',
                phone: userData.phone || '',
                role: userData.role || 'user',
                token
            };

            dispatch(signInSuccess(userWithToken));

            localStorage.setItem('luxurystay_user', JSON.stringify(userWithToken));

            return userWithToken;

        } catch (error) {
            dispatch(errorMsg(getErrorMessage(error)));
            throw error;
        }
    };
};

export const signOutAsync = () => {
    return async (dispatch) => {
        dispatch(loading());
        try {
            await signOut(auth);
            dispatch(signOutSuccess());

            // Clear localStorage
            localStorage.removeItem('luxurystay_user');

        } catch (error) {
            dispatch(errorMsg(getErrorMessage(error)));
            throw error;
        }
    };
};

export const checkAuthState = () => {
    return async (dispatch) => {
        dispatch(loading());

        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                unsubscribe();

                if (!firebaseUser) {
                    dispatch(signOutSuccess());
                    resolve(null);
                    return;
                }

                try {
                    const userDocSnap = await getDoc(doc(db, 'users', firebaseUser.uid));

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        const token = await firebaseUser.getIdToken();

                        const user = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            name: userData.name || firebaseUser.displayName || 'User',
                            phone: userData.phone || '',
                            role: userData.role || 'user',
                            token
                        };

                        dispatch(signInSuccess(user));
                        localStorage.setItem('luxurystay_user', JSON.stringify(user));
                        resolve(user);
                    } else {
                        dispatch(signOutSuccess());
                        resolve(null);
                    }
                } catch (error) {
                    dispatch(errorMsg(getErrorMessage(error)));
                    dispatch(signOutSuccess());
                    resolve(null);
                }
            });
        });
    };
};

export const loadInitialUser = () => {
    return (dispatch) => {
        const user = loadUserFromStorage();
        if (user) {
            dispatch(setUser(user));
        }
    };
};