import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProducts,
    getCategories,
} from "../feature/product/productActions";
import { fetchCart, updateCart } from "../feature/cart/cartActions";
import { toast, ToastContainer } from "react-toastify";
import { Link, useSearchParams } from "react-router-dom";

function Products() {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "";
    const dispatch = useDispatch();
    const searchInput = useSelector((state) => state.product.searchInput);

    const { loading, error, products, categories } = useSelector(
        (state) => state.product
    );
    const { userToken } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [filters, setFilters] = useState({
        categoryId: initialCategory || "",
    });
    const [sortSelected, setSortSelected] = useState(0);
    const [addingToCart, setAddingToCart] = useState({});

    useEffect(() => {
        setSelectedCategory(initialCategory);
        setFilters((prev) => ({
            ...prev,
            categoryId: initialCategory,
        }));
    }, []);

    const debouncedFetchProducts = useCallback(
        (() => {
            let timeoutId;
            return (query, filters, sort) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    dispatch(
                        fetchProducts({
                            query: query,
                            filters: filters?.categoryId ? filters : null,
                            sort: sort,
                        })
                    );
                }, 400);
            };
        })(),
        [dispatch]
    );

    useEffect(() => {
        debouncedFetchProducts(searchInput, filters, sortSelected);
    }, [filters, sortSelected, searchInput, debouncedFetchProducts]);

    useEffect(() => {
        dispatch(getCategories());
    }, []);

    const handleAddToCart = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userToken) {
            toast.error("Please login to add products to cart.");
            return;
        }

        setAddingToCart(prev => ({ ...prev, [productId]: true }));

        try {
            await dispatch(updateCart({ productId, quantity: 1 })).unwrap();
            await dispatch(fetchCart()).unwrap();
            toast.success("Product added to cart!", {
                position: "bottom-right",
                autoClose: 2000,
            });
        } catch (error) {
            toast.error("Failed to add product to cart.");
        } finally {
            setAddingToCart(prev => ({ ...prev, [productId]: false }));
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setFilters((prev) => ({
            ...prev,
            categoryId: categoryId,
        }));
    };

    return (
        <div className="max-w-5xl mx-auto py-4 px-2">
            <ToastContainer />

            {/* Simple Filter Bar */}
            <div className="flex flex-wrap gap-2 mb-4 items-center">
                <select
                    value={selectedCategory}
                    onChange={e => handleCategoryChange(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                    <option value="">All Categories</option>
                    {categories?.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.categoryName}
                        </option>
                    ))}
                </select>
                <select
                    value={sortSelected}
                    onChange={e => setSortSelected(parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                    <option value={0}>Sort: Default</option>
                    <option value={1}>Price: Low to High</option>
                    <option value={2}>Price: High to Low</option>
                    <option value={3}>Rating: High to Low</option>
                    <option value={4}>Rating: Low to High</option>
                </select>
            </div>

            {/* Error and Loading */}
            {loading && (
                <div className="text-center py-8 text-gray-500">Loading...</div>
            )}
            {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products && products.length > 0 ? (
                    products.map(product => {
                        const isAdding = addingToCart[product.id];
                        const cartItem = cartItems?.find(item => item.productId === product.id);

                        return (
                            <div
                                key={product.id}
                                className="border rounded p-3 flex flex-col h-full bg-white"
                            >
                                <Link to={`/products/${product.id}`}>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="h-36 w-full object-contain mb-2 bg-gray-50"
                                    />
                                    <h2 className="font-semibold text-base mb-1 truncate">{product.name}</h2>
                                </Link>
                                <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                                <div className="text-sm mb-2 line-clamp-2">{product.description}</div>
                                <div className="flex items-center text-yellow-500 text-sm mb-2">
                                    {"★".repeat(Math.round(product.rating || 0))}
                                    {"☆".repeat(5 - Math.round(product.rating || 0))}
                                    <span className="ml-2 text-gray-400">
                                        ({product.totalRatings || 0})
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="font-bold text-indigo-700 text-lg">
                                        ₹{product.price}
                                    </span>
                                    <button
                                        onClick={e => handleAddToCart(e, product.id)}
                                        disabled={product.stockQuantity === 0 || isAdding}
                                        className={`px-3 py-1 text-sm rounded ${
                                            product.stockQuantity === 0
                                                ? "bg-gray-300 text-gray-500"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                                        }`}
                                    >
                                        {product.stockQuantity === 0
                                            ? "Out of Stock"
                                            : isAdding
                                            ? "Adding..."
                                            : cartItem
                                            ? "In Cart"
                                            : "Add"}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    !loading &&
                    <div className="col-span-full text-center text-gray-400 py-10">
                        No products found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;
