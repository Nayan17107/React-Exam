// // Action Types
// export const GET_ALL_RESERVATIONS = 'GET_ALL_RESERVATIONS';
// export const GET_RESERVATION = 'GET_RESERVATION';
// export const ADD_RESERVATION = 'ADD_RESERVATION';
// export const UPDATE_RESERVATION = 'UPDATE_RESERVATION';
// export const DELETE_RESERVATION = 'DELETE_RESERVATION';
// export const LOADING_RESERVATIONS = 'LOADING_RESERVATIONS';
// export const ERROR_RESERVATIONS = 'ERROR_RESERVATIONS';
// import {
//     collection,
//     getDocs,
//     getDoc,
//     addDoc,
//     updateDoc,
//     deleteDoc,
//     doc
// } from "firebase/firestore";
// import { db } from "../../../Config/firebase.config";

// // Action Creators
// export const getAllReservations = (reservations) => ({
//     type: GET_ALL_RESERVATIONS,
//     payload: reservations
// });

// export const getReservation = (reservation) => ({
//     type: GET_RESERVATION,
//     payload: reservation
// });

// export const addReservation = (reservation) => ({
//     type: ADD_RESERVATION,
//     payload: reservation
// });

// export const updateReservation = (reservation) => ({
//     type: UPDATE_RESERVATION,
//     payload: reservation
// });

// export const deleteReservation = (id) => ({
//     type: DELETE_RESERVATION,
//     payload: id
// });

// export const loadingReservations = () => ({ type: LOADING_RESERVATIONS });

// export const errorReservations = (msg) => ({
//     type: ERROR_RESERVATIONS,
//     payload: msg
// });

// // Get all reservations
// export const getAllReservationsAsync = () => {
//     return async (dispatch) => {
//         dispatch(loadingReservations());
//         try {
//             const querySnapshot = await getDocs(collection(db, "reservations"));

//             let reservations = [];
//             querySnapshot.forEach((docSnap) => {
//                 reservations.push({ id: docSnap.id, ...docSnap.data() });
//             });

//             dispatch(getAllReservations(reservations));
//         } catch (error) {
//             dispatch(errorReservations(error.message));
//         }
//     };
// };

// // Add new reservation
// export const addReservationAsync = (reservationData) => {
//     return async (dispatch) => {
//         dispatch(loadingReservations());
//         try {
//             const docRef = await addDoc(collection(db, "reservations"), {
//                 ...reservationData,
//                 createdAt: new Date().toISOString(),
//                 status: 'confirmed'
//             });

//             const newReservation = { id: docRef.id, ...reservationData };
//             dispatch(addReservation(newReservation));

//             const roomRef = doc(db, "rooms", reservationData.roomId);
//             await updateDoc(roomRef, { isAvailable: false });

//         } catch (error) {
//             dispatch(errorReservations(error.message));
//         }
//     };
// };

// // Update reservation
// export const updateReservationAsync = (id, reservationData) => {
//     return async (dispatch) => {
//         dispatch(loadingReservations());
//         try {
//             const docRef = doc(db, "reservations", id);
//             const docSnap = await getDoc(docRef);
//             if (!docSnap.exists()) throw new Error("Reservation not found");

//             const updatedData = {
//                 ...docSnap.data(),
//                 ...reservationData,
//                 updatedAt: new Date().toISOString()
//             };

//             await updateDoc(docRef, updatedData);
//             dispatch(updateReservation({ id, ...updatedData }));

//         } catch (error) {
//             dispatch(errorReservations(error.message));
//         }
//     };
// };

// // Cancel/Delete reservation
// export const deleteReservationAsync = (id, roomId) => {
//     return async (dispatch) => {
//         dispatch(loadingReservations());
//         try {
//             const docRef = doc(db, "reservations", id);
//             await deleteDoc(docRef);

//             const roomRef = doc(db, "rooms", roomId);
//             await updateDoc(roomRef, { isAvailable: true });

//             dispatch(deleteReservation(id));
//         } catch (error) {
//             dispatch(errorReservations(error.message));
//         }
//     };
// };

import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore";
import { db } from "../../../Config/firebase.config";

// Action Types
export const GET_ALL_RESERVATIONS = 'GET_ALL_RESERVATIONS';
export const GET_RESERVATION = 'GET_RESERVATION';
export const ADD_RESERVATION = 'ADD_RESERVATION';
export const UPDATE_RESERVATION = 'UPDATE_RESERVATION';
export const DELETE_RESERVATION = 'DELETE_RESERVATION';
export const LOADING_RESERVATIONS = 'LOADING_RESERVATIONS';
export const ERROR_RESERVATIONS = 'ERROR_RESERVATIONS';

// Action Creators
export const getAllReservations = (reservations) => ({
    type: GET_ALL_RESERVATIONS,
    payload: reservations
});

export const getReservation = (reservation) => ({
    type: GET_RESERVATION,
    payload: reservation
});

export const addReservation = (reservation) => ({
    type: ADD_RESERVATION,
    payload: reservation
});

export const updateReservation = (reservation) => ({
    type: UPDATE_RESERVATION,
    payload: reservation
});

export const deleteReservation = (id) => ({
    type: DELETE_RESERVATION,
    payload: id
});

export const loadingReservations = () => ({ type: LOADING_RESERVATIONS });

export const errorReservations = (msg) => ({
    type: ERROR_RESERVATIONS,
    payload: msg
});

// Async Thunks
export const getAllReservationsAsync = () => {
    return async (dispatch) => {
        dispatch(loadingReservations());
        try {
            const querySnapshot = await getDocs(collection(db, "reservations"));

            let reservations = [];
            querySnapshot.forEach((docSnap) => {
                reservations.push({ id: docSnap.id, ...docSnap.data() });
            });

            dispatch(getAllReservations(reservations));
        } catch (error) {
            dispatch(errorReservations(error.message));
        }
    };
};

export const addReservationAsync = (reservationData) => {
    return async (dispatch) => {
        dispatch(loadingReservations());
        try {
            const docRef = await addDoc(collection(db, "reservations"), {
                ...reservationData,
                createdAt: new Date().toISOString(),
                status: 'confirmed'
            });

            const newReservation = { id: docRef.id, ...reservationData };
            dispatch(addReservation(newReservation));

            const roomRef = doc(db, "rooms", reservationData.roomId);
            await updateDoc(roomRef, { isAvailable: false });

            return newReservation;
        } catch (error) {
            dispatch(errorReservations(error.message));
            throw error;
        }
    };
};

export const updateReservationAsync = (id, reservationData) => {
    return async (dispatch) => {
        dispatch(loadingReservations());
        try {
            const docRef = doc(db, "reservations", id);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) throw new Error("Reservation not found");

            const updatedData = {
                ...docSnap.data(),
                ...reservationData,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(docRef, updatedData);
            dispatch(updateReservation({ id, ...updatedData }));
            return { id, ...updatedData };
        } catch (error) {
            dispatch(errorReservations(error.message));
            throw error;
        }
    };
};

export const deleteReservationAsync = (id, roomId) => {
    return async (dispatch) => {
        dispatch(loadingReservations());
        try {
            const docRef = doc(db, "reservations", id);
            await deleteDoc(docRef);

            if (roomId) {
                const roomRef = doc(db, "rooms", roomId);
                await updateDoc(roomRef, { isAvailable: true });
            }

            dispatch(deleteReservation(id));
            return id;
        } catch (error) {
            dispatch(errorReservations(error.message));
            throw error;
        }
    };
};