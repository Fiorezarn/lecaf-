import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menu: null,
    menuById: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchRequestGetAllMenu: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccessGetAllMenu: (state, action) => {
      state.loading = false;
      state.menu = action.payload.data;
    },
    fetchFailureGetAllMenu: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchRequestGetByIdMenu: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccessGetByIdMenu: (state, action) => {
      state.loading = false;
      state.menuById = action.payload.data;
    },
    fetchFailurGetByIdMenu: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchRequestGetAllMenu,
  fetchSuccessGetAllMenu,
  fetchFailureGetAllMenu,
  fetchRequestGetByIdMenu,
  fetchSuccessGetByIdMenu,
  fetchFailurGetByIdMenu,
} = menuSlice.actions;

export default menuSlice.reducer;
