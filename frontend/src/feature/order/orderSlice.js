import { createSlice } from "@reduxjs/toolkit";
import { fetchOrders, ProceedToCheckout } from "./orderActions";

const initialState = {
  loading: false,
  error: null,
  orders: [],
  orderDetails: null,
  success: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.orders = [];
      state.orderDetails = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Proceed to Checkout
      .addCase(ProceedToCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(ProceedToCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
        state.success = true;
      })
      .addCase(ProceedToCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState, clearError } = orderSlice.actions;
export default orderSlice.reducer;

