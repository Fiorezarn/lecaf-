import { put, takeLatest } from "redux-saga/effects";
import {
  registerSuccess,
  registerFailure,
  loginSuccess,
  loginFailure,
  getCookieSuccess,
  getCookieFailure,
} from "./authSlice";
import { fetchlogin, fetchRegister } from "./authApi";
import Cookies from "js-cookie";

function* register(action) {
  try {
    const response = yield fetchRegister(action.payload);
    yield put(registerSuccess(response));
  } catch (error) {
    yield put(registerFailure(error.message));
  }
}

function* login(action) {
  try {
    const response = yield fetchlogin(action.payload);
    yield put(loginSuccess(response));
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

function* getCookie() {
  try {
    const cookie = yield Cookies.get("user");
    const userData = JSON.parse(cookie);
    console.log(userData);

    yield put(getCookieSuccess(userData));
  } catch (error) {
    yield put(getCookieFailure(error.message));
  }
}

export default function* authSaga() {
  yield takeLatest("auth/registerRequest", register);
  yield takeLatest("auth/loginReguest", login);
  yield takeLatest("auth/getCookie", getCookie);
}
