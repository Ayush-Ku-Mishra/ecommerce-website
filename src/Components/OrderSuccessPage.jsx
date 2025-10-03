import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiCalendar,
} from "react-icons/fi";

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);

  // Get order details from navigation state
  const orderData = location.state;

  useEffect(() => {
    // Redirect to home if no order data (e.g., direct URL access or refresh)
    if (!orderData) {
      navigate("/", { replace: true });
      return;
    }

    // Trigger animation after component mounts
    setTimeout(() => setShowAnimation(true), 100);

    // Clear the navigation state to prevent reuse
    window.history.replaceState({}, document.title);

    // Push a new state to handle back button
    window.history.pushState(null, document.title, window.location.href);

    // Handle back button press
    const handlePopState = (event) => {
      event.preventDefault();
      navigate("/", { replace: true });
    };

    // Handle page refresh/reload attempt
    const handleBeforeUnload = (event) => {
      // Clear session data if needed
      sessionStorage.removeItem("orderSuccess");
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [orderData, navigate]);

  // Early return if no order data
  if (!orderData) return null;

  const {
    orderDetails,
    address,
    cart,
    paymentMethod = "Online Payment",
  } = orderData;

  // Calculate totals
  const subtotal =
    cart?.reduce(
      (sum, item) => sum + (item.originalPrice || 0) * (item.quantity || 1),
      0
    ) || 0;
  const totalDiscount =
    cart?.reduce((discountSum, item) => {
      const original = item.originalPrice || 0;
      const current = item.price || 0;
      const qty = item.quantity || 1;
      const discountPerItem = original > current ? original - current : 0;
      return discountSum + discountPerItem * qty;
    }, 0) || 0;
  const total = subtotal - totalDiscount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-6 sm:mb-8">
          <div
            className={`inline-block transition-all duration-1000 ${
              showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <div className="relative">
              <FiCheckCircle
                size={80}
                className="text-green-500 mx-auto animate-pulse sm:w-[120px] sm:h-[120px]"
              />
              <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping"></div>
            </div>
          </div>

          <h1
            className={`text-2xl sm:text-4xl font-bold text-gray-800 mt-4 sm:mt-6 px-2 transition-all duration-1000 delay-500 ${
              showAnimation
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            Order Placed Successfully!
          </h1>

          <p
            className={`text-gray-600 text-base sm:text-lg mt-2 px-2 transition-all duration-1000 delay-700 ${
              showAnimation
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            Thank you for your purchase. Your order is being processed.
          </p>

          <div
            className={`mt-4 px-2 transition-all duration-1000 delay-900 ${
              showAnimation
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <span className="inline-block bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold">
              Order ID: {orderDetails?.orderId || "ORD" + Date.now()}
            </span>
          </div>
        </div>

        {/* Order Details Card */}
        <div
          className={`bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8 transition-all duration-1000 delay-1100 ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Delivery Address */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <FiMapPin className="text-blue-500" size={20} />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Delivery Address
                </h3>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {address?.name}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  {address?.phone}
                </p>
                <p className="text-gray-600 mt-2 text-sm sm:text-base leading-relaxed">
                  {address?.address_line}
                  <br />
                  {address?.locality}, {address?.city}
                  <br />
                  {address?.state} - {address?.pincode}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <FiCreditCard className="text-green-500" size={20} />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Payment Details
                </h3>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  Payment Method
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  {paymentMethod}
                </p>

                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600 font-semibold">
                      -₹{totalDiscount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-base sm:text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Total Paid</span>
                    <span className="text-blue-600">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div
          className={`bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8 transition-all duration-1000 delay-1300 ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <FiPackage className="text-purple-500" size={20} />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Ordered Items
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {cart?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Size: {item.selectedSize || "N/A"} | Qty: {item.quantity}
                  </p>
                  <div className="mt-1">
                    <span className="text-blue-600 font-semibold text-sm sm:text-base">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    {item.originalPrice &&
                      item.originalPrice !== item.price && (
                        <span className="text-gray-500 text-xs sm:text-sm line-through ml-2">
                          ₹
                          {(
                            item.originalPrice * item.quantity
                          ).toLocaleString()}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Delivery */}
        <div
          className={`bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8 transition-all duration-1000 delay-1500 ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <FiCalendar className="text-orange-500" size={20} />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Expected Delivery
            </h3>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 sm:p-4">
            <p className="text-base sm:text-lg font-semibold text-gray-800">
              {new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Your order will be delivered within 3-5 business days
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center transition-all duration-1000 delay-1700 ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <Link
            to="/account/orders"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <FiPackage size={18} />
            View Orders
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Thank You Message */}
        <div
          className={`text-center mt-8 sm:mt-12 px-2 transition-all duration-1000 delay-1900 ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-gray-600 text-base sm:text-lg">
            Thank you for choosing our store! We hope you love your purchase.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            If you have any questions, feel free to contact our customer
            support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;