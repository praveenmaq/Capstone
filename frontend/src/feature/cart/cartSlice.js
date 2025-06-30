import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCart,
  updateCart,
  updateCartQuantity,
  deleteCart,
  deleteProductFromCart,
} from "./cartActions";

const initialState = {
  loading: false,
  error: null,
  cartItems: [],
  totalAmount: 0,
  length: 0,
  success: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.cartItems = [];
      state.totalAmount = 0;
      state.length = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.data || [];
        state.totalAmount = action.payload.cartPrice || 0;
        state.success = true;
        state.length = state.cartItems.length;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Add to Cart
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        // If backend returns updated cart, use it; otherwise refetch cart
        if (action.payload.data) {
          state.cartItems = action.payload.data;
          state.totalAmount = action.payload.cartPrice || 0;
        }
        state.success = true;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update Cart (Update quantity)
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = state.cartItems.map((item) => {
          if (item.productId === action.payload.productId) {
            return {
              ...item,
              quantity: action.payload.quantity,
              total: item.price * action.payload.quantity,
            };
          }
          return item;
        });
        state.success = true;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete Product from Cart
      .addCase(deleteProductFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProductFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const productId = action.payload;
        state.cartItems = state.cartItems.filter(
          (item) => item.productId !== productId
        );
        // Recalculate total after removing item
        state.totalAmount = state.cartItems.reduce(
          (total, item) => total + item.total,
          0
        );
        state.success = true;
      })
      .addCase(deleteProductFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete/Clear Entire Cart
      .addCase(deleteCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCart.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
        state.totalAmount = 0;
        state.length = 0;
        state.success = true;
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetCartState, clearError } = cartSlice.actions;

export default cartSlice.reducer;
