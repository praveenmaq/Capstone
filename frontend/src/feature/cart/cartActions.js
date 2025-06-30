import { createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "../admin/adminActions";

const backendURL = "http://localhost:5252";

export const fetchCart = createAsyncThunk(
  "/fetchcart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/Cart`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCart = createAsyncThunk(
  "/addtocart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/Cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update cart");
      }
      const data = response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Cart Item Quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${backendURL}/api/Cart/${productId}/?quantity=${quantity}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update cart");
      }
      return {
        productId,
        quantity,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Entire Cart
export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/Cart`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Product from Cart
export const deleteProductFromCart = createAsyncThunk(
  "cart/deleteProductFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/Cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to remove product from cart");
      }
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
