import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaDownload,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import axios from "axios";
import AccountDetailsSection from "./AccountDetailsSection";
import OrderProductReview from "./OrderProductReview";
import "jspdf-autotable";
import { generateInvoicePDF } from "../utils/invoiceGenerator.jsx";
import toast from "react-hot-toast";
import OrderReturnSection from "./OrderReturnSection";
import OrderReturnProcess from "./OrderReturnProcess";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnDetails, setReturnDetails] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState(false);
  const [expandedItems, setExpandedItems] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const openCancelDialog = () => {
    setCancelDialogOpen(true);
  };

  const handleCancelOrder = async () => {
    setCancelDialogOpen(false);
    setCancelling(true);
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/payment/admin/update-order-status`,
        {
          orderId: order.orderId,
          status: "cancelled",
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        // Update the local state to reflect the cancellation
        setOrder((prev) => ({
          ...prev,
          status: "cancelled",
        }));
      } else {
        toast.error(response.data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  // Fetch order details
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

  // Fetch return details if they exist
  useEffect(() => {
    const fetchReturnDetails = async () => {
      if (!order || order.status !== "delivered") return;

      try {
        console.log("Checking for return details for order:", order.orderId);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/returns/check/${
            order.orderId
          }`,
          { withCredentials: true }
        );

        console.log("Return details response:", response.data);
        if (response.data.success && response.data.data) {
          setReturnDetails(response.data.data);
          console.log("Set return details:", response.data.data);
        }
      } catch (error) {
        console.log("No return found for this order or error:", error);
      }
    };

    fetchReturnDetails();
  }, [order]);

  const downloadInvoice = () => {
    try {
      const invoiceData = {
        orderDetails: {
          orderId: order.orderId,
          orderDate: order.createdAt,
          status: order.status,
        },
        address: order.delivery_address,
        cart: order.products.map((product) => ({
          title: product.name,
          selectedSize: product.selectedSize,
          quantity: product.quantity,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
        })),
        paymentMethod: order.paymentMethod,
      };

      const companyInfo = {
        name: "Pickora",
        address: "Patia, Bhubaneswar, Odisha, IN - 751029",
        email: "support@pickora.com",
        phone: "+91 9876543210",
        website: "Pickora.netlify.app",
        gstin: "27AAPCT3518Q1ZX",
      };

      generateInvoicePDF(invoiceData, companyInfo);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice. Please try again.");
    }
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

  const OrderStatusTracker = ({
    currentStatus,
    orderDate,
    paymentMethod,
    cancelling,
    handleCancelOrder,
  }) => {
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

                  {(isCompleted || isCurrent) && step.key === "delivered" && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.updatedAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
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
            {paymentMethod === "COD" && order.status !== "delivered" && (
              <p className="text-xs text-orange-600 mt-1 font-medium">
                Payment will be collected upon delivery
              </p>
            )}
          </div>
        )}

        {(currentStatus === "pending" ||
          currentStatus === "processing" ||
          currentStatus === "paid") && (
          <div className="mt-3">
            <button
              onClick={openCancelDialog}
              disabled={cancelling}
              className="w-full py-2 px-4 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              {cancelling ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Cancel Order</span>
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              You can cancel your order until it's shipped
            </p>
          </div>
        )}

        <Dialog
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
          aria-labelledby="cancel-dialog-title"
          aria-describedby="cancel-dialog-description"
          PaperProps={{
            style: {
              borderRadius: "12px",
              maxWidth: "500px",
            },
          }}
        >
          <DialogTitle id="cancel-dialog-title" sx={{ pb: 1 }}>
            <div className="text-lg font-semibold text-gray-800">
              Cancel Order
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="cancel-dialog-description" sx={{ mb: 2 }}>
              <div className="flex flex-col">
                <p className="text-gray-700 mb-3">
                  Are you sure you want to cancel this order? This action cannot
                  be undone.
                </p>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <span className="font-medium block mb-1">Note:</span>
                  You can only cancel your order before it's shipped. Once
                  shipped, you'll need to return the order after delivery.
                </p>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setCancelDialogOpen(false)}
              variant="outlined"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                borderColor: "rgb(209, 213, 219)",
                color: "rgb(75, 85, 99)",
                "&:hover": {
                  borderColor: "rgb(156, 163, 175)",
                  backgroundColor: "rgba(249, 250, 251, 0.8)",
                },
              }}
            >
              Keep Order
            </Button>
            <Button
              onClick={handleCancelOrder}
              variant="contained"
              sx={{
                bgcolor: "rgb(239, 68, 68)",
                color: "white",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgb(220, 38, 38)",
                },
              }}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel Order"}
            </Button>
          </DialogActions>
        </Dialog>

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

                  {/* Return & Exchange Quick Access Button - Only show for eligible orders */}
                  {order.status === "delivered" &&
                    new Date() - new Date(order.updatedAt) <
                      7 * 24 * 60 * 60 * 1000 &&
                    (!returnDetails ||
                      returnDetails.status === "cancelled") && (
                      <button
                        onClick={() => {
                          document
                            .getElementById("return-section")
                            .scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        }}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors mt-2 sm:mt-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Return & Exchange
                      </button>
                    )}
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
            {/* Order Status Tracker or Return Status Tracker */}
            {returnDetails &&
            returnDetails.status &&
            returnDetails.status !== "cancelled" ? (
              <OrderReturnProcess
                returnDetails={returnDetails}
                setReturnDetails={setReturnDetails}
              />
            ) : (
              <OrderStatusTracker
                currentStatus={order.status}
                orderDate={order.createdAt}
                paymentMethod={order.paymentMethod}
                cancelling={cancelling}
                handleCancelOrder={handleCancelOrder}
              />
            )}

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

          {/* Return Information Section - Show if there's a return for this order */}
          {returnDetails && (
            <div className="bg-white rounded-lg shadow-md border-0 lg:border p-4 lg:p-6 mt-4">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Return Information
              </h3>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      returnDetails.returnType === "refund"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {returnDetails.returnType === "refund"
                      ? "Refund"
                      : "Exchange"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      returnDetails.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : returnDetails.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {returnDetails.status.charAt(0).toUpperCase() +
                      returnDetails.status.slice(1).replace("_", " ")}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Return Reason:</span>{" "}
                  {returnDetails.reason}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Submitted On:</span>{" "}
                  {new Date(returnDetails.submitted_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                {returnDetails.returnType === "refund" &&
                  returnDetails.refund_amount > 0 && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Refund Amount:</span> ₹
                      {returnDetails.refund_amount.toLocaleString()}
                    </p>
                  )}
              </div>

              <h4 className="font-medium text-gray-800 mb-3">Returned Items</h4>
              <div className="space-y-3">
                {returnDetails.products.map((returnProduct, idx) => {
                  // Find matching product in the original order to get the image
                  const originalProduct = order.products.find(
                    (p) => p.productId === returnProduct.productId
                  );
                  const productImage =
                    originalProduct?.image || "/placeholder.jpg";

                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={productImage}
                            alt={returnProduct.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder.jpg";
                              e.target.onerror = null;
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 truncate">
                            {returnProduct.name}
                          </h4>
                          <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                            <p>Size: {returnProduct.currentSize}</p>
                            <p>Qty: {returnProduct.quantity}</p>
                            <p>
                              Price: ₹
                              {Number(returnProduct.price).toLocaleString()}
                            </p>
                          </div>

                          {returnDetails.returnType === "exchange" && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium text-indigo-600">
                                {returnProduct.newSize === "unavailable"
                                  ? "No size available for exchange"
                                  : `Exchange for size: ${returnProduct.newSize}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {returnDetails.status === "completed" && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium text-green-800">
                      {returnDetails.returnType === "refund"
                        ? "Refund has been processed"
                        : "Exchange has been completed"}
                    </span>
                  </div>
                  {returnDetails.returnType === "refund" &&
                    returnDetails.refund_id && (
                      <p className="text-sm text-green-700 mt-1">
                        Refund ID: {returnDetails.refund_id}
                      </p>
                    )}
                </div>
              )}

              {returnDetails.status === "cancelled" && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium text-red-800">
                      Return request has been cancelled
                    </span>
                  </div>
                  {returnDetails.cancellation_reason && (
                    <p className="text-sm text-red-700 mt-1">
                      Reason: {returnDetails.cancellation_reason}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md border-0 lg:border">
            <div className="p-4 lg:p-6 border-b">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800">
                Order Items
              </h3>
            </div>
            <div className="p-4 lg:p-6">
              <div className="space-y-4">
                {/* Show only first 3 products if not expanded and there are more than 3 products */}
                {(expandedItems || (order.products?.length || 0) <= 3
                  ? order.products
                  : order.products?.slice(0, 3)
                )?.map((product, index) => (
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

                {/* Show "View All" link if there are more products and not expanded */}
                {(order.products?.length || 0) > 3 && !expandedItems && (
                  <div className="mt-4 text-center">
                    <p
                      onClick={() => setExpandedItems(true)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer inline-flex items-center text-base transition-colors duration-200"
                    >
                      <span>View all {order.products?.length} items</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </p>
                  </div>
                )}

                {/* Show "Show Less" link if expanded */}
                {expandedItems && (order.products?.length || 0) > 3 && (
                  <div className="mt-4 text-center">
                    <p
                      onClick={() => setExpandedItems(false)}
                      className="text-purple-600 hover:text-purple-800 font-semibold cursor-pointer inline-flex items-center text-base transition-colors duration-200"
                    >
                      <span>Show less</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </p>
                  </div>
                )}
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
              </div>
            </div>
          </div>

          {/* OrderProductReview component here - only for delivered orders */}
          {order.status === "delivered" && (
            <div className="bg-white rounded-lg shadow-md border-0 lg:border p-4 lg:p-6 lg:pb-0 pb-20">
              <h3 className="text-lg font-semibold mb-4">
                Write Product Reviews
              </h3>

              {/* Show only first product if not expanded and there are multiple products */}
              {(expandedReviews || order.products.length <= 1
                ? order.products
                : [order.products[0]]
              ).map((product) => (
                <OrderProductReview
                  key={product.productId}
                  product={{
                    id: product.productId.split("_")[0], // Get base product ID if it contains variant
                    name: product.name,
                    image: product.image,
                    brand: product.brand,
                    selectedSize: product.selectedSize,
                  }}
                  orderId={order._id}
                  onReviewSubmitted={() => {
                    // Optional: Refresh order details
                  }}
                />
              ))}

              {/* Show "View All" button if there are more products and not expanded */}
              {order.products.length > 1 && !expandedReviews && (
                <div className="mt-4 mb-4 text-center">
                  <p
                    onClick={() => setExpandedReviews(true)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer inline-flex items-center text-base transition-colors duration-200"
                  >
                    <span>View all {order.products.length} products</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </p>
                </div>
              )}

              {/* Show "Show Less" link if expanded */}
              {expandedReviews && order.products.length > 1 && (
                <div className="mt-4 mb-4 text-center">
                  <p
                    onClick={() => setExpandedReviews(false)}
                    className="text-purple-600 hover:text-purple-800 font-semibold cursor-pointer inline-flex items-center text-base transition-colors duration-200"
                  >
                    <span>Show less</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Return & Exchange Section - Only show if no active return or if return is cancelled */}
          {order.status === "delivered" &&
            (!returnDetails || returnDetails.status === "cancelled") && (
              <OrderReturnSection order={order} />
            )}

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
                className="flex items-center justify-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium w-full sm:w-auto"
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
              className="flex items-center justify-center gap-2 bg-teal-500 text-white px-4 py-3 rounded-lg hover:bg-teal-600 transition-colors font-medium w-full shadow-lg"
            >
              <FaDownload size={16} />
              Download Invoice
            </button>
          </div>
        </div>
      </section>

      {/* Floating Return Button for Mobile - Only show if eligible and no active return */}
      {order.status === "delivered" &&
        new Date() - new Date(order.updatedAt) < 7 * 24 * 60 * 60 * 1000 &&
        (!returnDetails || returnDetails.status === "cancelled") && (
          <div className="lg:hidden fixed bottom-20 right-4 z-50">
            <button
              onClick={() => {
                document.getElementById("return-section").scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
              aria-label="Go to Return & Exchange section"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
    </div>
  );
};

export default OrderDetailPage;
