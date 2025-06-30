import { createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "../admin/adminActions";
import backendURL from "../../../const"
export const registerUser = createAsyncThunk(
  "/api/Auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("Registering user with data:", { username, email, password });
      const response = await fetch(`${backendURL}/api/Auth/register`, {
        method: "POST",
        headers: config.headers,
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Registration failed");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "/api/Auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(`${backendURL}/api/Auth/login`, {
        method: "POST",
        headers: config.headers,
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Login failed");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/api/Auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Logging out user");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const subscribe = createAsyncThunk(
  "order/subscribe",
  async (tier, { rejectWithValue }) => {
    try {
      console.log("Subscribing to order updates with tier:", tier);
      // tier can be Normal , Premium only
      if (tier !== "Normal" && tier !== "Premium") {
        throw new Error("Invalid subscription tier");
      }
      const response = await fetch(`${backendURL}/api/Subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ tier }),
      });
      if (!response.ok) {
        throw new Error("Failed to subscribe to order updates");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/Auth/getUserInfo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
