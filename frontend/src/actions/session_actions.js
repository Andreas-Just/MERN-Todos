import * as APIUtil from "../util/session_api_util";

import jwt_decode from "jwt-decode";

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";
export const RECEIVE_USER_LOGOUT = "RECEIVE_USER_LOGOUT";

const DEMO_USER = {
  username: "demoUser",
  password: "password",
};

export const receiveCurrentUser = currentUser => ({
  type: RECEIVE_CURRENT_USER,
  currentUser,
});

export const receiveErrors = errors => ({
  type: RECEIVE_SESSION_ERRORS,
  errors,
});

export const logoutUser = () => ({
  type: RECEIVE_USER_LOGOUT,
});

export const signup = user => dispatch =>
  APIUtil.signup(user).then(
    res => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      APIUtil.setAuthToken(token);
      dispatch(receiveCurrentUser(jwt_decode(token)));
    },
    err => {
      dispatch(receiveErrors(err.response.data));
      throw err;
    },
  );

export const signin = user => dispatch =>
  APIUtil.signin(user).then(
    res => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      APIUtil.setAuthToken(token);
      dispatch(receiveCurrentUser(jwt_decode(token)));
    },
    err => {
      dispatch(receiveErrors(err.response.data));
      throw err;
    },
  );

export const logout = () => dispatch => {
  localStorage.removeItem("jwtToken");
  APIUtil.setAuthToken(null);
  dispatch(logoutUser());
};

export const demoLogin = () => signin(DEMO_USER);
