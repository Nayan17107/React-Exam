import {
    GET_ALL_ROOMS,
    GET_ROOM,
    ADD_ROOM,
    UPDATE_ROOM,
    DELETE_ROOM,
    LOADING_ROOMS,
    ERROR_ROOMS
} from '../Actions/RoomActions';

const initialState = {
    rooms: [],
    room: null,
    isLoading: false,
    errorMsg: ""
};

const roomReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_ROOMS:
            return {
                ...state,
                isLoading: true
            };

        case ERROR_ROOMS:
            return {
                ...state,
                errorMsg: action.payload,
                isLoading: false
            };

        case GET_ALL_ROOMS:
            return {
                ...state,
                rooms: action.payload,
                isLoading: false,
                errorMsg: ""
            };

        case GET_ROOM:
            return {
                ...state,
                room: action.payload,
                isLoading: false,
                errorMsg: ""
            };

        case ADD_ROOM:
            return {
                ...state,
                rooms: [...state.rooms, action.payload],
                isLoading: false,
                errorMsg: ""
            };

        case UPDATE_ROOM:
            return {
                ...state,
                rooms: state.rooms.map(room =>
                    room.id === action.payload.id ? action.payload : room
                ),
                room: action.payload,
                isLoading: false,
                errorMsg: ""
            };

        case DELETE_ROOM:
            return {
                ...state,
                rooms: state.rooms.filter(room => room.id !== action.payload),
                room: null,
                isLoading: false,
                errorMsg: ""
            };

        default:
            return state;
    }
};

export default roomReducer;