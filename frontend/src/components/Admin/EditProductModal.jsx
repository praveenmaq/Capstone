import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

function EditProductModal({ product, onClose, onUpdate }) {
    const { categories, uploadedImageUrl, loading } = useSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
        brand: product.brand,
        stockQuantity: product.stockQuantity,
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (uploadedImageUrl) {
            setFormData((prev) => ({ ...prev, imageUrl: uploadedImageUrl }));
        }
    }, [uploadedImageUrl]);

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) errors.name = "Product name is required";
        if (!formData.brand.trim()) errors.brand = "Brand is required";
        if (!formData.price || formData.price <= 0) errors.price = "Valid price is required";
        if (!formData.stockQuantity || formData.stockQuantity < 0) errors.stockQuantity = "Valid stock quantity is required";
        if (!formData.categoryId) errors.categoryId = "Category is required";
        if (!formData.description.trim()) errors.description = "Description is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onUpdate(formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Edit Product</h3>
                        <p className="text-gray-600 mt-1">Update product information</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${formErrors.name
                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                    }`}
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
                                value={formData.brand}
                                onChange={handleChange}
                                className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${formErrors.brand
                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                    }`}
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
                                value={formData.price}
                                onChange={handleChange}
                                className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${formErrors.price
                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                    }`}
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
                                value={formData.stockQuantity}
                                onChange={handleChange}
                                className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${formErrors.stockQuantity
                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                    }`}
                            />
                            {formErrors.stockQuantity && <p className="text-red-500 text-sm mt-1">{formErrors.stockQuantity}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${formErrors.categoryId
                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                    }`}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                            {formErrors.categoryId && <p className="text-red-500 text-sm mt-1">{formErrors.categoryId}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${formErrors.description
                                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                }`}
                            placeholder="Enter product description"
                        />
                        {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                    </div>

                    {/* Current Image Preview */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Current Image
                        </label>
                        <div className="flex items-center space-x-4">
                            <img
                                src={formData.imageUrl}
                                alt="Current product"
                                className="h-20 w-20 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <div className="text-sm text-gray-600">
                                <p>Current product image</p>
                                <p className="text-xs text-gray-500">Upload a new image above to replace this</p>
                            </div>
                        </div>
                    </div>

                    {/* New Image Preview */}
                    {uploadedImageUrl && uploadedImageUrl !== formData.imageUrl && (
                        <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
                            <div className="flex items-center space-x-4">
                                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                                <div>
                                    <p className="text-green-800 font-medium">New image uploaded successfully!</p>
                                    <img
                                        src={uploadedImageUrl}
                                        alt="New product preview"
                                        className="mt-2 h-20 w-20 object-cover rounded-lg border-2 border-green-200"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Updating...
                                </>
                            ) : (
                                "Update Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProductModal;
