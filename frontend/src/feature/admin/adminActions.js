import { createAsyncThunk } from "@reduxjs/toolkit";
import backendURL from "../../../const"

export const getToken = () => localStorage.getItem("userToken") || "";

// export const token = localStorage.getItem("userToken") || "";
// Upload Image
export const uploadImage = createAsyncThunk(
    "admin/uploadImage",
    async (imageFile, { rejectWithValue }) => {
        try {
            console.log("Starting image upload for file:", imageFile.name, "Size:", imageFile.size);
            const formData = new FormData();
            formData.append("File", imageFile);

            console.log("FormData created, making request to:", `${backendURL}/api/UploadImage/upload`);
            console.log("Token:", getToken() ? "Present" : "Missing");

            const response = await fetch(`${backendURL}/api/UploadImage/upload`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            console.log("Upload response status:", response.status);
            console.log("Upload response ok:", response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Upload failed with status:", response.status, "Error:", errorText);
                throw new Error(`Failed to upload image: ${response.status} - ${errorText}`);
            }

            const data = await response.text();
            console.log("Upload successful, URL:", data);
            return data;
        } catch (error) {
            console.error("Image upload error:", error);
            return rejectWithValue(error.message);
        }
    }
);

// Fetch Categories
export const fetchCategories = createAsyncThunk(
    "admin/fetchCategories",
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

// Fetch Products
export const fetchProducts = createAsyncThunk(
    "admin/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${backendURL}/api/Products`);

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add Category
export const addCategory = createAsyncThunk(
    "admin/addCategory",
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${backendURL}/api/Products/addcategory`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) {
                throw new Error("Failed to add category");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add Product
export const addProduct = createAsyncThunk(
    "admin/addProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${backendURL}/api/Products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    ...productData,
                    price: parseFloat(productData.price),
                    stockQuantity: parseInt(productData.stockQuantity),
                    categoryId: parseInt(productData.categoryId),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to add product");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update Product
export const updateProduct = createAsyncThunk(
    "admin/updateProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${backendURL}/api/Products/${productData.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                        ...productData,
                        price: parseFloat(productData.price),
                        stockQuantity: parseInt(productData.stockQuantity),
                        categoryId: parseInt(productData.categoryId),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update product");
            }

            // For PUT requests that return 204 No Content, we return the updated data
            return { id: productData.id, ...productData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
    "admin/deleteProduct",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${backendURL}/api/Products/${productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            return productId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
