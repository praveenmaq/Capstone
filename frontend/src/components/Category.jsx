import React, { useEffect } from "react";
import { FaAngleRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../feature/product/productActions";
import { Link } from "react-router-dom";
import { FiGrid, FiArrowRight, FiTrendingUp, FiStar } from "react-icons/fi";

function Category() {
  const products = useSelector((state) => state.product.categories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const categoryColors = [
    "bg-blue-100 text-blue-800",
    "bg-purple-100 text-purple-800",
    "bg-emerald-100 text-emerald-800",
    "bg-amber-100 text-amber-800",
    "bg-red-100 text-red-800",
    "bg-cyan-100 text-cyan-800",
    "bg-violet-100 text-violet-800",
    "bg-green-100 text-green-800",
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center bg-gray-100 text-gray-800 px-4 py-2 rounded-full mb-6">
          <FiGrid className="mr-2" />
          <span className="font-medium">CATEGORIES</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our carefully curated collections
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mb-12">
        {products.map((product, index) => (
          <Link
            to={`/products?category=${product.id}`}
            key={product.id}
            className="group"
          >
            <div className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
              <div className={`w-20 h-20 ${categoryColors[index % categoryColors.length]} rounded-lg p-4 mb-3 flex items-center justify-center`}>
                <img
                  src={product.imageUrl}
                  alt={product.categoryName}
                  className="w-full h-full object-contain"
                />
              </div>

              <h3 className="font-medium text-gray-900 text-sm text-center">
                {product.categoryName}
              </h3>
              <span className="text-xs text-gray-500 mt-1">
                {product.count} items
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Categories Section */}
      <div className="bg-gray-50 rounded-xl p-8 mb-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Popular Collections
          </h3>
          <p className="text-gray-600">
            Our most sought-after categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.slice(0, 3).map((product, index) => (
            <Link
              to={`/products?category=${product.id}`}
              key={product.id}
              className="group"
            >
              <div className="bg-white p-6 rounded-lg hover:shadow-md transition-shadow border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 ${categoryColors[index]} rounded-lg p-3 flex-shrink-0`}>
                    <img
                      src={product.imageUrl}
                      alt={product.categoryName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {product.categoryName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Premium collection
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Explore</span>
                  <FiArrowRight className="text-gray-400 group-hover:text-blue-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Link
          to="/products"
          className="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <FiGrid className="mr-2" />
          <span>View All Categories</span>
          <FaAngleRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
}

export default Category;
