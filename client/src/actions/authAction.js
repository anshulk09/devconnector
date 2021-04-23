import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {GET_ERRORS, SET_CURRENT_USER} from './types';

//Register user
export const registerUser = (userData, history) => (dispatch) => {
    axios.post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            }))
}

//login and get user token
export const loginUser = (userData) => (dispatch) => {
    axios.post('/api/users/login', userData)
        .then(res => {
            //save token to local store
            const token = res.data.token;
            //set token to local Storage
            localStorage.setItem('jwtToken', token);
            // set token to auth header
            setAuthToken(token);
            //decode token
            const decoded = jwt_decode(token);
            //set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
    )
}

//set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: (decoded ? decoded : {})
    }
}

//logout user
export const logoutUser = () => dispatch => {
    //remove item from local storage
    localStorage.removeItem('jwtToken');
    //remove auth header for future request
    setAuthToken(false);
    //set current user to an empty object and isauthenticated to false
    dispatch(setCurrentUser());
}