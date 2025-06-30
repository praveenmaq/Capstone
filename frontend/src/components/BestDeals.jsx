import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchFeaturedProducts } from "../feature/product/productActions";
import { useDispatch, useSelector } from "react-redux";
import { FiStar, FiHeart, FiShoppingBag } from "react-icons/fi";

function BestDeals() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFeaturedProducts());
    }, [dispatch]);

    const {
        featured: products,
        loading,
        error,
    } = useSelector((state) => state.product);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-16 px-4">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-100 h-72 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto py-16 px-4">
                <div className="text-center bg-red-50 rounded-xl border border-red-100 p-8">
                    <div className="text-red-600 text-3xl mb-2">⚠️</div>
                    <p className="text-red-700 font-semibold">
                        Unable to load deals. Please refresh.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-16 px-4">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-2">
                    Best Deals
                </h2>
                <p className="text-lg text-gray-500 max-w-xl mx-auto">
                    Exclusive offers on premium products. Limited time only.
                </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <Link to={`/products/${product.id}`} key={product.id}>
                        <div className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 p-4 flex flex-col h-full">
                            {/* Wishlist Button */}
                            <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition">
                                <FiHeart className="w-4 h-4 text-gray-500" />
                            </button>

                            {/* Product Image */}
                            <div className="flex-1 flex items-center justify-center mb-4 h-40">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="max-h-full object-contain"
                                />
                            </div>

                            {/* Product Details */}
                            <h3 className="font-semibold text-gray-900 text-base mb-2">
                                {product.name}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FiStar
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.round(product.rating || 0)
                                            ? "text-yellow-400"
                                            : "text-gray-300"}`}
                                    />
                                ))}
                                <span className="text-xs text-gray-500 ml-2">
                                    {Number(product.rating).toFixed(1)}
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl font-bold text-emerald-600">
                                    ₹{product.price.toLocaleString()}
                                </span>
                                <span className="text-gray-400 line-through text-sm">
                                    ₹{(product.price * 3.33).toLocaleString()}
                                </span>
                            </div>

                            {/* Features */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                    Free Delivery
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                    1 Year Warranty
                                </span>
                            </div>

                            {/* Add to Cart Button */}
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition">
                                <FiShoppingBag className="text-lg" />
                                Add to Cart
                            </button>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
                <Link to="/products">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-base transition">
                        Explore All Deals
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default BestDeals;
