import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCart } from "../feature/cart/cartActions";
import { fetchReviews, addReview } from "../feature/product/productActions";
import {
    FiMinus,
    FiPlus,
    FiShoppingCart,
    FiHeart,
    FiShare2,
    FiArrowLeft,
    FiTruck,
    FiShield,
    FiRefreshCw,
    FiStar,
    FiCheck,
    FiX,
} from "react-icons/fi";
import { BiSolidStarHalf } from "react-icons/bi";
import {
    addToWishlist,
    fetchProductById,
} from "../feature/product/productActions";
import { toast, ToastContainer } from "react-toastify";
import { FaStar } from "react-icons/fa";

function ProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { reviews } = useSelector((state) => state.product);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

    const { loading, error, selectedProduct } = useSelector(
        (state) => state.product
    );
    const { userToken, userInfo } = useSelector((state) => state.auth);
    const { loading: cartLoading } = useSelector((state) => state.cart);

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isWishlist, setIsWishlist] = useState(false);

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductById(productId));
            dispatch(fetchReviews(productId));
        }
    }, [dispatch, productId]);

    useEffect(() => {
        if (selectedProduct?.imageUrl) {
            setSelectedImage(0);
        }
    }, [selectedProduct]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!userToken) {
            toast.error("Please login to leave a review.");
            navigate("/auth");
            return;
        }

        try {
            // Add the review
            await dispatch(addReview({
                productId: selectedProduct.id,
                rating: reviewForm.rating,
                comment: reviewForm.comment,
            })).unwrap();

            // Refresh the product data to get updated rating and review count
            dispatch(fetchProductById(productId));
            // Refresh reviews list
            dispatch(fetchReviews(productId));

            // Reset form
            setReviewForm({ rating: 5, comment: "" });

            toast.success("Review added successfully!", {
                style: {
                    background: '#f0fdf4',
                    color: '#166534',
                    border: '1px solid #bbf7d0'
                }
            });
        } catch (error) {
            toast.error("Failed to add review. Please try again.");
        }
    };

    const handleQuantityChange = (type) => {
        if (type === "increase" && quantity < selectedProduct.stockQuantity) {
            setQuantity((prev) => prev + 1);
        } else if (type === "decrease" && quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleAddToCart = async () => {
        if (!userToken) {
            toast.error("Please login to add products to cart.");
            navigate("/auth");
            return;
        }

        setAddingToCart(true);
        try {
            await dispatch(
                updateCart({
                    productId: parseInt(productId),
                    quantity,
                })
            ).unwrap();
            dispatch(fetchCart());
            toast.success("Product added to cart successfully!");
        } catch (error) {
            console.error("Failed to add to cart:", error);
            toast.error("Failed to add product to cart. Please try again.");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        if (!userToken) {
            toast.error("Please login to proceed");
            navigate("/auth");
            return;
        }
        handleAddToCart().then(() => {
            navigate("/cart");
        });
    };

    const handleWishlist = async () => {
        if (!userToken) {
            toast.error("Please login to manage wishlist.");
            navigate("/auth");
            return;
        }

        try {
            await dispatch(addToWishlist(selectedProduct.id)).unwrap();
            setIsWishlist(!isWishlist);

            if (!isWishlist) {
                toast.success("💖 Added to wishlist!", {
                    style: {
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca'
                    }
                });
            } else {
                toast.info("💔 Removed from wishlist", {
                    style: {
                        background: '#f8fafc',
                        color: '#64748b',
                        border: '1px solid #e2e8f0'
                    }
                });
            }
        } catch (error) {
            toast.error("Failed to update wishlist. Please try again.");
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: selectedProduct.name,
                text: selectedProduct.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Product link copied to clipboard!");
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="text-amber-400 text-sm" />);
        }

        if (hasHalfStar) {
            stars.push(<BiSolidStarHalf key="half" className="text-amber-400 text-sm" />);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <FaStar key={`empty-${i}`} className="text-gray-300 text-sm" />
            );
        }

        return stars;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm font-medium">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !selectedProduct) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-xl shadow-lg p-6 max-w-sm mx-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiX className="text-red-600 text-xl" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                        Product Not Found
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                        {error || "The product you're looking for doesn't exist."}
                    </p>
                    <button
                        onClick={() => navigate("/products")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const images = [selectedProduct.imageUrl];

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer
                position="top-right"
                className="mt-16"
                toastClassName="rounded-lg shadow-lg text-sm"
            />

            {/* Compact Breadcrumb Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <button
                            onClick={() => navigate("/products")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                        >
                            <FiArrowLeft className="text-sm" />
                            <span>Back to Products</span>
                        </button>
                        {selectedProduct && (
                            <>
                                <span className="text-gray-400">/</span>
                                <span className="text-gray-500">{selectedProduct.category || 'Unknown Category'}</span>
                                <span className="text-gray-400">/</span>
                                <span className="text-gray-800 font-medium truncate text-xs">
                                    {selectedProduct.name}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Images - Compact */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-md p-4 overflow-hidden">
                            <div className="relative group">
                                <img
                                    src={images[selectedImage]}
                                    alt={selectedProduct.name}
                                    className="w-full h-80 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === index
                                            ? "border-blue-600 shadow-md scale-105"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${selectedProduct.name} ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Information - Compact */}
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                        {selectedProduct.name}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                                            {selectedProduct.brand}
                                        </span>
                                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                                            {selectedProduct.category}
                                        </span>
                                        {selectedProduct.isFeatured && (
                                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                ⭐ Featured
                                            </span>
                                        )}
                                        {selectedProduct.isTrending && (
                                            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                🔥 Trending
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center gap-1">
                                            {renderStars(selectedProduct.rating)}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">
                                            {selectedProduct.rating > 0
                                                ? selectedProduct.rating.toFixed(1)
                                                : "No ratings"}
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            ({selectedProduct.totalRatings} {selectedProduct.totalRatings === 1 ? "review" : "reviews"})
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={handleWishlist}
                                        className={`p-2 rounded-full border-2 transition-all duration-300 transform hover:scale-110 ${isWishlist
                                            ? "bg-red-50 border-red-300 text-red-600 shadow-md"
                                            : "bg-white border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 shadow-sm hover:shadow-md"
                                            }`}
                                    >
                                        <FiHeart className={`text-lg ${isWishlist ? "fill-current" : ""}`} />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-2 rounded-full border-2 bg-white border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md"
                                    >
                                        <FiShare2 className="text-lg" />
                                    </button>
                                </div>
                            </div>

                            {/* Price and Stock - Compact */}
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            ₹{selectedProduct.price.toLocaleString()}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedProduct.stockQuantity > 0
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {selectedProduct.stockQuantity > 0
                                                ? `${selectedProduct.stockQuantity} in stock`
                                                : "Out of stock"}
                                        </span>
                                    </div>
                                </div>

                                {/* Quantity Selector - Compact */}
                                {selectedProduct.stockQuantity > 0 && (
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="font-semibold text-gray-700 text-sm">Quantity:</span>
                                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                            <button
                                                onClick={() => handleQuantityChange("decrease")}
                                                disabled={quantity <= 1}
                                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                <FiMinus className="text-sm" />
                                            </button>
                                            <span className="px-4 py-2 border-x-2 border-gray-200 min-w-[60px] text-center font-semibold text-sm">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange("increase")}
                                                disabled={quantity >= selectedProduct.stockQuantity}
                                                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                <FiPlus className="text-sm" />
                                            </button>
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">
                                            Max: {selectedProduct.stockQuantity}
                                        </span>
                                    </div>
                                )}

                                {/* Action Buttons - Compact */}
                                {userInfo?.Role !== "Admin" && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={selectedProduct.stockQuantity === 0 || addingToCart}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                                        >
                                            {addingToCart ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <FiShoppingCart className="text-lg" />
                                                    Add to Cart
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            disabled={selectedProduct.stockQuantity === 0}
                                            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Features - Compact */}
                        <div className="bg-white rounded-xl shadow-md p-5">
                            <h3 className="text-lg font-bold mb-4 text-gray-900">Product Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <FiTruck className="text-green-600 text-lg" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Free Delivery</p>
                                        <p className="text-xs text-gray-600">For orders above ₹25,000</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <FiShield className="text-blue-600 text-lg" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Warranty</p>
                                        <p className="text-xs text-gray-600">1 year manufacturer warranty</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                    <div className="p-2 bg-purple-100 rounded-full">
                                        <FiRefreshCw className="text-purple-600 text-lg" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Easy Returns</p>
                                        <p className="text-xs text-gray-600">7 day return policy</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Description - Compact */}
                        <div className="bg-white rounded-xl shadow-md p-5">
                            <h3 className="text-lg font-bold mb-3 text-gray-900">Product Description</h3>
                            <p className="text-gray-700 leading-relaxed text-sm">
                                {selectedProduct.description}
                            </p>
                        </div>

                        {/* Product Details - Compact */}
                        <div className="bg-white rounded-xl shadow-md p-5">
                            <h3 className="text-lg font-bold mb-4 text-gray-900">Product Details</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 font-medium">Brand:</span>
                                    <span className="font-semibold text-gray-900">{selectedProduct.brand}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 font-medium">Category:</span>
                                    <span className="font-semibold text-gray-900">{selectedProduct.category}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 font-medium">Stock:</span>
                                    <span className="font-semibold text-gray-900">{selectedProduct.stockQuantity} units</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 font-medium">Added:</span>
                                    <span className="font-semibold text-gray-900">
                                        {new Date(selectedProduct.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section - Compact Design */}
                <div className="mt-8 bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Customer Reviews</h3>

                    {reviews.length === 0 ? (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FiStar className="text-gray-400 text-xl" />
                            </div>
                            <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
                        </div>
                    ) : (
                        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                            {reviews.map((review) => (
                                <div key={review.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow duration-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                {renderStars(review.rating)}
                                            </div>
                                            <span className="font-semibold text-gray-900 text-sm">{review.rating}/5</span>
                                        </div>
                                        <span className="text-gray-500 text-xs">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed text-sm">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Compact Review Form */}
                    <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-base font-semibold mb-3 text-gray-900">Write a Review</h4>
                        <form onSubmit={handleReviewSubmit} className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-medium text-gray-700 mb-1 text-sm">Your Rating</label>
                                    <select
                                        value={reviewForm.rating}
                                        onChange={(e) =>
                                            setReviewForm((f) => ({
                                                ...f,
                                                rating: Number(e.target.value),
                                            }))
                                        }
                                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none transition-colors duration-200"
                                        required
                                    >
                                        {[5, 4, 3, 2, 1].map((r) => (
                                            <option key={r} value={r}>
                                                {r} Star{r > 1 && "s"}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:row-span-2">
                                    <label className="block font-medium text-gray-700 mb-1 text-sm">Your Review</label>
                                    <textarea
                                        value={reviewForm.comment}
                                        onChange={(e) =>
                                            setReviewForm((f) => ({
                                                ...f,
                                                comment: e.target.value,
                                            }))
                                        }
                                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none"
                                        rows={3}
                                        placeholder="Share your experience with this product..."
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
