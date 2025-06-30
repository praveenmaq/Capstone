import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribe } from "../feature/auth/authActions";
import { logoutUser } from "../feature/auth/authActions";
import {
    FiStar,
    FiTruck,
    FiShield,
    FiHeadphones,
    FiGift,
    FiClock,
    FiHeart,
    FiCheck,
    FiZap,
    FiAward,
    FiPackage,
    FiSettings,
    FiLogOut,
} from "react-icons/fi";
import { IoClose } from "react-icons/io5";

function Subscription() {
    const dispatch = useDispatch();
    const { userInfo, loading } = useSelector((state) => state.auth);
    const [selectedPlan, setSelectedPlan] = useState("Premium");
    const [isProcessing, setIsProcessing] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // Premium Subscription Confirmation Modal
    const PremiumConfirmModal = ({ isOpen, onClose, onConfirm }) => {
        const [isConfirming, setIsConfirming] = useState(false);

        const handleConfirm = async () => {
            setIsConfirming(true);
            try {
                await onConfirm();
            } finally {
                setIsConfirming(false);
            }
        };

        if (!isOpen) return null;

        return (
            <>
                {/* Professional Backdrop */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out"
                    onClick={onClose}
                >
                    {/* Modal Container - Compact Size */}
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100 overflow-hidden"
                        style={{ maxHeight: "85vh" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Compact Header */}
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-white relative">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <FiSettings className="text-xl text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">Premium Setup</h2>
                                        <p className="text-amber-100 text-xs">Account Configuration</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                                >
                                    <IoClose className="text-lg" />
                                </button>
                            </div>
                        </div>

                        {/* Compact Content */}
                        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 140px)" }}>
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiStar className="text-2xl text-amber-600" />
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-3">
                                    Premium Feature Setup
                                </h3>

                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-4">
                                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                        To activate your <span className="font-bold text-amber-600">Premium features</span>,
                                        we'll need to refresh your account session. This ensures all premium benefits
                                        are properly configured for you.
                                    </p>

                                    <div className="text-left space-y-1.5">
                                        <p className="text-xs text-gray-600 flex items-center gap-2">
                                            <FiCheck className="text-green-500 flex-shrink-0 text-sm" />
                                            Premium subscription activates instantly
                                        </p>
                                        <p className="text-xs text-gray-600 flex items-center gap-2">
                                            <FiCheck className="text-green-500 flex-shrink-0 text-sm" />
                                            Quick session refresh for feature activation
                                        </p>
                                        <p className="text-xs text-gray-600 flex items-center gap-2">
                                            <FiCheck className="text-green-500 flex-shrink-0 text-sm" />
                                            Immediate access to all premium benefits
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm">
                                    Would you like to proceed with your Premium subscription?
                                </p>
                            </div>

                            {/* Compact Premium Benefits Preview */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <h4 className="font-semibold text-gray-800 mb-2 text-sm text-center">Your Premium Benefits:</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <FiTruck className="text-amber-600 text-sm" />
                                        <span>Express Shipping</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <FiStar className="text-amber-600 text-sm" />
                                        <span>Exclusive Deals</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <FiShield className="text-amber-600 text-sm" />
                                        <span>Extended Warranty</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <FiHeadphones className="text-amber-600 text-sm" />
                                        <span>Priority Support</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Compact Action Buttons */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={isConfirming}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                                >
                                    {isConfirming ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Setting up...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <FiStar className="text-sm" />
                                            Activate Premium
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    // Handle subscription with confirmation
    const handleSubscribe = async (tier) => {
        if (tier === "Premium" && userInfo?.role !== "Premium") {
            setIsConfirmModalOpen(true);
            return;
        }

        // For Normal plan or if already Premium
        setIsProcessing(true);
        try {
            dispatch(subscribe(tier));
            alert(`Successfully subscribed to ${tier} plan!`);
        } catch (error) {
            alert(`Subscription failed: ${error}`);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle Premium subscription confirmation
    const handlePremiumConfirm = async () => {
        setIsProcessing(true);
        try {
            // Subscribe to Premium
            await dispatch(subscribe("Premium")).unwrap();

            // Close modal
            setIsConfirmModalOpen(false);

            // Show success message
            alert("Premium subscription activated successfully! Setting up your premium features now...");

            // Logout user
            dispatch(logoutUser());

        } catch (error) {
            alert(`Subscription failed: ${error.message || error}`);
            setIsConfirmModalOpen(false);
        } finally {
            setIsProcessing(false);
        }
    };

    const plans = [
        {
            name: "Normal",
            price: "Free",
            period: "Forever",
            color: "border-gray-300",
            bgColor: "bg-white",
            textColor: "text-gray-600",
            buttonColor: "bg-gray-600 hover:bg-gray-700",
            popular: false,
            features: [
                "Standard shipping (5-7 days)",
                "Basic customer support",
                "Access to all products",
                "Standard return policy (30 days)",
                "Email notifications",
            ],
        },
        {
            name: "Premium",
            price: "₹499",
            period: "per month",
            color: "border-orange-500",
            bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
            textColor: "text-orange-600",
            buttonColor:
                "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600",
            popular: true,
            features: [
                "Free express shipping (1-2 days)",
                "Same-day delivery available",
                "Priority customer support",
                "Early access to sales & new products",
                "Exclusive member discounts (up to 25%)",
                "Free returns & exchanges",
                "Extended warranty on purchases",
                "Personal shopping assistant",
                "Premium-only products access",
                "Price protection guarantee",
                "Unlimited delivery addresses",
                "Member-only flash sales",
            ],
        },
    ];

    const premiumBenefits = [
        {
            icon: <FiTruck className="text-2xl" />,
            title: "Free Express Shipping",
            description: "Get your orders in 1-2 days at no extra cost",
        },
        {
            icon: <FiStar className="text-2xl" />,
            title: "Exclusive Discounts",
            description: "Access to member-only deals and higher discounts",
        },
        {
            icon: <FiClock className="text-2xl" />,
            title: "Early Access",
            description: "First access to sales, new products, and limited editions",
        },
        {
            icon: <FiHeadphones className="text-2xl" />,
            title: "Priority Support",
            description: "Dedicated premium customer support line",
        },
        {
            icon: <FiShield className="text-2xl" />,
            title: "Purchase Protection",
            description: "Extended warranty and protection for all purchases",
        },
        {
            icon: <FiGift className="text-2xl" />,
            title: "Premium Products",
            description: "Access to exclusive luxury and limited edition items",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Unlock exclusive benefits and enjoy a premium shopping experience
                        with our subscription plans
                    </p>
                    {userInfo?.role === "Premium" && (
                        <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full">
                            <FiStar />
                            <span className="font-medium">
                                You're already a Premium member!
                            </span>
                        </div>
                    )}
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative ${plan.bgColor} ${plan.color
                                } border-2 rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${plan.popular ? "transform scale-105" : ""
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                                        <FiStar className="text-sm" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-bold text-gray-900">
                                        {plan.price}
                                    </span>
                                    {plan.period !== "Forever" && (
                                        <span className="text-gray-600">/{plan.period}</span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan.name)}
                                disabled={
                                    isProcessing ||
                                    (userInfo?.role === "Premium" && plan.name === "Premium")
                                }
                                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 ${plan.buttonColor
                                    } ${isProcessing ||
                                        (userInfo?.role === "Premium" && plan.name === "Premium")
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:shadow-lg transform hover:-translate-y-0.5"
                                    }`}
                            >
                                {isProcessing
                                    ? "Processing..."
                                    : userInfo?.role === "Premium" && plan.name === "Premium"
                                        ? "Current Plan"
                                        : plan.name === "Normal"
                                            ? "Current Plan"
                                            : "Upgrade Now"}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Premium Benefits Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Why Choose Premium?
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {premiumBenefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="text-orange-500 mb-4">{benefit.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        Premium Member Benefits
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-500 mb-2">25%</div>
                            <div className="text-gray-600">Average Savings</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-500 mb-2">1-2</div>
                            <div className="text-gray-600">Days Delivery</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-500 mb-2">
                                24/7
                            </div>
                            <div className="text-gray-600">Priority Support</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-500 mb-2">
                                100+
                            </div>
                            <div className="text-gray-600">Exclusive Products</div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Can I cancel my subscription anytime?
                            </h3>
                            <p className="text-gray-600">
                                Yes, you can cancel your Premium subscription at any time. Your
                                benefits will continue until the end of your current billing
                                period.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                What happens to my existing orders?
                            </h3>
                            <p className="text-gray-600">
                                All your existing orders remain unaffected. Premium benefits
                                apply to new orders placed after subscription activation.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Is there a commitment period?
                            </h3>
                            <p className="text-gray-600">
                                No, our Premium subscription is month-to-month with no long-term
                                commitment required.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                How does the premium feature setup work?
                            </h3>
                            <p className="text-gray-600">
                                After subscribing to Premium, we refresh your account session to properly configure all premium features. This ensures you get immediate access to all benefits with optimal performance.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Premium Confirmation Modal */}
                <PremiumConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handlePremiumConfirm}
                />
            </div>
        </div>
    );
}

export default Subscription;
