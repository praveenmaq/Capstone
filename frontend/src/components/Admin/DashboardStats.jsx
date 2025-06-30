import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategories } from "../../feature/admin/adminActions";
import {
    CubeIcon,
    TagIcon,
    CurrencyRupeeIcon,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ChartBarIcon,
    ShoppingBagIcon
} from "@heroicons/react/24/outline";

const DashboardStats = () => {
    const dispatch = useDispatch();
    const { products, categories, loading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const totalProducts = products.length;
    const totalCategories = categories.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stockQuantity), 0);
    const lowStockProducts = products.filter(product => product.stockQuantity < 10).length;
    const outOfStockProducts = products.filter(product => product.stockQuantity === 0).length;

    const stats = [
        {
            name: "Total Products",
            value: totalProducts,
            icon: CubeIcon,
            bgColor: "bg-blue-50",
            textColor: "text-blue-600"
        },
        {
            name: "Categories",
            value: totalCategories,
            icon: TagIcon,
            bgColor: "bg-green-50",
            textColor: "text-green-600"
        },
        {
            name: "Inventory Value",
            value: `₹${totalValue.toLocaleString('en-IN')}`,
            icon: CurrencyRupeeIcon,
            bgColor: "bg-purple-50",
            textColor: "text-purple-600"
        },
        {
            name: "Low Stock Alert",
            value: lowStockProducts,
            icon: ExclamationTriangleIcon,
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-600"
        }
    ];

    const recentProducts = products.slice(0, 5);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-white rounded-lg shadow border p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Dashboard Overview
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Welcome back! Here's what's happening with your store today.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <ChartBarIcon className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white rounded-lg shadow border p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts and Tables Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent Products */}
                <div className="bg-white rounded-lg shadow border p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {recentProducts.map((product, index) => (
                            <div key={product.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="relative">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                    <div className="absolute -top-1 -left-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.brand}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">₹{product.price.toLocaleString('en-IN')}</p>
                                    <p className={`text-xs px-2 py-1 rounded-full ${product.stockQuantity > 10
                                            ? 'bg-green-100 text-green-700'
                                            : product.stockQuantity > 0
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                        {product.stockQuantity} in stock
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stock Status */}
                <div className="bg-white rounded-lg shadow border p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Stock Status</h3>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CubeIcon className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <ArrowTrendingUpIcon className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-3">
                                    <span className="text-sm font-medium text-green-800">In Stock</span>
                                    <p className="text-xs text-green-600">Products available</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-green-600">
                                {products.filter(p => p.stockQuantity > 10).length}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-500 rounded-lg">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-3">
                                    <span className="text-sm font-medium text-yellow-800">Low Stock</span>
                                    <p className="text-xs text-yellow-600">Needs attention</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-yellow-600">{lowStockProducts}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-500 rounded-lg">
                                    <ArrowTrendingDownIcon className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-3">
                                    <span className="text-sm font-medium text-red-800">Out of Stock</span>
                                    <p className="text-xs text-red-600">Urgent restock needed</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-red-600">{outOfStockProducts}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Overview */}
            <div className="bg-white rounded-lg shadow border p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Category Overview</h3>
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <TagIcon className="h-5 w-5 text-purple-600" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => {
                        const categoryProducts = products.filter(p => p.categoryId === category.id);
                        return (
                            <div key={category.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <img
                                            src={category.imageUrl}
                                            alt={category.categoryName}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                        <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                            {categoryProducts.length}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{category.categoryName}</h4>
                                        <p className="text-sm text-gray-500">{categoryProducts.length} products</p>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min((categoryProducts.length / totalProducts) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
