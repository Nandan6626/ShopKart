import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { userAPI } from '../api/userAPI';

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Action types
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const LOGOUT = 'LOGOUT';
const REGISTER_REQUEST = 'REGISTER_REQUEST';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const REGISTER_FAIL = 'REGISTER_FAIL';
const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
const UPDATE_PROFILE_FAIL = 'UPDATE_PROFILE_FAIL';
const CLEAR_ERRORS = 'CLEAR_ERRORS';

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case UPDATE_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Login action
  const login = async (email, password) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const response = await userAPI.login(email, password);
      // Extract user data from response
      const userData = response.user || response;
      localStorage.setItem('userInfo', JSON.stringify(userData));
      dispatch({ type: LOGIN_SUCCESS, payload: userData });
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Register action
  const register = async (name, email, password, role = 'user') => {
    try {
      dispatch({ type: REGISTER_REQUEST });
      const response = await userAPI.register(name, email, password, role);
      // Extract user data from response
      const userData = response.user || response;
      localStorage.setItem('userInfo', JSON.stringify(userData));
      dispatch({ type: REGISTER_SUCCESS, payload: userData });
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Update profile action
  const updateProfile = async (userData) => {
    try {
      dispatch({ type: UPDATE_PROFILE_REQUEST });
      const data = await userAPI.updateProfile(userData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: UPDATE_PROFILE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('userInfo');
    dispatch({ type: LOGOUT });
  };

  // Clear errors action
  const clearErrors = useCallback(() => {
    dispatch({ type: CLEAR_ERRORS });
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      dispatch({ type: LOGIN_SUCCESS, payload: JSON.parse(userInfo) });
    }
  }, []);

  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    updateProfile,
    logout,
    clearErrors,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};