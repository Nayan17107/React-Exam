// import {
//     GET_ALL_RESERVATIONS,
//     GET_RESERVATION,
//     ADD_RESERVATION,
//     UPDATE_RESERVATION,
//     DELETE_RESERVATION,
//     LOADING_RESERVATIONS,
//     ERROR_RESERVATIONS
// } from '../Actions/ReservationActions';

// const initialState = {
//     reservations: [],
//     reservation: null,
//     isLoading: false,
//     errorMsg: ""
// };

// const reservationReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case LOADING_RESERVATIONS:
//             return {
//                 ...state,
//                 isLoading: true
//             };

//         case ERROR_RESERVATIONS:
//             return {
//                 ...state,
//                 errorMsg: action.payload,
//                 isLoading: false
//             };

//         case GET_ALL_RESERVATIONS:
//             return {
//                 ...state,
//                 reservations: action.payload,
//                 isLoading: false,
//                 errorMsg: ""
//             };

//         case GET_RESERVATION:
//             return {
//                 ...state,
//                 reservation: action.payload,
//                 isLoading: false,
//                 errorMsg: ""
//             };

//         case ADD_RESERVATION:
//             return {
//                 ...state,
//                 reservations: [...state.reservations, action.payload],
//                 isLoading: false,
//                 errorMsg: ""
//             };

//         case UPDATE_RESERVATION:
//             return {
//                 ...state,
//                 reservations: state.reservations.map(res =>
//                     res.id === action.payload.id ? action.payload : res
//                 ),
//                 reservation: action.payload,
//                 isLoading: false,
//                 errorMsg: ""
//             };

//         case DELETE_RESERVATION:
//             return {
//                 ...state,
//                 reservations: state.reservations.filter(res => res.id !== action.payload),
//                 reservation: null,
//                 isLoading: false,
//                 errorMsg: ""
//             };

//         default:
//             return state;
//     }
// };

// export default reservationReducer;  

import {
    GET_ALL_RESERVATIONS,
    GET_RESERVATION,
    ADD_RESERVATION,
    UPDATE_RESERVATION,
    DELETE_RESERVATION,
    LOADING_RESERVATIONS,
    ERROR_RESERVATIONS
} from '../Actions/ReservationActions';

const initialState = {
    reservations: [],
    reservation: null,
    isLoading: false,
    errorMsg: ""
};

const reservationReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_RESERVATIONS:
            return {
                ...state,
                isLoading: true
            };

        case ERROR_RESERVATIONS:
            return {
                ...state,
                errorMsg: action.payload,
                isLoading: false
            };

        case GET_ALL_RESERVATIONS:
            return {
                ...state,
                reservations: action.payload,
                isLoading: false,
                errorMsg: ""
            };

        case GET_RESERVATION:
            return {
                ...state,
                reservation: action.payload,
                isLoading: false,
                errorMsg: ""
            };

        case ADD_RESERVATION:
            return {
                ...state,
                reservations: [...state.reservations, action.payload],
                isLoading: false,
                errorMsg: ""
            };

        case UPDATE_RESERVATION:
            return {
                ...state,
                reservations: state.reservations.map(res =>
                    res.id === action.payload.id ? action.payload : res
                ),
                reservation: action.payload,
                isLoading: false,
                errorMsg: ""
            };

        case DELETE_RESERVATION:
            return {
                ...state,
                reservations: state.reservations.filter(res => res.id !== action.payload),
                reservation: null,
                isLoading: false,
                errorMsg: ""
            };

        default:
            return state;
    }
};

export default reservationReducer;