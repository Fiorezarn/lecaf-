import { put, takeLatest } from "redux-saga/effects";
import {
  fetchFailureGetAllMenu,
  fetchRequestGetAllMenu,
  fetchSuccessGetAllMenu,
  fetchRequestGetByIdMenu,
  fetchSuccessGetByIdMenu,
  fetchFailurGetByIdMenu,
} from "@/features/menu/menuSlice";
import { fetchAllMenu, fetchMenuById } from "./menuApi";

function* getAllMenu() {
  try {
    const response = yield fetchAllMenu();
    yield put(fetchSuccessGetAllMenu(response));
  } catch (error) {
    yield put(fetchFailureGetAllMenu(error.message));
  }
}

function* getMenuById(action) {
  try {
    const response = yield fetchMenuById(action.payload);
    yield put(fetchSuccessGetByIdMenu(response));
  } catch (error) {
    yield put(fetchFailurGetByIdMenu(error.message));
  }
}

export default function* menuSaga() {
  yield takeLatest("menu/getAllMenu", getAllMenu);
  yield takeLatest("menu/getMenuById", getMenuById);
}
