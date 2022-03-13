import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from "./types";
import Axios from "axios";
import { SetAlert } from "./alert";

// GET ALL POSTS
export const GetPosts = () => async dispatch => {
    try {
        const res = await Axios.get("/api/posts");
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// GET A SINGLE POST
export const GetSinglePost = id => async dispatch => {
    try {
        const res = await Axios.get(`/api/posts/${id}`);
        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// ADD LIKE
export const addLike = id => async dispatch => {
    try {
        const res = await Axios.put(`/api/posts/like/${id}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data.likes }
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// REMOVE LIKE
export const removeLike = id => async dispatch => {
    try {
        const res = await Axios.put(`/api/posts/unlike/${id}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data.likes }
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// DELETE POST
export const deletePost = id => async dispatch => {
    try {
        await Axios.delete(`/api/posts/${id}`);
        dispatch({
            type: DELETE_POST,
            payload: id
        })
        dispatch(SetAlert('Post Removed', 'danger'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// ADD POST
export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await Axios.post(`/api/posts`, formData, config);
        dispatch({
            type: ADD_POST,
            payload: res.data
        })
        dispatch(SetAlert('Post Created', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// ADD COMMENT
export const addComment = (formData, postId) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await Axios.post(`/api/posts/comments/${postId}`, formData, config);
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })
        dispatch(SetAlert('Comment Published', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// DELETE COMMENT
export const deleteComment = (postId, commentId) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        await Axios.delete(`/api/posts/comments/${postId}/${commentId}`, config);
        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })
        dispatch(SetAlert('Comment Deleted', 'danger'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}