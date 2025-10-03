import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const ReturnReason = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnType = searchParams.get("type") || "refund";
  const returnOption = searchParams.get("type") || "refund";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [returnReason, setReturnReason] = useState("");
  const [availableSizes, setAvailableSizes] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

          if (foundOrder) {
            setOrder(foundOrder);

            // Initialize selected products
            const products = foundOrder.products.map((product) => ({
              ...product,
              selected: false,
            }));
            setSelectedProducts(products);

            // If it's an exchange, fetch available sizes
            if (returnOption === "exchange") {
              fetchAvailableSizes(products);
            }
          } else {
            toast.error("Order not found");
            navigate("/account/orders");
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, navigate, returnOption]);

  // Fetch available sizes for exchange
  const fetchAvailableSizes = async (products) => {
    try {
      // Extract just the productId values from the products array
      const productIds = products.map((p) => p.productId);

      console.log("Sending product IDs:", productIds);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/product/available-sizes`,
        { productIds },
        { withCredentials: true }
      );

      console.log("Available sizes response:", response.data);

      if (response.data.success) {
        // Process the data to ensure no duplicates
        const processedSizes = {};

        Object.entries(response.data.data).forEach(([productId, sizes]) => {
          // Create a map to deduplicate by size
          const uniqueSizes = {};
          sizes.forEach((sizeObj) => {
            const key = sizeObj.size;
            // If this size doesn't exist yet or has higher stock, use it
            if (!uniqueSizes[key] || uniqueSizes[key].stock < sizeObj.stock) {
              uniqueSizes[key] = sizeObj;
            }
          });

          // Convert back to array and sort by size
          processedSizes[productId] = Object.values(uniqueSizes).sort(
            (a, b) => {
              // Sort numeric sizes numerically
              if (!isNaN(a.size) && !isNaN(b.size)) {
                return Number(a.size) - Number(b.size);
              }
              // Sort alphabetically for non-numeric sizes
              return a.size.localeCompare(b.size);
            }
          );
        });

        setAvailableSizes(processedSizes);
      }
    } catch (error) {
      console.error("Error fetching available sizes:", error);
      console.error("Error details:", error.response?.data || error.message);
    }
  };

  const handleProductSelection = (productId) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === productId
          ? { ...product, selected: !product.selected }
          : product
      )
    );
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleSubmitReturn = async () => {
    if (!selectedProducts.some((p) => p.selected)) {
      toast.error("Please select at least one product to return");
      return;
    }

    if (!returnReason) {
      toast.error("Please select a reason for your return");
      return;
    }

    // For exchange, make sure sizes are selected
    if (returnOption === "exchange") {
      const selectedProductsWithoutSize = selectedProducts
        .filter((p) => p.selected)
        .filter((p) => {
          // If no sizes are available, "unavailable" is a valid selection
          const hasNoAvailableSizes =
            !availableSizes[p.productId] ||
            availableSizes[p.productId].length === 0;

          return !selectedSizes[p.productId] && !hasNoAvailableSizes;
        });

      if (selectedProductsWithoutSize.length > 0) {
        toast.error(
          "Please select a new size or confirm no size is available for all products you want to exchange"
        );
        return;
      }
    }

    setSubmitting(true);

    try {
      // First check if a return already exists
      let existingReturn = null;
      try {
        const checkResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/returns/check/${orderId}`,
          { withCredentials: true }
        );

        if (checkResponse.data.success && checkResponse.data.data) {
          existingReturn = checkResponse.data.data;
        }
      } catch (error) {
        // If we get a 404, it means no return exists, which is what we want
        if (error.response && error.response.status === 404) {
          // This is fine, continue with creating a new return
          console.log("No existing return found, proceeding with creation");
        } else {
          // For other errors, we should stop
          console.error("Error checking for existing return:", error);
          toast.error("Failed to check for existing returns");
          setSubmitting(false);
          return;
        }
      }

      // If an active return exists, prevent creating a new one
      if (existingReturn && existingReturn.status !== "cancelled") {
        toast.error("An active return request already exists for this order");
        navigate(`/account/orders/${orderId}`, { replace: true });
        return;
      }

      // If no return exists or the existing one is cancelled, proceed with creating one
      const returnData = {
        orderId,
        returnType: returnOption,
        reason: returnReason,
        products: selectedProducts
          .filter((p) => p.selected)
          .map((p) => {
            const hasNoAvailableSizes =
              !availableSizes[p.productId] ||
              availableSizes[p.productId].length === 0;

            return {
              productId: p.productId,
              name: p.name,
              price: p.price,
              quantity: p.quantity,
              currentSize: p.selectedSize,
              newSize:
                returnOption === "exchange"
                  ? hasNoAvailableSizes
                    ? "unavailable"
                    : selectedSizes[p.productId]
                  : null,
              noSizesAvailable: hasNoAvailableSizes,
            };
          }),
      };

      console.log("Sending return data:", returnData);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/returns/create`,
        returnData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Return request submitted successfully");
        navigate(`/account/orders/${orderId}`, { replace: true });
      } else {
        console.log("Error response:", response.data);
        toast.error(response.data.message || "Failed to submit return request");
      }
    } catch (error) {
      console.error("Error submitting return:", error);
      if (error.response && error.response.data) {
        console.log("Error response:", error.response.data);
        toast.error(
          error.response.data.message || "Failed to submit return request"
        );
      } else {
        toast.error("Failed to submit return request. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/account/orders/${orderId}`)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft />
          <span>Back to Order</span>
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 lg:p-6">
            <h2 className="text-xl font-semibold text-white">
              {returnType === "refund"
                ? "Return for Refund"
                : "Exchange for Different Size"}
            </h2>
            <p className="text-blue-100 mt-1">Order #{orderId}</p>
          </div>

          <div className="p-4 lg:p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Select Items to{" "}
                {returnType === "refund" ? "Return" : "Exchange"}
              </h3>

              <div className="space-y-3">
                {selectedProducts.map((product) => (
                  <div
                    key={product.productId}
                    className={`border rounded-lg p-3 transition-colors ${
                      product.selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`product-${product.productId}`}
                        checked={product.selected}
                        onChange={() =>
                          handleProductSelection(product.productId)
                        }
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />

                      <img
                        src={product.image || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Size: {product.selectedSize} • Qty: {product.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-800 mt-1">
                          ₹
                          {Number(
                            product.price * product.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Size selection for exchange */}
                    {returnType === "exchange" && product.selected && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select New Size
                        </label>

                        {(() => {
                          // Filter out the current size from available sizes
                          const filteredSizes =
                            availableSizes[product.productId]?.filter(
                              (sizeOption) =>
                                sizeOption.size !== product.selectedSize
                            ) || [];

                          return filteredSizes.length > 0 ? (
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2">
                                {filteredSizes.map((sizeOption) => (
                                  <button
                                    key={sizeOption.size}
                                    type="button"
                                    onClick={() =>
                                      handleSizeChange(
                                        product.productId,
                                        sizeOption.size
                                      )
                                    }
                                    className={`px-4 py-2 border rounded-md text-sm transition-all ${
                                      selectedSizes[product.productId] ===
                                      sizeOption.size
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                        : "border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50"
                                    }`}
                                  >
                                    <span className="font-medium">
                                      {sizeOption.size}
                                    </span>
                                    <span className="text-xs block opacity-80">
                                      {sizeOption.stock} in stock
                                    </span>
                                  </button>
                                ))}
                              </div>

                              {selectedSizes[product.productId] && (
                                <p className="text-sm text-green-600 font-medium">
                                  You selected:{" "}
                                  {selectedSizes[product.productId]}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                              <p className="text-sm text-red-600 mb-2 font-medium">
                                No other sizes available for exchange
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSizeChange(
                                    product.productId,
                                    "unavailable"
                                  )
                                }
                                className={`px-4 py-2 border rounded-md text-sm ${
                                  selectedSizes[product.productId] ===
                                  "unavailable"
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white border-gray-300 text-gray-700 hover:border-blue-500"
                                }`}
                              >
                                Confirm No Size Available
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="return-reason"
                className="block text-lg font-medium text-gray-800 mb-2"
              >
                Reason for {returnType === "refund" ? "Return" : "Exchange"}
              </label>
              <select
                id="return-reason"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a reason</option>

                {returnType === "refund" ? (
                  // Reasons for refund
                  <>
                    <option value="Defective product">Defective product</option>
                    <option value="Not as described">Not as described</option>
                    <option value="Changed my mind">Changed my mind</option>
                    <option value="Received wrong item">
                      Received wrong item
                    </option>
                    <option value="Better price available">
                      Better price available
                    </option>
                    <option value="Arrived too late">Arrived too late</option>
                    <option value="Damaged during shipping">
                      Damaged during shipping
                    </option>
                    <option value="Other">Other</option>
                  </>
                ) : (
                  // Reasons for exchange (size-related)
                  <>
                    <option value="Wrong size">Wrong size</option>
                    <option value="Size too small">Size too small</option>
                    <option value="Size too large">Size too large</option>
                    <option value="Uncomfortable fit">Uncomfortable fit</option>
                    <option value="Different from size chart">
                      Different from size chart
                    </option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>

              {returnReason === "Other" && (
                <textarea
                  placeholder="Please specify the reason"
                  className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                ></textarea>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Return Policy</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Products must be in original condition with tags attached
                </li>
                <li>• Returns must be initiated within 7 days of delivery</li>
                <li>
                  • Refunds will be processed to the original payment method
                </li>
                <li>• Exchanges are subject to product availability</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => navigate(`/account/orders/${orderId}`)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitReturn}
                disabled={submitting}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnReason;
