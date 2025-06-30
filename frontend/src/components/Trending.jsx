import React, { useEffect } from "react";
import { FaAngleRight, FaFire } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchTrendingProducts } from "../feature/product/productActions";
import { useDispatch, useSelector } from "react-redux";
import { FiTrendingUp, FiStar } from "react-icons/fi";

function Trending() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTrendingProducts());
    }, [dispatch]);

    const products = useSelector((state) => state.product.trending);
    const role = useSelector((state) => state.auth.userInfo?.role);

    // Sort products by rating in descending order
    const sortedProducts = [...products].sort((a, b) => b.rating - a.rating);

    if (role && role !== "Normal") {
        return (
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full">
                            <FaFire className="text-orange-500 animate-pulse" />
                            <span className="font-semibold text-orange-600 uppercase tracking-wide text-sm">
                                Top Rated Products
                            </span>
                        </div>
                        <FiTrendingUp className="text-emerald-500 text-xl" />
                    </div>

                    <Link to="/products">
                        <div className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
                            <span className="font-medium">View All</span>
                            <FaAngleRight className="text-sm" />
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {sortedProducts.map((product) => (
                        <Link to={`/products/${product.id}`} key={product.id}>
                            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-indigo-200">
                                {/* Product Image */}
                                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 h-48 p-4">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                        {product.rating.toFixed(1)}★
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="p-4 space-y-3">
                                    <h3 className="font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <FiStar
                                                    key={i}
                                                    className={`w-3 h-3 ${i < Math.round(product.rating || 0) ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-700 font-semibold ml-1">
                                            {Number(product.rating).toFixed(1)} ({Math.floor(Math.random() * 500) + 100})
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-emerald-600">
                                            ₹{product.price.toLocaleString()}
                                        </span>
                                        <span className="text-slate-500 line-through text-sm">
                                            ₹{(product.price + 2000).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100">
                                        <span className="text-emerald-600 font-semibold text-sm">
                                            Save ₹2,000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }
    return null;
}

export default Trending;
