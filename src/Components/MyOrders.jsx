import React, { useState, useEffect, useMemo } from "react";
import AccountDetailsSection from "./AccountDetailsSection";
import ContactUsPart from "./ContactUsPart";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaCalendar,
  FaTag,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCreditCard,
  FaEye,
} from "react-icons/fa";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/order-list`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((order) => {
        // Search in order ID
        if (order.orderId.toLowerCase().includes(searchLower)) return true;

        // Search in product names
        if (
          order.products?.some((product) =>
            product.name.toLowerCase().includes(searchLower)
          )
        )
          return true;

        // Search in product brands
        if (
          order.products?.some((product) =>
            product.brand.toLowerCase().includes(searchLower)
          )
        )
          return true;

        // Search in customer name
        if (order.delivery_address?.name.toLowerCase().includes(searchLower))
          return true;

        // Search in customer phone
        if (order.delivery_address?.phone.includes(searchTerm)) return true;

        // Search in payment method
        if (order.paymentMethod.toLowerCase().includes(searchLower))
          return true;

        return false;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);

        switch (dateFilter) {
          case "last7days":
            const sevenDaysAgo = new Date(
              now.getTime() - 7 * 24 * 60 * 60 * 1000
            );
            return orderDate >= sevenDaysAgo;
          case "last30days":
            const thirtyDaysAgo = new Date(
              now.getTime() - 30 * 24 * 60 * 60 * 1000
            );
            return orderDate >= thirtyDaysAgo;
          case "last90days":
            const ninetyDaysAgo = new Date(
              now.getTime() - 90 * 24 * 60 * 60 * 1000
            );
            return orderDate >= ninetyDaysAgo;
          case "thisYear":
            return orderDate.getFullYear() === now.getFullYear();
          case "lastYear":
            return orderDate.getFullYear() === now.getFullYear() - 1;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const toggleRow = (orderId) => {
    if (expandedRow === orderId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(orderId);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "paid":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getAddressType = (addressType) => {
    return addressType || "Home";
  };

  const getOrderPreviewImage = (products) => {
    if (products && products.length > 0 && products[0].image) {
      return products[0].image;
    }
    return "https://via.placeholder.com/60x60?text=No+Image";
  };

  const getProductCountText = (products) => {
    if (!products || products.length === 0) return "No items";
    if (products.length === 1) return "1 item";
    return `${products.length} items`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (statusFilter !== "all") count++;
    if (dateFilter !== "all") count++;
    return count;
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "last7days", label: "Last 7 days" },
    { value: "last30days", label: "Last 30 days" },
    { value: "last90days", label: "Last 90 days" },
    { value: "thisYear", label: "This Year" },
    { value: "lastYear", label: "Last Year" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-white">
      <section className="flex flex-col lg:flex-row gap-0 lg:gap-10 lg:ml-10 lg:mt-2 max-w-[1190px] mx-auto lg:mb-8">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block lg:flex-shrink-0 lg:min-w-[20%] lg:w-auto lg:sticky lg:top-28 lg:self-start">
          <AccountDetailsSection />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-[80%]">
          <div className="lg:mt-5 mt-0 bg-white rounded-lg lg:shadow-md border-0 lg:border border-gray-200">
            <div className="p-4 lg:py-5 lg:px-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-xl lg:text-2xl font-semibold mb-2">
                    My Orders
                  </h1>
                  <p className="text-sm lg:text-lg text-gray-600">
                    Showing{" "}
                    <span className="text-blue-600 font-semibold">
                      {filteredOrders.length}
                    </span>{" "}
                    of{" "}
                    <span className="text-red-500 font-semibold">
                      {orders.length}
                    </span>{" "}
                    orders
                  </p>
                </div>

                {/* Active filters indicator */}
                {getActiveFiltersCount() > 0 && (
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className="text-sm text-gray-500">
                      {getActiveFiltersCount()} filter
                      {getActiveFiltersCount() !== 1 ? "s" : ""} active
                    </span>
                    <button
                      onClick={clearFilters}
                      className="text-red-500 hover:text-red-700 text-sm underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Search and Filter Bar */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>

                  {/* Filter Toggle Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      showFilters
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FaFilter className="h-4 w-4" />
                    Filters
                    {getActiveFiltersCount() > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </button>
                </div>

                {/* Filter Options */}
                {showFilters && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Status Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaTag className="inline h-4 w-4 mr-1" />
                          Order Status
                        </label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FaCalendar className="inline h-4 w-4 mr-1" />
                          Order Date
                        </label>
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          {dateOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Orders Display */}
              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[280px]">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3500/3500833.png"
                    alt="No Orders"
                    className="w-28 h-28 opacity-40 mb-4"
                  />
                  <p className="text-gray-500 text-lg mb-2 text-center px-4">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    dateFilter !== "all"
                      ? "No orders match your search criteria."
                      : "You have no orders yet."}
                  </p>
                  {searchTerm ||
                  statusFilter !== "all" ||
                  dateFilter !== "all" ? (
                    <button
                      onClick={clearFilters}
                      className="text-white bg-blue-500 px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 mt-3"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <Link
                      to="/"
                      className="text-white bg-red-500 px-6 py-2 rounded-lg font-semibold hover:bg-red-600 mt-3"
                    >
                      Shop Now
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  {/* Desktop Table View - Hidden on mobile */}
                  <div className="hidden lg:block relative overflow-x-auto">
                    <div className="mt-5 min-w-0 w-full">
                      <div className="w-full h-[500px] overflow-x-auto overflow-y-auto custom-scrollbar">
                        <table className="min-w-[800px] md:min-w-[1100px] w-full text-xs md:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          <thead className="text-xs md:text-sm uppercase text-[#f1f1f1] bg-gray-800 sticky top-0 z-10">
                            <tr>
                              <th
                                scope="col"
                                className="px-2 md:px-6 py-3 whitespace-nowrap"
                              >
                                Product Preview
                              </th>
                              <th
                                scope="col"
                                className="px-2 md:px-6 py-0 whitespace-nowrap"
                              >
                                Order Id
                              </th>
                              <th
                                scope="col"
                                className="px-2 md:px-6 py-3 whitespace-nowrap"
                              >
                                Payment Id
                              </th>
                              <th
                                scope="col"
                                className="px-2 md:px-6 py-3 whitespace-nowrap"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-2 md:px-6 py-3 whitespace-nowrap"
                              >
                                Phone Number
                              </th>
                              <th
                                scope="col"
                                className="px-2 md:px-6 py-3 whitespace-nowrap"
                              >
                                Address
                              </th>
                              <th
                                scope="col"
                                className="px-2 md:px-6 py-3 whitespace-nowrap"
                              >
                                Pincode
                              </th>
                              <th
                                scope="col"
                                className="px-2 md:px-6 py-3 whitespace-nowrap"
                              >
                                Total Amount
                              </th>

                              <th
                                scope="col"
                                className="px-2 md:px-6 py-3 whitespace-nowrap"
                              >
                                Order Status
                              </th>
                              <th
                                scope="col"
                                className="px-2 md:px-6 py-3 whitespace-nowrap"
                              >
                                Payment Mode
                              </th>
                              <th
                                scope="col"
                                className="px-2 md:px-6 py-3 whitespace-nowrap"
                              >
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {filteredOrders.map((order, index) => (
                              <React.Fragment key={order.orderId + index}>
                                <tr
                                  key={index}
                                  onClick={() =>
                                    navigate(`/account/orders/${order.orderId}`)
                                  }
                                  className="border-b border-gray-200 transition hover:bg-blue-50 cursor-pointer"
                                >
                                  {/* Product Preview Column */}
                                  <td className="px-2 md:px-6 py-3">
                                    <div className="flex items-center space-x-3">
                                      <div className="relative">
                                        <img
                                          src={getOrderPreviewImage(
                                            order.products
                                          )}
                                          alt={
                                            order.products?.[0]?.name ||
                                            "Product"
                                          }
                                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md border border-gray-200 shadow-sm"
                                          onError={(e) => {
                                            e.target.src =
                                              "https://via.placeholder.com/60x60?text=No+Image";
                                          }}
                                        />
                                        {order.products &&
                                          order.products.length > 1 && (
                                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                              +{order.products.length - 1}
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Order ID */}
                                  <td className="px-2 md:px-6 py-3">
                                    <span className="font-semibold text-blue-500 whitespace-nowrap text-xs">
                                      {order.orderId}
                                    </span>
                                  </td>

                                  {/* Payment ID */}
                                  <td className="px-2 md:px-6 py-3 whitespace-nowrap text-[12px] md:text-[14px] text-gray-700">
                                    {order.paymentId || "N/A"}
                                  </td>

                                  {/* Name */}
                                  <td className="px-2 md:px-6 py-3 whitespace-nowrap text-[12px] md:text-[14px] text-gray-800">
                                    {order.delivery_address?.name || "N/A"}
                                  </td>

                                  {/* Phone */}
                                  <td className="px-2 md:px-6 py-3 whitespace-nowrap text-[12px] md:text-[14px] text-gray-600">
                                    {order.delivery_address?.phone || "N/A"}
                                  </td>

                                  {/* Address */}
                                  <td className="px-2 md:px-6 py-3 text-[12px] md:text-[13px] text-gray-500">
                                    <span className="inline-block text-[11px] md:text-[13px] font-[500] p-1 rounded-md bg-blue-500 text-white">
                                      {getAddressType(
                                        order.delivery_address?.type
                                      )}
                                    </span>
                                    <span className="block w-[400px]">
                                      {order.delivery_address
                                        ? `${order.delivery_address.address_line}, ${order.delivery_address.locality}, ${order.delivery_address.city}, ${order.delivery_address.state}`
                                        : "N/A"}
                                    </span>
                                  </td>

                                  {/* Pincode */}
                                  <td className="px-2 md:px-6 py-3 whitespace-nowrap text-gray-600">
                                    {order.delivery_address?.pincode || "N/A"}
                                  </td>

                                  {/* Amount */}
                                  <td className="px-2 md:px-6 py-3 whitespace-nowrap font-semibold text-blue-600">
                                    ₹{Number(order.TotalAmount).toFixed(2)}
                                  </td>

                                  {/* Status Badge */}
                                  <td className="px-2 md:px-6 py-3 whitespace-nowrap">
                                    <span
                                      className={`inline-block px-3 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-semibold capitalize ${getStatusBadgeClass(
                                        order.status
                                      )}`}
                                    >
                                      {order.status || "pending"}
                                    </span>
                                  </td>

                                  {/* Payment Mode */}
                                  <td className="px-2 md:px-6 py-3 whitespace-nowrap text-[12px] md:text-[14px] font-semibold text-green-800">
                                    {order.paymentMethod === "COD"
                                      ? "Cash On Delivery"
                                      : "Online Payment"}
                                  </td>

                                  {/* Date */}
                                  <td className="px-2 md:px-6 py-3 whitespace-nowrap text-[11px] md:text-[13px] text-gray-500">
                                    {new Date(order.createdAt).toLocaleString(
                                      "en-IN",
                                      {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      }
                                    )}
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Card View - Shown only on mobile */}
                  <div className="lg:hidden space-y-4">
                    {filteredOrders.map((order, index) => (
                      <div
                        key={order.orderId + index}
                        className="bg-white divide-y border-t-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-4">
                          <div className="flex gap-4">
                            {/* Left Side - Image */}
                            <div className="flex-shrink-0">
                              <div className="relative">
                                <img
                                  src={getOrderPreviewImage(order.products)}
                                  alt={order.products?.[0]?.name || "Product"}
                                  className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/64x64?text=No+Image";
                                  }}
                                />
                                {order.products &&
                                  order.products.length > 1 && (
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                      +{order.products.length - 1}
                                    </div>
                                  )}
                              </div>
                            </div>

                            {/* Right Side - Order Info */}
                            <div className="flex-1 min-w-0 space-y-2">
                              {/* Payment ID */}
                              <div>
                                <p className="text-xs text-gray-500">
                                  Order ID
                                </p>
                                <p className="font-semibold text-blue-600 text-sm truncate">
                                  {order.orderId}
                                </p>
                              </div>

                              {/* Price and Status */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Amount
                                  </p>
                                  <p className="font-bold text-blue-600 text-lg">
                                    ₹{Number(order.TotalAmount).toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeClass(
                                      order.status
                                    )}`}
                                  >
                                    {order.status || "pending"}
                                  </span>
                                </div>
                              </div>

                              {/* Payment Info */}
                              <div>
                                <p className="text-xs text-gray-500">Payment</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-green-700 truncate">
                                    {order.paymentMethod === "COD"
                                      ? "Cash On Delivery"
                                      : "Online Payment"}
                                  </span>
                                  {order.paymentId && (
                                    <span className="text-xs text-gray-500 truncate ml-2 max-w-[100px]">
                                      {order.paymentId}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* View Details Button - Centered at bottom */}
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <button
                              onClick={() =>
                                navigate(`/account/orders/${order.orderId}`)
                              }
                              className="flex items-center justify-center w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                              <FaEye className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="text-sm font-medium text-blue-600">
                                View Details
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyOrders;
