import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadImage,
  fetchCategories,
  addCategory,
  addProduct,
} from "../../feature/admin/adminActions";
import {
  resetAdminState,
  clearUploadedImage,
} from "../../feature/admin/adminSlice";

function AdminHome() {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    success,
    categories,
    uploadedImageUrl,
    uploadingImage,
  } = useSelector((state) => state.admin);
  console.log(uploadedImageUrl);
  const [activeTab, setActiveTab] = useState("addProduct");
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    brand: "",
    stockQuantity: "",
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    categoryName: "",
    imageUrl: "",
  });

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Update form when image is uploaded
  useEffect(() => {
    if (uploadedImageUrl) {
      if (activeTab === "addProduct") {
        setProductForm((prev) => ({ ...prev, imageUrl: uploadedImageUrl }));
      } else {
        setCategoryForm((prev) => ({ ...prev, imageUrl: uploadedImageUrl }));
      }
    }
  }, [uploadedImageUrl, activeTab]);

  // Reset success state and show message
  useEffect(() => {
    if (success) {
      alert(
        activeTab === "addProduct"
          ? "Product added successfully!"
          : "Category added successfully!"
      );

      // Reset forms
      if (activeTab === "addProduct") {
        setProductForm({
          name: "",
          description: "",
          price: "",
          imageUrl: "",
          categoryId: "",
          brand: "",
          stockQuantity: "",
        });
      } else {
        setCategoryForm({
          categoryName: "",
          imageUrl: "",
        });
      }

      setSelectedImageFile(null);
      dispatch(clearUploadedImage());
      dispatch(resetAdminState());
    }
  }, [success, activeTab, dispatch]);

  // Handle image upload
  const handleImageUpload = () => {
    if (selectedImageFile) {
      dispatch(uploadImage(selectedImageFile));
    }
  };

  // Handle product form submission
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.imageUrl) {
      alert("Please upload an image first!");
      return;
    }
    dispatch(addProduct(productForm));
  };

  // Handle category form submission
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!categoryForm.imageUrl) {
      alert("Please upload an image first!");
      return;
    }
    dispatch(addCategory(categoryForm));
  };

  // Handle input changes
  const handleProductInputChange = (e) => {
    setProductForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryInputChange = (e) => {
    setCategoryForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-6">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center">
              <div className="text-red-500 mr-2">⚠</div>
              {error}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => {
              setActiveTab("addProduct");
              dispatch(clearUploadedImage());
              setSelectedImageFile(null);
            }}
            className={`px-8 py-4 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "addProduct"
                ? "bg-primary-600 text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md"
            }`}
          >
            Add Product
          </button>
          <button
            onClick={() => {
              setActiveTab("addCategory");
              dispatch(clearUploadedImage());
              setSelectedImageFile(null);
            }}
            className={`px-8 py-4 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "addCategory"
                ? "bg-primary-600 text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md"
            }`}
          >
            Add Category
          </button>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Upload Image</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImageFile(e.target.files[0])}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
              />
            </div>
            <button
              onClick={handleImageUpload}
              disabled={!selectedImageFile || uploadingImage}
              className="px-8 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md"
            >
              {uploadingImage ? "Uploading..." : "Upload Image"}
            </button>
          </div>

          {uploadedImageUrl && (
            <div className="mt-6">
              <p className="text-sm text-success-600 mb-3 font-medium">
                Image uploaded successfully!
              </p>
              <img
                src={uploadedImageUrl}
                alt="Uploaded preview"
                className="w-40 h-40 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Add Product Tab */}
        {activeTab === "addProduct" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Add New Product</h2>

            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={productForm.name}
                    onChange={handleProductInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    required
                    value={productForm.brand}
                    onChange={handleProductInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                    placeholder="Enter brand name"
                  />
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
                    required
                    value={productForm.price}
                    onChange={handleProductInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    min="0"
                    required
                    value={productForm.stockQuantity}
                    onChange={handleProductInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                    placeholder="Enter stock quantity"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    required
                    value={productForm.categoryId}
                    onChange={handleProductInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={productForm.description}
                  onChange={handleProductInputChange}
                  rows="4"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                  placeholder="Enter product description"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !uploadedImageUrl}
                className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </form>
          </div>
        )}

        {/* Add Category Tab */}
        {activeTab === "addCategory" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Add New Category</h2>

            <form onSubmit={handleCategorySubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="categoryName"
                  required
                  value={categoryForm.categoryName}
                  onChange={handleCategoryInputChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                  placeholder="Enter category name"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !uploadedImageUrl}
                className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? "Adding Category..." : "Add Category"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHome;
