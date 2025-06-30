import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../feature/admin/adminActions";
import { resetAdminState, clearUploadedImage } from "../../feature/admin/adminSlice";
import { CheckCircleIcon, TagIcon } from "@heroicons/react/24/outline";

function AddCategory() {
    const dispatch = useDispatch();
    const { loading, success, uploadedImageUrl } = useSelector(
        (state) => state.admin
    );

    const [categoryForm, setCategoryForm] = useState({
        categoryName: "",
        imageUrl: "",
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (uploadedImageUrl) {
            setCategoryForm((prev) => ({ ...prev, imageUrl: uploadedImageUrl }));
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
        Category added successfully!
      `;
            document.body.appendChild(notification);

            setTimeout(() => {
                document.body.removeChild(notification);
            }, 3000);

            setCategoryForm({
                categoryName: "",
                imageUrl: "",
            });
            setFormErrors({});
            dispatch(clearUploadedImage());
            dispatch(resetAdminState());
        }
    }, [success, dispatch]);

    const validateForm = () => {
        const errors = {};

        if (!categoryForm.categoryName.trim()) errors.categoryName = "Category name is required";
        if (!categoryForm.imageUrl) errors.imageUrl = "Image is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            dispatch(addCategory(categoryForm));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    }; return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Category</h2>
                <p className="text-gray-600 mt-2">Create a new product category for better organization</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category Name *
                    </label>
                    <input
                        type="text"
                        name="categoryName"
                        value={categoryForm.categoryName}
                        onChange={handleInputChange}
                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none transition-all duration-200 ${formErrors.categoryName
                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                            }`}
                        placeholder="Enter category name (e.g., Electronics, Clothing, etc.)"
                    />
                    {formErrors.categoryName && (
                        <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                            <span>⚠</span>
                            <p>{formErrors.categoryName}</p>
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
                                <p className="text-green-600 text-sm">Category image is ready to use</p>
                            </div>
                            <img
                                src={uploadedImageUrl}
                                alt="Category preview"
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
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-6 px-8 rounded-2xl hover:from-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent mr-3"></div>
                            Adding Category...
                        </>
                    ) : (
                        <>
                            <TagIcon className="h-6 w-6 mr-3" />
                            Add Category
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default AddCategory;
