import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    cookie: null,
    loading: false,
    isAutenticated: false,
    error: null,
  },
  reducers: {
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAutenticated = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getCookieRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCookieSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.cookie = action.payload;
    },
    getCookieFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  getCookieRequest,
  getCookieSuccess,
  getCookieFailure,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;
