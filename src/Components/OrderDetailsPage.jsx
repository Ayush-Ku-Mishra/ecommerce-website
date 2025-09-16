import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaDownload,
} from "react-icons/fa";
import { MdLocalShipping, MdLocationOn } from "react-icons/md";
import axios from "axios";
import AccountDetailsSection from "./AccountDetailsSection";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/order-list`,
          { withCredentials: true }
        );

        if (response.data.success) {
          const foundOrder = response.data.data.find(
            (order) => order.orderId === orderId
          );
          setOrder(foundOrder);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const downloadInvoice = () => {
    // Create invoice content
    const invoiceContent = `
    INVOICE - Order #${order.orderId}
    
    Order Date: ${new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
    
    Customer Details:
    Name: ${order.delivery_address?.name}
    Phone: ${order.delivery_address?.phone}
    Address: ${order.delivery_address?.address_line}, ${
      order.delivery_address?.locality
    }, ${order.delivery_address?.city}, ${order.delivery_address?.state} - ${
      order.delivery_address?.pincode
    }
    
    Order Items:
    ${order.products
      ?.map(
        (product, index) =>
          `${index + 1}. ${product.name} (${product.brand})
      Size: ${product.selectedSize}
      Quantity: ${product.quantity}
      Price: ₹${product.price} each
      Total: ₹${(product.price * product.quantity).toFixed(2)}`
      )
      .join("\n\n")}
    
    Order Summary:
    Subtotal: ₹${Number(order.subTotal_amount || 0).toFixed(2)}
    Shipping: FREE
    Total Amount: ₹${Number(order.TotalAmount).toFixed(2)}
    
    Payment Method: ${
      order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"
    }
    Order Status: ${order.status}
    Invoice Receipt: ${order.invoice_receipt}
    `;

    // Create and download the file
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice_${order.orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getStatusInfo = (status, paymentMethod) => {
    // Different status mapping for COD vs Online Payment
    if (paymentMethod === "COD") {
      const codStatusMap = {
        pending: { label: "Order Placed", color: "blue", progress: 25 },
        processing: { label: "Processing", color: "yellow", progress: 50 },
        shipped: { label: "Shipped", color: "purple", progress: 75 },
        delivered: { label: "Delivered & Paid", color: "green", progress: 100 },
        cancelled: { label: "Cancelled", color: "red", progress: 0 },
      };
      return (
        codStatusMap[status] || { label: "Unknown", color: "gray", progress: 0 }
      );
    } else {
      // Online payment status mapping
      const onlineStatusMap = {
        pending: { label: "Order Placed", color: "blue", progress: 20 },
        paid: { label: "Payment Confirmed", color: "green", progress: 40 },
        processing: { label: "Processing", color: "yellow", progress: 60 },
        shipped: { label: "Shipped", color: "purple", progress: 80 },
        delivered: { label: "Delivered", color: "green", progress: 100 },
        cancelled: { label: "Cancelled", color: "red", progress: 0 },
      };
      return (
        onlineStatusMap[status] || {
          label: "Unknown",
          color: "gray",
          progress: 0,
        }
      );
    }
  };

  const OrderStatusTracker = ({ currentStatus, orderDate, paymentMethod }) => {
    // Different steps for COD vs Online Payment
    const getStepsForPaymentMethod = (paymentMethod) => {
      if (paymentMethod === "COD") {
        return [
          {
            key: "pending",
            label: "Order Placed",
            icon: FaCheckCircle,
            description: "Your COD order has been received",
          },
          {
            key: "processing",
            label: "Processing",
            icon: FaBox,
            description: "Your order is being prepared",
          },
          {
            key: "shipped",
            label: "Shipped",
            icon: FaTruck,
            description: "Your order is on its way",
          },
          {
            key: "delivered",
            label: "Delivered & Paid",
            icon: FaCheckCircle,
            description: "Order delivered and payment collected",
          },
        ];
      } else {
        return [
          {
            key: "pending",
            label: "Order Placed",
            icon: FaCheckCircle,
            description: "Your order has been received",
          },
          {
            key: "paid",
            label: "Payment Confirmed",
            icon: FaCheckCircle,
            description: "Payment has been verified",
          },
          {
            key: "processing",
            label: "Processing",
            icon: FaBox,
            description: "Your order is being prepared",
          },
          {
            key: "shipped",
            label: "Shipped",
            icon: FaTruck,
            description: "Your order is on its way",
          },
          {
            key: "delivered",
            label: "Delivered",
            icon: FaCheckCircle,
            description: "Order has been delivered",
          },
        ];
      }
    };

    const steps = getStepsForPaymentMethod(paymentMethod);

    const getCurrentStepIndex = (status, paymentMethod) => {
      if (paymentMethod === "COD") {
        const codStatusOrder = [
          "pending",
          "processing",
          "shipped",
          "delivered",
        ];
        return codStatusOrder.indexOf(status);
      } else {
        const onlineStatusOrder = [
          "pending",
          "paid",
          "processing",
          "shipped",
          "delivered",
        ];
        return onlineStatusOrder.indexOf(status);
      }
    };

    const currentStepIndex = getCurrentStepIndex(currentStatus, paymentMethod);

    return (
      <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
            Order Status
          </h3>
          {paymentMethod === "COD" && (
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full w-fit">
              Cash on Delivery
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6 lg:mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-blue-600">
              {getStatusInfo(currentStatus, paymentMethod).progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  getStatusInfo(currentStatus, paymentMethod).progress
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Status Steps */}
        <div className="space-y-3 lg:space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div key={step.key} className="flex items-start relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-5 lg:left-6 top-8 w-0.5 h-6 lg:h-8 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}

                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center z-10 ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                      ? "bg-blue-500 text-white ring-4 ring-blue-100"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <Icon size={16} className="lg:w-5 lg:h-5" />
                </div>

                {/* Content */}
                <div className="ml-3 lg:ml-4 pb-4 flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <h4
                      className={`font-semibold text-sm lg:text-base ${
                        isCompleted || isCurrent
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full w-fit">
                        Current
                      </span>
                    )}
                    {isCompleted && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full w-fit">
                        Completed
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      isCompleted || isCurrent
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                  {isCompleted && index === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Estimated Delivery */}
        {currentStatus !== "delivered" && currentStatus !== "cancelled" && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FaClock className="text-blue-600" />
              <span className="font-medium text-blue-800 text-sm lg:text-base">
                Estimated Delivery
              </span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              {paymentMethod === "COD"
                ? "3-5 business days from order confirmation"
                : "2-4 business days from payment confirmation"}
            </p>
            {paymentMethod === "COD" && (
              <p className="text-xs text-orange-600 mt-1 font-medium">
                Payment will be collected upon delivery
              </p>
            )}
          </div>
        )}

        {/* Delivery Confirmation for COD */}
        {currentStatus === "delivered" && paymentMethod === "COD" && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              <span className="font-medium text-green-800 text-sm lg:text-base">
                Order Completed
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your order has been delivered and payment has been collected
              successfully.
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 lg:bg-white relative pb-20 lg:pb-0">
        <section className="flex flex-col lg:flex-row gap-0 lg:gap-10 p-4 lg:ml-10 lg:mt-2 max-w-[1190px] mx-auto mb-8">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:flex-shrink-0 lg:min-w-[20%] lg:w-auto lg:sticky lg:top-28 lg:self-start">
            <AccountDetailsSection />
          </div>
          <div className="w-full lg:w-[80%]">
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md border-0 lg:border p-6">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4 text-center">
                Order Not Found
              </h2>
              <p className="text-gray-600 mb-6 text-center px-4">
                The requested order could not be found.
              </p>
              <button
                onClick={() => navigate("/account/orders")}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Back to My Orders
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status, order.paymentMethod);

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-white">
      <section className="flex flex-col lg:flex-row gap-0 lg:gap-10 lg:ml-10 lg:mt-2 max-w-[1190px] mx-auto lg:mb-8">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block lg:flex-shrink-0 lg:min-w-[20%] lg:w-auto lg:sticky lg:top-28 lg:self-start">
          <AccountDetailsSection />
        </div>

        <div className="w-full lg:w-[80%] space-y-4 lg:space-y-6 lg:mt-5">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md border-0 lg:border p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <button
                onClick={() => navigate("/account/orders")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 w-fit"
              >
                <FaArrowLeft />
                <span>Back to Orders</span>
              </button>
              <div className="text-left sm:text-right">
                <p className="text-sm text-gray-500">Order placed on</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-md lg:text-2xl font-bold text-gray-800 mb-2 truncate">
                  Order #{order.orderId}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800 w-fit`}
                  >
                    {statusInfo.label}
                  </span>
                  <span className="text-gray-600 text-sm">
                    Payment:{" "}
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </span>
                </div>
              </div>
              <div className="text-left lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0">
                <p className="text-2xl font-bold text-blue-600">
                  ₹{Number(order.TotalAmount).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {order.products?.length} item
                  {order.products?.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Order Status Tracker */}
            <OrderStatusTracker
              currentStatus={order.status}
              orderDate={order.createdAt}
              paymentMethod={order.paymentMethod}
            />

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-md border-0 lg:border p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <MdLocationOn className="text-blue-600" />
                Delivery Address
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-800 truncate">
                  {order.delivery_address?.name}
                </p>
                <p className="text-gray-600 truncate">
                  {order.delivery_address?.phone}
                </p>
                <div className="text-gray-600 text-sm">
                  <p className="truncate">
                    {order.delivery_address?.address_line}
                  </p>
                  <p className="truncate">{order.delivery_address?.locality}</p>
                  <p className="truncate">
                    {order.delivery_address?.city},{" "}
                    {order.delivery_address?.state} -{" "}
                    {order.delivery_address?.pincode}
                  </p>
                </div>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-2">
                  {order.delivery_address?.type || "Home"}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md border-0 lg:border">
            <div className="p-4 lg:p-6 border-b">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800">
                Order Items
              </h3>
            </div>
            <div className="p-4 lg:p-6">
              <div className="space-y-4">
                {order.products?.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 border border-gray-200 rounded-lg"
                  >
                    {/* Clickable Product Image */}
                    <Link
                      to={`/product/${product.productId}`}
                      className="block hover:opacity-80 transition-opacity flex-shrink-0"
                      title={`View ${product.name}`}
                    >
                      <img
                        src={product.image || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg object-cover border-2 border-transparent hover:border-blue-300 transition-all duration-200 cursor-pointer"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm lg:text-base truncate">
                        {product.name}
                      </h4>
                      {product.brand && (
                        <p className="text-sm text-blue-600 font-medium truncate">
                          {product.brand}
                        </p>
                      )}
                      <p className="text-xs lg:text-sm text-gray-600">
                        Size: {product.selectedSize || "N/A"}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-600">
                        Qty: {product.quantity}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-gray-800 text-sm lg:text-base">
                        ₹
                        {Number(
                          product.price * product.quantity
                        ).toLocaleString()}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        ₹{Number(product.price).toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2 text-sm lg:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">
                    ₹{Number(order.subTotal_amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2 text-sm lg:text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                  <span className="text-gray-800">Total</span>
                  <span className="text-blue-600">
                    ₹{Number(order.TotalAmount).toLocaleString()}
                  </span>
                </div>
                {order.paymentMethod === "COD" && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800 font-medium">
                      💰 Cash on Delivery - Payment to be collected upon
                      delivery
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Download Section */}
          {/* Invoice Download Section */}
          <div className="bg-white rounded-lg shadow-md border-0 lg:border p-4 lg:p-6 lg:block hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Invoice & Receipt
                </h3>
                <p className="text-sm text-gray-600">
                  Download your order invoice for records
                </p>
              </div>
              <button
                onClick={downloadInvoice}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
              >
                <FaDownload size={16} />
                Download Invoice
              </button>
            </div>
          </div>

          {/* Fixed Mobile Download Button */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 safe-area-pb">
            <button
              onClick={downloadInvoice}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full shadow-lg"
            >
              <FaDownload size={16} />
              Download Invoice
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderDetailPage;
