import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where
} from "firebase/firestore";
import { db } from "../../../Config/firebase.config";
export const GET_ALL_ROOMS = 'GET_ALL_ROOMS';
export const GET_ROOM = 'GET_ROOM';
export const ADD_ROOM = 'ADD_ROOM';
export const UPDATE_ROOM = 'UPDATE_ROOM';
export const DELETE_ROOM = 'DELETE_ROOM';
export const LOADING_ROOMS = 'LOADING_ROOMS';
export const ERROR_ROOMS = 'ERROR_ROOMS';

export const getAllRooms = (rooms) => ({
    type: GET_ALL_ROOMS,
    payload: rooms
});

export const getRoom = (room) => ({
    type: GET_ROOM,
    payload: room
});

export const addRoom = (room) => ({
    type: ADD_ROOM,
    payload: room
});

export const updateRoom = (room) => ({
    type: UPDATE_ROOM,
    payload: room
});

export const deleteRoom = (id) => ({
    type: DELETE_ROOM,
    payload: id
});

export const loadingRooms = () => ({ type: LOADING_ROOMS });

export const errorRooms = (msg) => ({
    type: ERROR_ROOMS,
    payload: msg
});

export const getAllRoomsAsync = () => {
    return async (dispatch) => {
        dispatch(loadingRooms());
        try {
            const querySnapshot = await getDocs(collection(db, "rooms"));

            let rooms = [];
            querySnapshot.forEach((docSnap) => {
                rooms.push({ id: docSnap.id, ...docSnap.data() });
            });

            dispatch(getAllRooms(rooms));
        } catch (error) {
            dispatch(errorRooms(error.message));
        }
    };
};

export const addRoomAsync = (roomData) => {
    return async (dispatch) => {
        dispatch({ type: LOADING_ROOMS }); 

        try {
            // Basic client-side authorization check using stored user info
            let storedUser = null;
            try {
                storedUser = JSON.parse(localStorage.getItem('luxurystay_user'));
            } catch {
                // ignore
            }

            if (!storedUser || storedUser.role !== 'admin') {
                throw new Error('Unauthorized: only admins can add rooms');
            }

            const docRef = await addDoc(collection(db, "rooms"), {
                ...roomData,
                createdAt: new Date().toISOString(),
                isAvailable: true
            });

            const newRoom = {
                id: docRef.id,
                ...roomData
            };

            dispatch({
                type: ADD_ROOM,
                payload: newRoom
            });

            return newRoom;
        } catch (error) {
            dispatch({
                type: ERROR_ROOMS,
                payload: error.message
            });
            throw error;
        }
    };
};

export const getRoomAsync = (id) => {
    return async (dispatch) => {
        dispatch(loadingRooms());
        try {
            const docRef = doc(db, "rooms", id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) throw new Error("Room not found");

            const room = { id, ...docSnap.data() };
            dispatch(getRoom(room));
            return room;
        } catch (error) {
            dispatch(errorRooms(error.message));
            throw error;
        }
    };
};

export const updateRoomAsync = (id, roomData) => {
    return async (dispatch) => {
        dispatch(loadingRooms());
        try {
            const docRef = doc(db, "rooms", id);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) throw new Error("Room not found");

            const updatedData = {
                ...docSnap.data(),
                ...roomData,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(docRef, updatedData);
            dispatch(updateRoom({ id, ...updatedData }));
            return { id, ...updatedData };
        } catch (error) {
            dispatch(errorRooms(error.message));
            throw error;
        }
    };
};

export const deleteRoomAsync = (id) => {
    return async (dispatch) => {
        dispatch(loadingRooms());
        try {
            const reservationsQuery = query(
                collection(db, "reservations"),
                where("roomId", "==", id)
            );

            const reservationsSnapshot = await getDocs(reservationsQuery);
            const deletePromises = reservationsSnapshot.docs.map(docSnap =>
                deleteDoc(doc(db, "reservations", docSnap.id))
            );

            await Promise.all(deletePromises);

            const roomRef = doc(db, "rooms", id);
            await deleteDoc(roomRef);

            dispatch(deleteRoom(id));

            reservationsSnapshot.docs.forEach(docSnap => {
                dispatch({ type: 'DELETE_RESERVATION', payload: docSnap.id });
            });

            return id;
        } catch (error) {
            dispatch(errorRooms(error.message));
            throw error;
        }
    };
};