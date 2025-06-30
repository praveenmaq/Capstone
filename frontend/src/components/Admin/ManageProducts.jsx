import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProducts,
    deleteProduct,
    updateProduct,
} from "../../feature/admin/adminActions";
import EditProductModal from "./EditProductModal";
import {
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    FunnelIcon
} from "@heroicons/react/24/outline";

const ManageProducts = () => {
    const dispatch = useDispatch();
    const { loading, products, categories } = useSelector((state) => state.admin);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = async (productId, productName) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            dispatch(deleteProduct(productId));
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
    };

    const handleUpdateProduct = (updatedProduct) => {
        dispatch(updateProduct(updatedProduct));
        setEditingProduct(null);
    };

    // Filter and sort products
    const filteredAndSortedProducts = products
        .filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "" || product.categoryId === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'price' || sortBy === 'stockQuantity') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else {
                aValue = String(aValue).toLowerCase();
                bValue = String(bValue).toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
        if (quantity < 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
        return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
    };

    if (loading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="flex justify-center items-center py-20">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
                <p className="text-gray-600 mt-2">View, edit, and manage your product inventory</p>
            </div>

            {/* Filters and Search */}
            <div className="mb-8 space-y-6 lg:space-y-0 lg:flex lg:items-center lg:justify-between bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* Search */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products by name or brand..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 w-full sm:w-96 text-lg"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <FunnelIcon className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="pl-12 pr-10 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 appearance-none bg-white text-lg"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Sort Options */}
                <div className="flex gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-6 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-medium bg-white"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="price">Sort by Price</option>
                        <option value="stockQuantity">Sort by Stock</option>
                        <option value="brand">Sort by Brand</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium"
                    >
                        {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                    </button>
                </div>
            </div>

            {/* Results Summary */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <p className="text-lg font-semibold text-gray-700">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
                </p>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                        <tr>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Product
                            </th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Stock Status
                            </th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {paginatedProducts.map((product) => {
                            const stockStatus = getStockStatus(product.stockQuantity);
                            return (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                className="h-16 w-16 rounded-lg object-cover shadow-sm border border-gray-200"
                                                src={product.imageUrl}
                                                alt={product.name}
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {product.name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {product.brand}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                                    {product.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                                                {stockStatus.text}
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1">
                                                {product.stockQuantity} units
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="inline-flex items-center px-3 py-2 text-xs font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                                title="Edit Product"
                                            >
                                                <PencilIcon className="h-4 w-4 mr-1" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="inline-flex items-center px-3 py-2 text-xs font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                                title="Delete Product"
                                            >
                                                <TrashIcon className="h-4 w-4 mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredAndSortedProducts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            {searchTerm || selectedCategory ? "No products found matching your criteria." : "No products available."}
                        </div>
                        {(searchTerm || selectedCategory) && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("");
                                }}
                                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={handleUpdateProduct}
                />
            )}
        </div>
    );
};

export default ManageProducts;
