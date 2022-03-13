import { REGISTR_FAIL, REGISTR_SUCCESS, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, DELETE_ACCOUNT } from "../actions/types";

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function Random(state = initialState, action) {
    switch (action.type) {
        case REGISTR_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            }
        case REGISTR_FAIL:
        case LOGIN_FAIL:
        case AUTH_ERROR:
        case LOGOUT_SUCCESS:
        case DELETE_ACCOUNT:
            localStorage.removeItem('token');
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                token: null,
                user: null
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            }
        default:
            return state;
    }
}