import authSaga from "@/features/auth/authSaga";
import menuSaga from "@/features/menu/menuSaga";
import menuReducer from "@/features/menu/menuSlice";
import authReducer from "@/features/auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

[menuSaga, authSaga].map((saga) => {
  sagaMiddleware.run(saga);
});
