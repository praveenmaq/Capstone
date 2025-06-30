import { createSlice } from "@reduxjs/toolkit";
import {
    uploadImage,
    fetchCategories,
    addCategory,
    addProduct,
    fetchProducts,
    updateProduct,
    deleteProduct,
} from "./adminActions";

const initialState = {
    loading: false,
    error: null,
    success: false,
    categories: [],
    products: [],
    uploadedImageUrl: null,
    uploadingImage: false,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        resetAdminState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        clearUploadedImage: (state) => {
            state.uploadedImageUrl = null;
        },
    },
    extraReducers: (builder) => {
        // Upload Image
        builder
            .addCase(uploadImage.pending, (state) => {
                state.uploadingImage = true;
                state.error = null;
            })
            .addCase(uploadImage.fulfilled, (state, action) => {
                state.uploadingImage = false;
                state.uploadedImageUrl = action.payload;
                console.log("Image upload successful, URL:", action.payload);
            })
            .addCase(uploadImage.rejected, (state, action) => {
                state.uploadingImage = false;
                state.error = action.payload;
                console.error("Image upload failed:", action.payload);
            });

        // Fetch Categories
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch Products
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Add Category
        builder
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.categories.push(action.payload);
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });

        // Add Product
        builder
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.products.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });

        // Update Product
        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.products.findIndex(
                    (p) => p.id === action.payload.id
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete Product
        builder
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.products = state.products.filter((p) => p.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetAdminState, clearUploadedImage } = adminSlice.actions;
export default adminSlice.reducer;
