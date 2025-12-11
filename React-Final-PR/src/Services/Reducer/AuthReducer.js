import {
    LOADING,
    ERROR_MSG,
    SIGNUP_SUCCESS,
    SIGNIN_SUCCESS,
    SIGNOUT_SUCCESS,
    CLEAR_ERROR,
    CLEAR_CREATED_FLAG,
    SET_USER
} from '../Actions/AuthActions';

const initialState = {
    user: JSON.parse(localStorage.getItem('luxurystay_user')) || null,
    isAuthenticated: !!JSON.parse(localStorage.getItem('luxurystay_user')),
    isLoading: false,
    errorMsg: "",
    isCreated: false
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING:
            return {
                ...state,
                isLoading: true,
                errorMsg: ""
            };

        case ERROR_MSG:
            return {
                ...state,
                errorMsg: action.payload,
                isLoading: false,
                isCreated: false
            };

        case SIGNUP_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isCreated: true,
                errorMsg: ""
            };

        case SIGNIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                errorMsg: "",
                isCreated: false
            };

        case SIGNOUT_SUCCESS:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                errorMsg: "",
                isCreated: false
            };

        case CLEAR_ERROR:
            return {
                ...state,
                errorMsg: ""
            };

        case CLEAR_CREATED_FLAG:
            return {
                ...state,
                isCreated: false
            };

        case SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload
            };

        default:
            return state;
    }
};

export default authReducer;