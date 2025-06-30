import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    fetchCart,
    updateCartQuantity,
    deleteProductFromCart,
    deleteCart,
} from "../feature/cart/cartActions";
import { resetCartState, clearError } from "../feature/cart/cartSlice";
import {
    FiMinus,
    FiPlus,
    FiTrash2,
    FiShoppingCart,
    FiArrowLeft,
    FiCreditCard,
    FiMapPin,
    FiCheck,
    FiX,
    FiTruck,
    FiShield,
    FiPackage,
} from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { ProceedToCheckout } from "../feature/order/orderActions";
import { getPaymentMethodOptions } from "../utils/enums";

function Cart() {
    const dispatch = useDispatch();
    const { cartItems, totalAmount, loading, error } = useSelector(
        (state) => state.cart
    );
    const token = useSelector((state) => state.auth.userToken);
    const role = useSelector((state) => state.auth.userInfo?.role);
    const [updatingItems, setUpdatingItems] = useState({});
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
        if (token) {
            dispatch(fetchCart());
        }
    }, [dispatch, token]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    const handleQuantityUpdate = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItems((prev) => ({ ...prev, [productId]: true }));

        try {
            await dispatch(updateCartQuantity({ productId, quantity: newQuantity }));
            dispatch(fetchCart());
        } finally {
            setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
        }
    };

    const handleRemoveItem = async (productId) => {
        if (
            window.confirm("Are you sure you want to remove this item from cart?")
        ) {
            await dispatch(deleteProductFromCart(productId));
        }
    };

    const handleClearCart = async () => {
        if (window.confirm("Are you sure you want to clear your entire cart?")) {
            await dispatch(deleteCart());
        }
    };

    // Success Modal Component
    const SuccessModal = ({ isOpen, onClose }) => {
        if (!isOpen) return null;

        return (
            <>
                {/* Professional Backdrop */}
                <div
                    className="fixed inset-0 bg-gradient-to-br from-green-900/80 via-green-800/90 to-emerald-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out"
                    onClick={onClose}
                >
                    {/* Modal Container */}
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Success Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-8 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                            <div className="relative text-center">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <FiCheck className="text-4xl text-white" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Order Successful!</h2>
                                <p className="text-green-100 text-sm">Your order has been placed successfully</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 text-center">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiPackage className="text-3xl text-green-600" />
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    Order is successfully placed! You can see it on your{" "}
                                    <span className="font-semibold text-green-600">orders page</span>.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link
                                    to="/orders"
                                    onClick={onClose}
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center gap-3"
                                >
                                    <FiPackage className="text-lg" />
                                    View My Orders
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="w-full px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    // Professional Checkout Modal Component
    const CheckoutModal = ({ isOpen, onClose, onConfirm }) => {
        const [paymentMethod, setPaymentMethod] = useState("");
        const [address, setAddress] = useState("");
        const [isSubmitting, setIsSubmitting] = useState(false);

        const paymentMethods = getPaymentMethodOptions();

        const handleSubmit = async (e) => {
            e.preventDefault();

            if (!paymentMethod) {
                alert("Please select a payment method");
                return;
            }

            if (!address || address.trim().length < 10) {
                alert("Please enter a valid address (minimum 10 characters)");
                return;
            }

            setIsSubmitting(true);

            try {
                await onConfirm({
                    paymethod: parseInt(paymentMethod),
                    address: address.trim(),
                });
            } finally {
                setIsSubmitting(false);
            }
        };

        if (!isOpen) return null;

        return (
            <>
                {/* Professional Backdrop */}
                <div
                    className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/90 to-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out"
                    onClick={onClose}
                >
                    {/* Modal Container */}
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <FiShoppingCart className="text-xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Secure Checkout</h2>
                                        <p className="text-indigo-100 text-sm">Complete your order safely</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                                >
                                    <IoClose className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 max-h-[calc(90vh-120px)] overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Payment Method Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <FiCreditCard className="text-white text-sm" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">Payment Method</h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {paymentMethods.map((method) => (
                                            <label
                                                key={method.value}
                                                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === method.value.toString()
                                                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method.value}
                                                    checked={paymentMethod === method.value.toString()}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${paymentMethod === method.value.toString()
                                                        ? 'border-indigo-500 bg-indigo-500'
                                                        : 'border-gray-300'
                                                    }`}>
                                                    {paymentMethod === method.value.toString() && (
                                                        <FiCheck className="text-white text-xs" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-medium text-gray-800">{method.label}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Address Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                            <FiMapPin className="text-white text-sm" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">Shipping Address</h3>
                                    </div>

                                    <div className="relative">
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Enter your complete shipping address including street, city, state, and postal code..."
                                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
                                            rows="4"
                                            minLength="10"
                                            required
                                        />
                                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                            {address.length}/10 min
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                        <FiShoppingCart className="text-indigo-600" />
                                        Order Summary
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span className="flex items-center gap-2">
                                                <span>Items ({cartItems.length})</span>
                                            </span>
                                            <span className="font-semibold">₹{totalAmount.toLocaleString()}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-gray-600">
                                            <span className="flex items-center gap-2">
                                                <FiTruck className="text-sm" />
                                                Shipping
                                            </span>
                                            <span className={`font-semibold ${role === "Premium" ? "text-green-600" : ""}`}>
                                                {role === "Premium" ? "Free (Premium)" : "₹50"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-gray-600">
                                            <span className="flex items-center gap-2">
                                                <FiShield className="text-sm" />
                                                Tax
                                            </span>
                                            <span className="font-semibold">₹0</span>
                                        </div>

                                        <div className="border-t border-gray-300 pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-gray-800">Total Amount</span>
                                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                    ₹{(totalAmount + (role === "Premium" ? 0 : 50)).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-6 py-4 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <FiCheck className="text-lg" />
                                                Place Order
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const handleCheckout = () => {
        setIsCheckoutModalOpen(true);
    };

    const handleCheckoutConfirm = async (checkoutData) => {
        try {
            await dispatch(
                ProceedToCheckout({
                    address: checkoutData.address,
                    payMethod: checkoutData.paymethod,
                })
            );
            setIsCheckoutModalOpen(false);
            setIsSuccessModalOpen(true); // Show success modal
            dispatch(resetCartState());
        } catch (error) {
            console.error("Checkout failed:", error);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-4 border border-gray-200">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiShoppingCart className="text-3xl text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
                    <Link
                        to="/auth"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 inline-block font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading && cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-6"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/products"
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium"
                        >
                            <FiArrowLeft className="text-lg" />
                            <span>Continue Shopping</span>
                        </Link>
                    </div>
                    {cartItems.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-all duration-200 px-4 py-2 border-2 border-red-300 rounded-xl hover:bg-red-50 hover:border-red-400 font-medium"
                            disabled={loading}
                        >
                            <FiTrash2 />
                            <span>Clear Cart</span>
                        </button>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center justify-between shadow-lg">
                        <span className="font-medium">{error}</span>
                        <button
                            onClick={() => dispatch(clearError())}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                            <IoClose className="text-xl" />
                        </button>
                    </div>
                )}

                {/* Empty Cart */}
                {cartItems.length === 0 && !loading ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
                        <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiShoppingCart className="text-4xl text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8 text-lg">Looks like you haven't added any items to your cart yet.</p>
                        <Link
                            to="/products"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <FiShoppingCart className="text-lg" />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Cart Items ({cartItems.length})
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <div key={item.productId} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                {/* Product Image Placeholder */}
                                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                                    <FiShoppingCart className="text-gray-400 text-2xl" />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
                                                        {item.productName}
                                                    </h3>
                                                    <p className="text-indigo-600 font-semibold">₹{item.price.toLocaleString()} each</p>
                                                    <p className="text-sm text-gray-500 font-medium">
                                                        Subtotal: ₹{item.total.toLocaleString()}
                                                    </p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between sm:justify-center gap-4">
                                                    <div className="flex items-center space-x-3 bg-gray-100 rounded-xl p-2">
                                                        <button
                                                            onClick={() =>
                                                                handleQuantityUpdate(
                                                                    item.productId,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity <= 1 ||
                                                                updatingItems[item.productId]
                                                            }
                                                            className="p-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
                                                        >
                                                            <FiMinus className="text-sm" />
                                                        </button>

                                                        <span className="w-12 text-center font-bold text-lg">
                                                            {updatingItems[item.productId] ? (
                                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent mx-auto"></div>
                                                            ) : (
                                                                item.quantity
                                                            )}
                                                        </span>

                                                        <button
                                                            onClick={() =>
                                                                handleQuantityUpdate(
                                                                    item.productId,
                                                                    item.quantity + 1
                                                                )
                                                            }
                                                            disabled={updatingItems[item.productId]}
                                                            className="p-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 transition-all duration-200 hover:shadow-md"
                                                        >
                                                            <FiPlus className="text-sm" />
                                                        </button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => handleRemoveItem(item.productId)}
                                                        className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
                                                        disabled={loading}
                                                    >
                                                        <FiTrash2 className="text-lg" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-200">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">
                                            Items ({cartItems.length})
                                        </span>
                                        <span className="font-semibold text-lg">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Shipping</span>
                                        <span className={`font-semibold ${role === "Premium" ? "text-green-600" : ""}`}>
                                            {role === "Premium" ? "Free (Premium)" : "₹50"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Tax</span>
                                        <span className="font-semibold">₹0</span>
                                    </div>
                                    <div className="border-t-2 border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-gray-800">Total</span>
                                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                ₹{(totalAmount + (role === "Premium" ? 0 : 50)).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={cartItems.length === 0 || loading}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        "Proceed to Checkout"
                                    )}
                                </button>

                                <div className="mt-4 text-center">
                                    <Link
                                        to="/products"
                                        className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Checkout Modal */}
                <CheckoutModal
                    isOpen={isCheckoutModalOpen}
                    onClose={() => setIsCheckoutModalOpen(false)}
                    onConfirm={handleCheckoutConfirm}
                />

                {/* Success Modal */}
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                />
            </div>
        </div>
    );
}

export default Cart;
