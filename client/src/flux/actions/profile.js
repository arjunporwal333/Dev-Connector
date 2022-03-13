import Axios from 'axios';
import { PROFILE_ERROR, GET_PROFILE, UPDATE_PROFILE, CLEAR_PROFILE, DELETE_ACCOUNT, GET_REPOS, GET_ALL_PROFILE } from "./types";
import { SetAlert } from "./alert";

export const GetProfile = () => async dispatch => {
    try {
        const res = await Axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

//Get All Profiles
export const GetAllProfile = () => async dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    })
    try {
        const res = await Axios.get('/api/profile');
        dispatch({
            type: GET_ALL_PROFILE,
            payload: res.data
        })
    } catch (err) {
        // console.log(err.response)
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

//Get Profile By ID
export const GetProfileByID = userID => async dispatch => {
    try {
        const res = await Axios.get(`/api/profile/${userID}`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

//Get Github Repos
export const GetGithubRepos = userName => async dispatch => {
    try {
        const res = await Axios.get(`/api/profile/github/${userName}`);
        dispatch({
            type: GET_REPOS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}



export const createProfile = (body, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const res = await Axios.post("/api/profile", body, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
        dispatch(SetAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))

        if (!edit) {
            history.push('/dashboard')
        }
    } catch (err) {
        const errors = err.response.data.errors;
        console.log(err.response.data)
        if (errors) {
            errors.forEach(error =>
                dispatch(SetAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

//Add Experience
export const addExperience = (body, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const res = await Axios.put("/api/profile/experience", body, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(SetAlert('Experience Added', 'success'))

        history.push('/dashboard')
    } catch (err) {
        const errors = err.response.data.errors;
        console.log(err.response.data)
        if (errors) {
            errors.forEach(error =>
                dispatch(SetAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}


//Add Education
export const addEducation = (body, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const res = await Axios.put("/api/profile/education", body, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(SetAlert('Education Added', 'success'))

        history.push('/dashboard')
    } catch (err) {
        const errors = err.response.data.errors;
        console.log(err.response.data)
        if (errors) {
            errors.forEach(error =>
                dispatch(SetAlert(error.msg, 'danger')))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}


//Delete a Experince Item
export const deleteExperience = id => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const res = await Axios.delete(`/api/profile/experience/${id}`, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(SetAlert('Experince Removed', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

//Delete a Education Item
export const deleteEducation = id => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const res = await Axios.delete(`/api/profile/education/${id}`, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(SetAlert('Education Removed', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

//Delete Account Permanently
export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure ? This can not be undo !')) {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }
            await Axios.delete(`/api/profile`, config);
            dispatch({ type: CLEAR_PROFILE })
            dispatch({ type: DELETE_ACCOUNT })
            dispatch(SetAlert('Your Account has been deleted permanently', 'danger'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
}