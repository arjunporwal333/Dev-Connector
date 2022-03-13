import { ADD_COMMENT, ADD_POST, CLEAR_POST, DELETE_POST, GET_POST, GET_POSTS, POST_ERROR, REMOVE_COMMENT, UPDATE_LIKES } from "../actions/types";

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {}
}
export default function Random(state = initialState, action) {
    switch (action.type) {
        case ADD_POST:
            return {
                ...state,
                posts: [...state.posts, action.payload],
                loading: false,
                error: null
            }
        case GET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false,
                error: null
            }
        case GET_POST:
            return {
                ...state,
                post: action.payload,
                error: null,
                loading: false
            }
        case POST_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            }
        case UPDATE_LIKES:
            return {
                ...state,
                posts: state.posts.map((post) =>
                    post._id === action.payload.id ? { ...post, likes: action.payload.likes } : post
                ),
                error: null,
                loading: false
            }
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== action.payload),
                error: null,
                loading: false
            }
        case ADD_COMMENT:
            return {
                ...state,
                post: { ...state.post, comments: action.payload },
                error: null,
                loading: false
            }
        case REMOVE_COMMENT:
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: state.post.comments.filter(
                        (comment) => comment._id !== action.payload
                    )
                },
                error: null,
                loading: false
            }
        case CLEAR_POST:
            return {
                ...state,
                posts: [],
                post: null,
                loading: false,
                error: {}
            }
        default:
            return state;
    }
}