import authSaga from "@/features/auth/authSaga";
import menuSaga from "@/features/menu/menuSaga";
import menuReducer from "@/features/menu/menuSlice";
import authReducer from "@/features/auth/authSlice";
import cartReducer from "@/features/cart/cartSlice";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import cartSaga from "@/features/cart/cartSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

[menuSaga, authSaga, cartSaga].map((saga) => {
  sagaMiddleware.run(saga);
});
