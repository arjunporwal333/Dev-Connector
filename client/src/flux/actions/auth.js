import {
    REGISTR_FAIL,
    REGISTR_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    CLEAR_PROFILE,
    CLEAR_POST
} from "./types";
import { SetAlert } from "./alert";
import Axios from "axios";
import setToken from "../../utils/setToken";


//Load User
export const LoadUser = () => async dispatch => {
    if (localStorage.token) {
        setToken(localStorage.token);
    }
    try {
        const res = await Axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

// Register User
export const RegisterAccount = (body) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await Axios.post("/api/user", body, config);
        dispatch({
            type: REGISTR_SUCCESS,
            payload: res.data
        })
        dispatch(LoadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        console.log(err.response.data)
        if (errors) {
            errors.forEach(error =>
                dispatch(SetAlert(error.msg, 'danger')))
        }
        dispatch({
            type: REGISTR_FAIL
        })
    }
}

// Login User
export const LoginAccount = (body) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await Axios.post("/api/auth", body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        dispatch(LoadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        console.log(err.response.data)
        if (errors) {
            errors.forEach(error =>
                dispatch(SetAlert(error.msg, 'danger')))
        }
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

export const LogoutAccount = () => async dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    })
    dispatch({
        type: CLEAR_POST
    })
    dispatch({
        type: LOGOUT_SUCCESS
    })
}
