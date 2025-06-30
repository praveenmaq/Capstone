import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiPhone,
  FiMapPin,
  FiUser,
  FiDollarSign
} from "react-icons/fi";
import { fetchOrders } from "../feature/order/orderActions";
import {
  getOrderStatusLabel,
  getPaymentStatusLabel,
  getPaymentMethodLabel,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "../utils/enums";

function Order() {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const { orders, loading: ordersLoading } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  useEffect(() => {
    if (!ordersLoading && Array.isArray(orders)) {
      setLoading(false);
      setFilteredOrders(orders);
    }
  }, [ordersLoading, orders]);

  useEffect(() => {
    let filtered = Array.isArray(orders) ? [...orders] : [];

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (order) => getOrderStatusLabel(order.status) === statusFilter
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toString().includes(searchQuery.toLowerCase()) ||
          (order.items &&
            order.items.some((item) =>
              item.productName?.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= filterDate;
      });
    }

    setFilteredOrders(filtered);
  }, [statusFilter, searchQuery, dateFilter, orders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 1: return <FiCheckCircle className="text-green-500" />;
      case 0: return <FiClock className="text-yellow-500" />;
      case 2: return <FiXCircle className="text-red-500" />;
      case 3: return <FiTruck className="text-blue-500" />;
      default: return <FiPackage className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 rounded flex-1"></div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <p className="text-gray-500">Track and manage your orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
              <option value="Shipped">Shipped</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <FiCalendar className="absolute left-3 top-3 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FiPackage className="mx-auto h-10 w-10 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500 mb-6">
            {orders?.length === 0
              ? "You haven't placed any orders yet."
              : "No orders match your current filters."}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            <FiShoppingBag className="mr-2" />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Order #{order.orderId}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{order.totalAmount.toLocaleString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getOrderStatusColor(
                      order.status
                    )}`}
                  >
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FiPackage className="text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {item.productName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × ₹{item.unitPrice}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-800">
                        ₹{item.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">Payment</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method:</span>
                      <span>{getPaymentMethodLabel(order.paymentmethod)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`${getPaymentStatusColor(
                          order.paymentstatus
                        )}`}
                      >
                        {getPaymentStatusLabel(order.paymentstatus)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">Customer</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span>{order?.username || "N/A"}</span>
                    </div>
                    {order?.address && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Address:</span>
                        <span className="text-right truncate ml-2">
                          {order.address.split(',')[0]}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Stats */}
      {orders && orders.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center space-x-2">
              <FiCheckCircle className="text-green-500" />
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <p className="text-xl font-semibold mt-1">
              {orders.filter(o => getOrderStatusLabel(o.status) === "Completed").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center space-x-2">
              <FiClock className="text-yellow-500" />
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <p className="text-xl font-semibold mt-1">
              {orders.filter(o => getOrderStatusLabel(o.status) === "Pending").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center space-x-2">
              <FiXCircle className="text-red-500" />
              <span className="text-sm text-gray-500">Failed</span>
            </div>
            <p className="text-xl font-semibold mt-1">
              {orders.filter(o => getOrderStatusLabel(o.status) === "Failed").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center space-x-2">
              <FiDollarSign className="text-blue-500" />
              <span className="text-sm text-gray-500">Total Spent</span>
            </div>
            <p className="text-xl font-semibold mt-1">
              ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
