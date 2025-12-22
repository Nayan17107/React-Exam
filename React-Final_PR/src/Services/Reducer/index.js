import { combineReducers } from 'redux';
import roomReducer from './RoomReducer';
import reservationReducer from './ReservationReducer';

const rootReducer = combineReducers({
    rooms: roomReducer,
    reservations: reservationReducer
});

export default rootReducer;