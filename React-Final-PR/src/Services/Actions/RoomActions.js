// // Action Types
// export const GET_ALL_ROOMS = 'GET_ALL_ROOMS';
// export const GET_ROOM = 'GET_ROOM';
// export const ADD_ROOM = 'ADD_ROOM';
// export const UPDATE_ROOM = 'UPDATE_ROOM';
// export const DELETE_ROOM = 'DELETE_ROOM';
// export const LOADING = 'LOADING';
// export const ERROR = 'ERROR';
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

// export const getAllRooms = (rooms) => ({
//     type: GET_ALL_ROOMS,
//     payload: rooms
// });

// export const getRoom = (room) => ({
//     type: GET_ROOM,
//     payload: room
// });

// export const addRoom = (room) => ({
//     type: ADD_ROOM,
//     payload: room
// });

// export const updateRoom = (room) => ({
//     type: UPDATE_ROOM,
//     payload: room
// });

// export const deleteRoom = (id) => ({
//     type: DELETE_ROOM,
//     payload: id
// });

// export const loading = () => ({ type: LOADING });

// export const errorMsg = (msg) => ({
//     type: ERROR,
//     payload: msg
// });

// // Get all rooms from Firebase
// export const getAllRoomsAsync = () => {
//     return async (dispatch) => {
//         dispatch(loading());
//         try {
//             const querySnapshot = await getDocs(collection(db, "rooms"));

//             let rooms = [];
//             querySnapshot.forEach((docSnap) => {
//                 rooms.push({ id: docSnap.id, ...docSnap.data() });
//             });

//             dispatch(getAllRooms(rooms));
//         } catch (error) {
//             dispatch(errorMsg(error.message));
//         }
//     };
// };

// // Add new room to Firebase
// export const addRoomAsync = (roomData) => {
//     return async (dispatch) => {
//         dispatch(loading());
//         try {
//             const docRef = await addDoc(collection(db, "rooms"), {
//                 ...roomData,
//                 createdAt: new Date().toISOString(),
//                 isAvailable: true
//             });

//             const newRoom = { id: docRef.id, ...roomData };
//             dispatch(addRoom(newRoom));
//         } catch (error) {
//             dispatch(errorMsg(error.message));
//         }
//     };
// };

// // Get single room
// export const getRoomAsync = (id) => {
//     return async (dispatch) => {
//         dispatch(loading());
//         try {
//             const docRef = doc(db, "rooms", id);
//             const docSnap = await getDoc(docRef);

//             if (!docSnap.exists()) throw new Error("Room not found");

//             dispatch(getRoom({ id, ...docSnap.data() }));
//         } catch (error) {
//             dispatch(errorMsg(error.message));
//         }
//     };
// };

// // Update room
// export const updateRoomAsync = (id, roomData) => {
//     return async (dispatch) => {
//         dispatch(loading());
//         try {
//             const docRef = doc(db, "rooms", id);
//             const docSnap = await getDoc(docRef);
//             if (!docSnap.exists()) throw new Error("Room not found");

//             const updatedData = {
//                 ...docSnap.data(),
//                 ...roomData,
//                 updatedAt: new Date().toISOString()
//             };

//             await updateDoc(docRef, updatedData);
//             dispatch(updateRoom({ id, ...updatedData }));

//         } catch (error) {
//             dispatch(errorMsg(error.message));
//         }
//     };
// };

// // Delete room
// export const deleteRoomAsync = (id) => {
//     return async (dispatch) => {
//         dispatch(loading());
//         try {
//             const docRef = doc(db, "rooms", id);
//             await deleteDoc(docRef);

//             dispatch(deleteRoom(id));
//         } catch (error) {
//             dispatch(errorMsg(error.message));
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
export const GET_ALL_ROOMS = 'GET_ALL_ROOMS';
export const GET_ROOM = 'GET_ROOM';
export const ADD_ROOM = 'ADD_ROOM';
export const UPDATE_ROOM = 'UPDATE_ROOM';
export const DELETE_ROOM = 'DELETE_ROOM';
export const LOADING_ROOMS = 'LOADING_ROOMS';
export const ERROR_ROOMS = 'ERROR_ROOMS';

// Action Creators
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

// Async Thunks
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
        dispatch(loadingRooms());
        try {
            const docRef = await addDoc(collection(db, "rooms"), {
                ...roomData,
                createdAt: new Date().toISOString(),
                isAvailable: true
            });

            const newRoom = { id: docRef.id, ...roomData };
            dispatch(addRoom(newRoom));
            return newRoom;
        } catch (error) {
            dispatch(errorRooms(error.message));
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
            const docRef = doc(db, "rooms", id);
            await deleteDoc(docRef);

            dispatch(deleteRoom(id));
            return id;
        } catch (error) {
            dispatch(errorRooms(error.message));
            throw error;
        }
    };
};