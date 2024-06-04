import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staff: {},
  user: {},
  access_token: "",
  refresh_token: "",
  isAdmin: false,
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { staff, user, access_token, refresh_token } = action.payload;
      state.staff = staff;
      state.user = user;
      state.isAdmin = true;
      state.access_token = access_token;
      state.refresh_token = refresh_token;
    },
    resetUser: (state) => {
      state.staff = {};
      state.user = {};
      state.isAdmin = false;
      state.access_token = "";
      state.refresh_token = "";
    },
  },
});

export const { updateUser, resetUser } = userReducer.actions;

export default userReducer.reducer;
