import { CLEAR_PROFILE, GET_ALL_PROFILE, GET_PROFILE, GET_REPOS, PROFILE_ERROR, UPDATE_PROFILE } from "../actions/types";

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: null
}

export default function Random(state = initialState, action) {
    switch (action.type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: action.payload,
                loading: false,
                error: null
            }
        case GET_ALL_PROFILE:
            return {
                ...state,
                profiles: action.payload,
                loading: false,
                error: null
            }
        case PROFILE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case GET_REPOS:
            return {
                ...state,
                repos: action.payload,
                laoding: false,
                error: null
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                profiles: [],
                repos: [],
                loading: false,
                error: null
            }
        default:
            return state;
    }
}