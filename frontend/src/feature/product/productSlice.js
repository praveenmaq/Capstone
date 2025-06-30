import { createSlice } from "@reduxjs/toolkit";
import {
    fetchFeaturedProducts,
    fetchProductByCategory,
    fetchProductById,
    fetchProducts,
    fetchTrendingProducts,
    getCategories,
    getWishlist,
    setSearchQuery,
    fetchReviews,
    addReview,
    removeFromWishlist
} from "./productActions";

const initialState = {
    loading: false,
    error: null,
    products: [],
    categories: [],
    wishlist: [],
    featured: [],
    trending: [],
    reviews: [],
    searchInput: "",
    success: false,
};

const productSlice = createSlice({
    initialState,
    name: "product",
    reducers: {
        resetProductState: (state) => {
            state.loading = false;
            state.error = null;
            state.products = [];
            state.categories = [];
            state.success = false;
        },
    },
    // builder function jismei addcase kiya hai : pending, fulfilled and rejected
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
                state.success = true;
                state.error = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductByCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProductByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(setSearchQuery.fulfilled, (state, action) => {
                state.searchInput = action.payload;
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.wishlist = action.payload;
            })
            .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
                state.trending = action.payload;
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.featured = action.payload;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.reviews = action.payload;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.reviews.unshift(action.payload);
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.wishlist = state.wishlist.filter(
                    (item) => item.id !== action.payload
                );
            });
    },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
