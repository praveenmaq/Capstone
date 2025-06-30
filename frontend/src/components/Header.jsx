import React, { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { FiLogOut, FiPackage, FiUser, FiStar, FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../feature/auth/authActions";
import { fetchCart } from "../feature/cart/cartActions";
import { Link, useNavigate } from "react-router-dom";
import { setSearchQuery } from "../feature/product/productActions";

const UserDropdownWithState = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logoutUser());
        setIsOpen(false);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition-all duration-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                    <FiUser className="text-white text-sm" />
                </div>
                <span className="hidden lg:block text-sm font-medium text-slate-700">
                    {userInfo?.name?.split(' ')[0] || 'User'}
                </span>
            </div>

            <div
                className={`absolute right-0 top-full mt-3 w-64 bg-white border border-slate-200 rounded-xl shadow-lg transition-all duration-200 z-50 ${isOpen
                        ? "opacity-100 visible transform translate-y-0"
                        : "opacity-0 invisible transform -translate-y-2"
                    }`}
            >
                <div className="px-4 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <FiUser className="text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-slate-800">{userInfo?.name}</p>
                            <p className="text-xs text-slate-600">{userInfo?.email}</p>
                            {userInfo?.role === "Premium" && (
                                <div className="mt-1 inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    <FiStar className="text-xs" />
                                    Premium
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="py-2">
                    {userInfo?.role === "Normal" && (
                        <>
                            <Link
                                to="/premium"
                                onClick={closeDropdown}
                                className="flex items-center gap-3 mx-2 px-3 py-2 text-sm bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 hover:from-amber-100 hover:to-orange-100 transition-all duration-200 rounded-lg border-l-4 border-amber-500"
                            >
                                <FiStar className="text-amber-600" />
                                <div>
                                    <span className="font-semibold">Upgrade to Premium</span>
                                    <p className="text-xs text-amber-600">Get exclusive benefits!</p>
                                </div>
                            </Link>
                            <hr className="my-2 border-slate-100" />
                        </>
                    )}

                    <Link
                        to="/profile"
                        onClick={closeDropdown}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <FiUser className="text-indigo-600" />
                        <span className="font-medium">My Profile</span>
                    </Link>

                    <Link
                        to="/orders"
                        onClick={closeDropdown}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <FiPackage className="text-indigo-600" />
                        <span className="font-medium">
                            {userInfo?.role === "Admin" ? "Manage Orders" : "My Orders"}
                        </span>
                    </Link>

                    <hr className="my-2 border-slate-100" />

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                    >
                        <FiLogOut />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

function Header() {
    const { userToken, userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // Get cart items and calculate total quantity
    const { cartItems } = useSelector((state) => state.cart);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { searchInput } = useSelector((state) => state.product);
    const navigate = useNavigate();

    // Calculate total cart items
    const getTotalCartItems = () => {
        if (!cartItems || cartItems.length === 0) return 0;
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    useEffect(() => {
        if (userToken) {
            dispatch(fetchCart());
        }
    }, [dispatch, userToken]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleSearch = () => {
        navigate(`/products`);
    };

    const totalCartItems = getTotalCartItems();

    return (
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
            {/* Top Bar */}


            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                                Shopify
                            </h1>
                            {userInfo?.role === "Premium" && (
                                <span className="text-xs bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-0.5 rounded-full font-medium">
                                    Premium
                                </span>
                            )}
                        </div>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <CiSearch className="text-slate-400 text-xl" />
                            </div>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                                placeholder="Search for products, brands and more..."
                                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-slate-50 hover:bg-white"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute inset-y-0 right-0 pr-2 flex items-center"
                            >
                                <div className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm">
                                    Search
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        {userInfo?.role === "Normal" && (
                            <Link to="/premium">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium text-sm shadow-sm">
                                    <FiStar className="text-sm" />
                                    <span>Go Premium</span>
                                </div>
                            </Link>
                        )}

                        {!userToken && (
                            <Link to="/auth">
                                <div className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-colors duration-200 font-medium">
                                    <FiUser className="text-xl" />
                                    <span>Sign In</span>
                                </div>
                            </Link>
                        )}

                        {userToken && <UserDropdownWithState />}

                        {userInfo?.role === "Admin" && (
                            <Link to="/admin">
                                <div className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm">
                                    Admin Dashboard
                                </div>
                            </Link>
                        )}

                        {userInfo?.role !== "Admin" && (
                            <Link to="/cart">
                                <div className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-colors duration-200 relative group">
                                    <IoCartOutline className="text-2xl transition-transform duration-200 group-hover:scale-110" />
                                    <span className="font-medium">Cart</span>
                                    {totalCartItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-lg animate-pulse">
                                            {totalCartItems > 99 ? '99+' : totalCartItems}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-3">
                        <Link to="/cart" className="relative group">
                            <IoCartOutline className="text-2xl text-slate-700 transition-transform duration-200 group-hover:scale-110" />
                            {totalCartItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-lg animate-pulse">
                                    {totalCartItems > 99 ? '99+' : totalCartItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={toggleMobileMenu}
                            className="text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <FiMenu className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden mt-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <CiSearch className="text-slate-400 text-xl" />
                        </div>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                            placeholder="Search for products..."
                            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-slate-50"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4">
                    <div className="flex flex-col gap-4">
                        {userInfo?.role === "Normal" && (
                            <Link to="/premium" onClick={() => setIsMobileMenuOpen(false)}>
                                <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-lg font-medium">
                                    <FiStar className="text-lg" />
                                    <span>Upgrade to Premium</span>
                                </div>
                            </Link>
                        )}

                        {!userToken && (
                            <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                                <div className="flex items-center gap-3 py-3 text-slate-700 font-medium">
                                    <FiUser className="text-xl text-indigo-600" />
                                    <span>Sign In / Sign Up</span>
                                </div>
                            </Link>
                        )}

                        {userToken && (
                            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                <div className="flex items-center gap-3 py-3 text-slate-700 font-medium">
                                    <FiUser className="text-xl text-indigo-600" />
                                    <span>My Profile</span>
                                </div>
                            </Link>
                        )}

                        {userInfo?.role === "Admin" && (
                            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                                <div className="flex items-center gap-3 py-3 text-slate-700 font-medium">
                                    <span>Admin Dashboard</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
