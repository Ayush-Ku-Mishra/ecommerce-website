import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


const OrderReturnSection = ({ order }) => {
  const [returnOption, setReturnOption] = useState("refund");
  const [returnDetails, setReturnDetails] = useState(null); 
  const [returnStatus, setReturnStatus] = useState(null);

  // Calculate days remaining for return
  const deliveryDate = new Date(order.updatedAt);
  const currentDate = new Date();
  const returnWindowMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const timeElapsedMs = currentDate - deliveryDate;
  const daysRemaining = Math.ceil(
    (returnWindowMs - timeElapsedMs) / (24 * 60 * 60 * 1000)
  );
  const returnDeadline = new Date(deliveryDate.getTime() + returnWindowMs);

  // Check if order is eligible for return (delivered and within return window)
  const isEligibleForReturn =
    order.status === "delivered" && timeElapsedMs < returnWindowMs;

  useEffect(() => {
    const checkExistingReturn = async () => {
      if (!order || !isEligibleForReturn) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/returns/check/${
            order.orderId
          }`,
          { withCredentials: true }
        );

        if (response.data.success && response.data.data) {
          setReturnDetails(response.data.data);
        }
      } catch (error) {
        // If no return exists, that's fine
        console.log("No existing return found");
      }
    };

    checkExistingReturn();
  }, [order, isEligibleForReturn]);

  // Then in your render logic:
  if (returnDetails && returnDetails.status !== "cancelled") {
    // Don't show the return form if there's an active return
    return null;
  }

  if (!isEligibleForReturn) {
    // Only show the expired message if the order is delivered but outside the window
    if (order.status === "delivered" && timeElapsedMs >= returnWindowMs) {
      return (
        <div
          id="return-section"
          className="bg-white rounded-lg shadow-md border-0 lg:border overflow-hidden"
        >
          <div className="bg-gray-100 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Returns & Exchanges
            </h3>
          </div>

          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-center p-6 text-center">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Return Period Expired
                </h4>
                <p className="text-gray-600">
                  The 7-day return window for this order has expired. If you're
                  experiencing issues with your product, please contact customer
                  support.
                </p>
                <button
                  onClick={() => (window.location.href = "/contact")}
                  className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // For non-delivered orders, return null (don't show anything)
    return null;
  }

  return (
    <div
      id="return-section"
      className="bg-white rounded-lg shadow-md border-0 lg:border overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-semibold text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          Exchange & Return
        </h3>
      </div>

      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Return Policy Info */}
          <div className="flex-1">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  7-Day Policy
                </span>
                <span className="text-sm text-gray-500">
                  {daysRemaining} days remaining
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Eligible for return or exchange until{" "}
                {returnDeadline.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">
                    Hassle-free returns
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Return products in original condition with tags attached
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">
                    Size exchanges available
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Exchange for a different size if available in stock
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">
                    Refund to original payment method
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Refunds processed within 5-7 business days after approval
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Return Action */}
          <div className="lg:w-1/3 flex flex-col">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-800 mb-2">
                Select an option
              </h4>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="return-option"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    checked={returnOption === "refund"}
                    onChange={() => setReturnOption("refund")}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Return for refund
                  </span>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="return-option"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    checked={returnOption === "exchange"}
                    onChange={() => setReturnOption("exchange")}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Exchange for different size
                  </span>
                </label>
              </div>
            </div>

            <Link
              to={`/account/orders/${order.orderId}/return?type=${returnOption}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Start Return Process
            </Link>
          </div>
        </div>

        {/* Return Policy Details */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer">
              <h4 className="text-sm font-medium text-gray-800">
                Return Policy Details
              </h4>
              <span className="ml-2 text-blue-600 group-open:rotate-180 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </summary>
            <div className="mt-3 text-xs text-gray-600 space-y-2">
              <p>• Products must be in original condition with tags attached</p>
              <p>• Damaged or used products may not be eligible for return</p>
              <p>• Return shipping costs may apply for non-defective items</p>
              <p>• Exchanges are subject to product availability</p>
              <p>
                • For hygiene reasons, certain items like innerwear cannot be
                returned
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default OrderReturnSection;
