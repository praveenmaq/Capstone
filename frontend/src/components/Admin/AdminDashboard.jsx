import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddProduct from "./AddProduct";
import AddCategory from "./AddCategory";
import ManageProducts from "./ManageProducts";
import ImageUpload from "./ImageUpload";
import DashboardStats from "./DashboardStats";
import {
    PlusIcon,
    TagIcon,
    CubeIcon,
    ChartBarIcon,
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
} from "@heroicons/react/24/outline";
import Cart from "../../pages/Cart";
import { FiShoppingCart } from "react-icons/fi";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { error } = useSelector((state) => state.admin);

    const navigateToHome = () => {
        window.location.href = '/'; // Navigate to home page
    };

    const tabs = [
        { id: "home", label: "Switch to user View", icon: HomeIcon, action: navigateToHome },
        { id: "dashboard", label: "Dashboard", icon: ChartBarIcon },
        { id: "addProduct", label: "Add Product", icon: PlusIcon },
        { id: "addCategory", label: "Add Category", icon: TagIcon },
        { id: "manageProducts", label: "Manage Products", icon: CubeIcon },
        { id: "cart", label: "Cart", icon: FiShoppingCart },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardStats />;
            case "addProduct":
                return (
                    <>
                        <ImageUpload />
                        <AddProduct />
                    </>
                );
            case "addCategory":
                return (
                    <>
                        <ImageUpload />
                        <AddCategory />
                    </>
                );
            case "manageProducts":
                return <ManageProducts />;
            case "cart":
                return <Cart />;
            default:
                return null;
        }
    };

    return (
        <div className="flex bg-white min-h-screen">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200 transform lg:translate-x-0 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:static lg:inset-0`}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                        <p className="text-xs text-gray-500">Management Dashboard</p>
                    </div>
                    <button
                        className="lg:hidden p-1 text-gray-500 hover:text-gray-700 rounded"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <nav className="mt-4 px-4">
                    {tabs.map(({ id, label, icon: Icon, action }) => (
                        <button
                            key={id}
                            onClick={() => {
                                if (action) {
                                    // Special action (like navigate to home)
                                    action();
                                } else {
                                    // Regular tab switch
                                    setActiveTab(id);
                                }
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-sm font-medium transition-all duration-200 ${activeTab === id
                                ? "bg-blue-600 text-white shadow-md"
                                : id === "home"
                                    ? "text-gray-700 hover:bg-green-100 hover:text-green-700"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-6">
                {/* Mobile menu button */}
                <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
                    <button
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                </div>

                {/* Error alert */}
                {error && (
                    <div className="mx-4 mt-4">
                        <div className="flex items-center gap-3 p-4 border-l-4 border-red-500 bg-red-50 rounded-lg">
                            <span className="text-red-500 text-lg">⚠</span>
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Content */}
                <main className="flex-1 p-4 lg:p-6 max-w-full overflow-hidden bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {renderTabContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
