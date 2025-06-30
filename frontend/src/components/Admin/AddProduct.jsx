import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, fetchCategories } from "../../feature/admin/adminActions";
import { resetAdminState, clearUploadedImage } from "../../feature/admin/adminSlice";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const AddProduct = () => {
    const dispatch = useDispatch();
    const { loading, success, categories, uploadedImageUrl } = useSelector(
        (state) => state.admin
    );

    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        categoryId: "",
        brand: "",
        stockQuantity: "",
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (uploadedImageUrl) {
            console.log("Setting imageUrl in form:", uploadedImageUrl);
            setProductForm((prev) => ({ ...prev, imageUrl: uploadedImageUrl }));
        }
    }, [uploadedImageUrl]);

    useEffect(() => {
        if (success) {
            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
            notification.innerHTML = `
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Product added successfully!
      `;
            document.body.appendChild(notification);

            setTimeout(() => {
                document.body.removeChild(notification);
            }, 3000);

            setProductForm({
                name: "",
                description: "",
                price: "",
                imageUrl: "",
                categoryId: "",
                brand: "",
                stockQuantity: "",
            });
            setFormErrors({});
            dispatch(clearUploadedImage());
            dispatch(resetAdminState());
        }
    }, [success, dispatch]);

    const validateForm = () => {
        const errors = {};

        if (!productForm.name.trim()) errors.name = "Product name is required";
        if (!productForm.brand.trim()) errors.brand = "Brand is required";
        if (!productForm.price || productForm.price <= 0) errors.price = "Valid price is required";
        if (!productForm.stockQuantity || productForm.stockQuantity < 0) errors.stockQuantity = "Valid stock quantity is required";
        if (!productForm.categoryId) errors.categoryId = "Category is required";
        if (!productForm.description.trim()) errors.description = "Description is required";
        if (!productForm.imageUrl || !productForm.imageUrl.trim()) {
            console.log("Image validation failed. Current imageUrl:", productForm.imageUrl);
            console.log("uploadedImageUrl from Redux:", uploadedImageUrl);
            errors.imageUrl = "Image is required";
        }

        console.log("Form validation errors:", errors);
        console.log("Current form state:", productForm);

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            dispatch(addProduct(productForm));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    }; return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
                <p className="text-gray-600 mt-2">Fill in the details below to add a new product to your inventory</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={productForm.name}
                            onChange={handleInputChange}
                            className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${formErrors.name
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                }`}
                            placeholder="Enter product name"
                        />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Brand *
                        </label>
                        <input
                            type="text"
                            name="brand"
                            value={productForm.brand}
                            onChange={handleInputChange}
                            className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${formErrors.brand
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                }`}
                            placeholder="Enter brand name"
                        />
                        {formErrors.brand && <p className="text-red-500 text-sm mt-1">{formErrors.brand}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Price (₹) *
                        </label>
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            min="0"
                            value={productForm.price}
                            onChange={handleInputChange}
                            className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${formErrors.price
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                }`}
                            placeholder="0.00"
                        />
                        {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Stock Quantity *
                        </label>
                        <input
                            type="number"
                            name="stockQuantity"
                            min="0"
                            value={productForm.stockQuantity}
                            onChange={handleInputChange}
                            className={`w-full border-2 rounded-xl px-6 py-4 text-lg focus:outline-none transition-all duration-300 ${formErrors.stockQuantity
                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-blue-300'
                                }`}
                            placeholder="Enter stock quantity"
                        />
                        {formErrors.stockQuantity && (
                            <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                                <span>⚠</span>
                                <p>{formErrors.stockQuantity}</p>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            Category *
                        </label>
                        <select
                            name="categoryId"
                            value={productForm.categoryId}
                            onChange={handleInputChange}
                            className={`w-full border-2 rounded-xl px-6 py-4 text-lg focus:outline-none transition-all duration-300 ${formErrors.categoryId
                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-blue-300'
                                }`}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                        {formErrors.categoryId && (
                            <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                                <span>⚠</span>
                                <p>{formErrors.categoryId}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={productForm.description}
                        onChange={handleInputChange}
                        rows="5"
                        className={`w-full border-2 rounded-xl px-6 py-4 text-lg focus:outline-none transition-all duration-300 resize-none ${formErrors.description
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-blue-300'
                            }`}
                        placeholder="Enter a detailed product description..."
                    />
                    {formErrors.description && (
                        <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                            <span>⚠</span>
                            <p>{formErrors.description}</p>
                        </div>
                    )}
                </div>

                {/* Image Preview */}
                {uploadedImageUrl && (
                    <div className="border-2 border-dashed border-green-300 rounded-2xl p-6 bg-gradient-to-br from-green-50 to-emerald-100">
                        <div className="flex items-center space-x-6">
                            <div className="p-3 bg-green-500 rounded-xl">
                                <CheckCircleIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <p className="text-green-800 font-bold text-lg">Image uploaded successfully!</p>
                                <p className="text-green-600 text-sm">Product image is ready to use</p>
                            </div>
                            <img
                                src={uploadedImageUrl}
                                alt="Product preview"
                                className="h-24 w-24 object-cover rounded-xl border-2 border-green-200 shadow-lg"
                            />
                        </div>
                    </div>
                )}

                {formErrors.imageUrl && (
                    <div className="border-2 border-dashed border-red-300 rounded-2xl p-6 bg-gradient-to-br from-red-50 to-rose-100">
                        <div className="flex items-center gap-3">
                            <span className="text-red-500 text-xl">⚠</span>
                            <p className="text-red-700 font-semibold text-lg">{formErrors.imageUrl}</p>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-8 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent mr-3"></div>
                            Adding Product...
                        </>
                    ) : (
                        <>
                            <CheckCircleIcon className="h-6 w-6 mr-3" />
                            Add Product
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
