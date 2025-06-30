import { createSlice } from "@reduxjs/toolkit";
import {
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
  subscribe,
} from "./authActions";

const initialState = {
  loading: false,
  error: null,
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
  success: false,
  userToken: localStorage.getItem("userToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.userToken = null;
      state.success = false;
      state.error = null;
      localStorage.removeItem("userToken"); // remove token
      localStorage.removeItem("userInfo"); // remove user info
    },
  },
  extraReducers: (builder) => {
    // register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.userDetail;
        state.userToken = action.payload.userToken;
        state.success = true;
        state.error = null;
        localStorage.setItem("userToken", action.payload.userToken); // save token
        localStorage.setItem(
          "userInfo",
          JSON.stringify(action.payload.userDetail)
        ); // save user info
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.userDetail;
        state.userToken = action.payload.userToken;
        state.success = true;
        state.error = null;
        localStorage.setItem("userToken", action.payload.userToken); // save token
        localStorage.setItem(
          "userInfo",
          JSON.stringify(action.payload.userDetail)
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userInfo = null;
        state.userToken = null;
        state.success = false;
        state.error = null;
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
      })
      .addCase(subscribe.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(subscribe.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = {
          ...state.userInfo,
          role: action.payload.tier,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          isActive: action.payload.isActive,
        };
        state.success = true;
        state.error = null;
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ ...state.userInfo, tier: action.payload.tier })
        );
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
