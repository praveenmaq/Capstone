import { Provider } from "react-redux";
import "./App.css";
import Auth from "./components/Auth/Auth";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import store from "./app/store.js";
import Products from "./pages/Products.jsx";
import Header from "./components/Header";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import Cart from "./pages/Cart.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Order from "./pages/Order.jsx";
import Subscription from "./pages/Subscription.jsx";
import Profile from "./pages/Profile.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { userToken, userInfo } = useSelector((state) => state.auth);

    if (!userToken) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userInfo?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const AppContent = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className={`flex flex-col min-h-screen ${isAdminRoute ? 'bg-gray-50' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
            {!isAdminRoute && <Header />}
            <main className="flex-1 relative">
                {/* Background Pattern for non-admin routes */}
                {!isAdminRoute && (
                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full blur-2xl"></div>
                    </div>
                )}

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/products" element={<Products />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/products/:productId" element={<ProductDetail />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                                <div className="text-center p-12">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                        <span className="text-white text-4xl font-bold">404</span>
                                    </div>
                                    <h1 className="text-4xl font-black text-gray-800 mb-4">Page Not Found</h1>
                                    <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                                    <Link to="/" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg">
                                        Return to Home
                                    </Link>
                                </div>
                            </div>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Order />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/premium"
                        element={
                            <ProtectedRoute>
                                <Subscription />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
            {!isAdminRoute && <Footer />}
        </div>
    );
};

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </Provider>
    );
}

export default App;
