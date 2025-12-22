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
export const GET_ALL_RESERVATIONS = 'GET_ALL_RESERVATIONS';
export const GET_RESERVATION = 'GET_RESERVATION';
export const ADD_RESERVATION = 'ADD_RESERVATION';
export const UPDATE_RESERVATION = 'UPDATE_RESERVATION';
export const DELETE_RESERVATION = 'DELETE_RESERVATION';
export const LOADING_RESERVATIONS = 'LOADING_RESERVATIONS';
export const ERROR_RESERVATIONS = 'ERROR_RESERVATIONS';

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
                status: 'pending_payment'
            });

            const newReservation = { id: docRef.id, ...reservationData, createdAt: new Date().toISOString(), status: 'pending_payment' };
            dispatch(addReservation(newReservation));

            // mark room temporarily as unavailable to avoid double-booking while payment pending
            const roomRef = doc(db, "rooms", reservationData.roomId);
            await updateDoc(roomRef, { isAvailable: false });

            return newReservation;
        } catch (error) {
            dispatch(errorReservations(error.message));
            throw error;
        }
    };
};

export const getReservationAsync = (id) => {
    return async (dispatch) => {
        dispatch(loadingReservations());
        try {
            const docRef = doc(db, "reservations", id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) throw new Error("Reservation not found");

            const reservation = { id, ...docSnap.data() };
            dispatch(getReservation(reservation));
            return reservation;
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

            const prev = docSnap.data();

            const updatedData = {
                ...prev,
                ...reservationData,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(docRef, updatedData);

            // If reservation is cancelled, make the room available again
            if (reservationData.status === 'cancelled' && prev.roomId) {
                const roomRef = doc(db, 'rooms', prev.roomId);
                await updateDoc(roomRef, { isAvailable: true });
            }

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