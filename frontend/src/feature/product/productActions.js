import { createAsyncThunk } from "@reduxjs/toolkit";
import Category from "../../components/Category";
import { getToken } from "../admin/adminActions";

const backendURL = "http://localhost:5252";

export const fetchProducts = createAsyncThunk(
  "/product/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { query, filters, sort } = params;

      // Build query parameters object
      const queryParams = new URLSearchParams();

      // Add search query if provided and not empty
      if (query && query.trim()) {
        queryParams.append("query", query.trim());
      }

      // Add filters if provided
      if (filters) {
        const { categoryId, minPrice, maxPrice } = filters;

        if (categoryId && categoryId != -1) {
          queryParams.append("categoryId", categoryId);
        }

        if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
          queryParams.append("minPrice", minPrice);
        }

        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
          queryParams.append("maxPrice", maxPrice);
        }
      }

      // Add sort if provided
      if (sort !== undefined && sort !== null && sort !== "") {
        queryParams.append("sort", sort);
      }

      // Build final URL
      const searchUrl = `${backendURL}/api/Products/${queryParams.toString() ? "?" + queryParams.toString() : ""
        }`;

      console.log("Fetching products from:", searchUrl);

      const response = await fetch(searchUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch products: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const getCategories = createAsyncThunk(
  "/product/categories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/Products/categories`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// automatically generates action types for pending, fulfilled, and rejected states
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/Products/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductByCategory = createAsyncThunk(
  "product/fetchProductByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${backendURL}/api/Products/category/${category}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products by category");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "product/fetchFeaturedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/Products/featured`);
      if (!response.ok) {
        throw new Error("Failed to fetch featured products");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTrendingProducts = createAsyncThunk(
  "product/fetchTrendingProducts",
  async (_, { rejectWithValue }) => {
    try {
      if (!getToken()) {
        return [];
      }
      const response = await fetch(`${backendURL}/api/Products/trending`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch trending products");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setSearchQuery = createAsyncThunk(
  "product/setSearchQuery",
  async (query, { rejectWithValue }) => {
    try {
      if (typeof query !== "string") {
        throw new Error("Search query must be a string");
      }
      return query.trim();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "product/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${backendURL}/api/Products/addToWishlist/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add product to wishlist");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getWishlist = createAsyncThunk(
  "product/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/Products/wishlist`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchReviews = createAsyncThunk(
  "product/fetchReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/api/Products/${productId}/reviews`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addReview = createAsyncThunk(
  "product/addReview",
  async ({ productId, rating, comment }, { rejectWithValue, getState }) => {
    try {
      const { userToken } = getState().auth;
      const response = await fetch(`${backendURL}/api/Products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      if (!response.ok) throw new Error("Failed to add review");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const removeFromWishlist = createAsyncThunk(
  "product/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${backendURL}/api/Products/removeFromWishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove product from wishlist");
      }
      // Optionally, return productId so you can update the state in the reducer
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);