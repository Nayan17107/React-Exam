import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './src/Services/Reducer/RoomReducer';
import reservationReducer from './src/Services/Reducer/ReservationReducer';
import authReducer from './src/Services/Reducer/AuthReducer';

export const store = configureStore({
    reducer: {
        rooms: roomReducer,
        reservations: reservationReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});