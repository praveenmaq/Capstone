import { createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { getToken } from "../admin/adminActions";

const backendURL = "http://localhost:5252";
export const ProceedToCheckout = createAsyncThunk(
  // POST request to /api/Order to place a new order
  // payMethod: Payment method (passed as a number), address: Delivery address for the order.
  "order/ProceedToCheckout",
  async ({ payMethod, address }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/Order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          paymethod: Number(payMethod),
          address: address,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to proceed to checkout");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// If response is not ok, throws an error.
// If there’s a network or server error, rejectWithValue(error.message) is used to send it to Redux’s .rejected action state.

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/Order`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
