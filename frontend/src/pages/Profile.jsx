import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  BiUser,
  BiEnvelope,
  BiShield,
  BiHeart,
  BiStar,
  BiTrash,
} from "react-icons/bi";
import { getUserInfo } from "../feature/auth/authActions";
import { getWishlist, removeFromWishlist } from "../feature/product/productActions";

function Profile() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(getUserInfo());
    dispatch(getWishlist());
  }, []);
  // Dummy wishlist data

  const handleRemoveFromWishlist = (productId) => {
    // This would typically dispatch an action to remove from wishlist
    dispatch(removeFromWishlist(productId));
  };

  // ullStars: Whole stars (Math.floor)
  // hasHalfStar: Whether to show one half (rounded display, even though icon is full)
  // emptyStars: Remaining stars to reach 5 (gray color)
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<BiStar key={i} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<BiStar key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<BiStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Please Login
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your profile.
          </p>
          <Link
            to="/auth"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center">
              <BiUser className="text-white text-4xl" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {userInfo.name}!
              </h1>
              <p className="text-gray-600">
                Manage your account and view your wishlist
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Account Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <BiUser className="text-indigo-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium text-gray-800">{userInfo.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BiEnvelope className="text-indigo-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">
                      {userInfo.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BiShield className="text-indigo-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${userInfo.role === "Admin"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                        }`}
                    >
                      {userInfo.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <BiHeart className="text-red-500 mr-2" />
                  My Wishlist
                </h2>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {wishlist?.length} items
                </span>
              </div>

              {wishlist?.length === 0 ? (
                <div className="text-center py-12">
                  <BiHeart className="text-gray-300 text-6xl mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Start adding products you love to your wishlist
                  </p>
                  <Link
                    to="/products"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist?.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow h-72 flex flex-col justify-between"
                    >
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Link
                                to={`/products/${product.id}`}
                                className="text-lg font-medium text-gray-800 hover:text-indigo-600 transition"
                              >
                                {product.name}
                              </Link>
                              <div className="flex items-center mt-1">
                                <div className="flex space-x-1">
                                  {renderStars(product.rating)}
                                </div>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({product.totalRatings} reviews)
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xl font-bold text-indigo-600">
                                  ₹{product.price.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {product.brand}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <span
                                  className={`text-xs px-2 py-1 rounded ${product.stockQuantity > 0
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                    }`}
                                >
                                  {product.stockQuantity > 0
                                    ? `${product.stockQuantity} in stock`
                                    : "Out of stock"}
                                </span>
                                <div className="flex items-center space-x-1">
                                  {product.isFeatured && (
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                      Featured
                                    </span>
                                  )}
                                  {product.isTrending && (
                                    <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                                      Trending
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveFromWishlist(product.id)
                              }
                              className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                              title="Remove from wishlist"
                            >
                              <BiTrash className="text-lg" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Link
                          to={`/products/${product.id}`}
                          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition text-center text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
