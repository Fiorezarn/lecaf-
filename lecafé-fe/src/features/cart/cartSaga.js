import { put, takeLatest } from "redux-saga/effects";
import { fetchAddCart, fetchDeleteCart, fetchGetCartByUserId } from "./cartApi";
import {
  addCartSuccess,
  addCartFailure,
  getCartByUserIdSuccess,
  getCartByUserIdFailure,
  setMessage,
} from "./cartSlice";

function* addCart(action) {
  try {
    const responseAdd = yield fetchAddCart(action.payload);
    const responseFetch = yield fetchGetCartByUserId(action.payload.userId);
    yield put(
      addCartSuccess({ data: responseFetch.data, message: responseAdd.message })
    );
  } catch (error) {
    yield put(addCartFailure(error.message));
  }
}

function* getCartByUserId(action) {
  try {
    const response = yield fetchGetCartByUserId(action.payload);
    yield put(getCartByUserIdSuccess(response));
  } catch (error) {
    yield put(getCartByUserIdFailure(error.message));
  }
}

function* deleteCart(action) {
  try {
    yield fetchDeleteCart(action.payload);
    const response = yield fetchGetCartByUserId(action.payload.userId);
    yield put(getCartByUserIdSuccess(response));
  } catch (error) {
    yield put(getCartByUserIdFailure(error.message));
  }
}

export default function* cartSaga() {
  yield takeLatest("cart/addCart", addCart);
  yield takeLatest("cart/getCartByUserId", getCartByUserId);
  yield takeLatest("cart/deleteCart", deleteCart);
  yield takeLatest("cart/setMessage", setMessage);
}
