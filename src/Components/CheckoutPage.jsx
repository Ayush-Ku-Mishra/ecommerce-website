import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IoBagCheckOutline } from "react-icons/io5";
import { BiCurrentLocation } from "react-icons/bi";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { addAddress, editAddress, setAddresses } from "../redux/addressSlice";
import toast from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import axios from "axios";
import { Context } from "../main";

import HorizontalLinearAlternativeLabelStepper from "./HorizontalLinearAlternativeLabelStepper";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation } from "react-router-dom";

const isPincodeInOdisha = (pincode) => {
  if (!pincode || pincode.length !== 6) return false;

  // Odisha pincode prefixes
  const odishaPrefixes = [
    "751",
    "752",
    "753",
    "754",
    "755",
    "756",
    "757",
    "758",
    "759",
    "760",
    "761",
    "762",
    "764",
    "765",
    "766",
    "767",
    "768",
    "769",
    "770",
  ];

  // Check if pincode starts with any Odisha prefix
  return odishaPrefixes.some((prefix) => pincode.startsWith(prefix));
};

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const RAZORPAY_KEY_ID = import.meta.env.VITE_APP_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = import.meta.env.VITE_APP_RAZORPAY_KEY_SECRET;

const emptyAddress = {
  name: "",
  phone: "",
  address_line: "",
  pincode: "",
  locality: "",
  city: "",
  state: "",
  landmark: "",
  alternatePhone: "",
  type: "Home",
  isDefault: false,
};

const CheckoutPage = () => {
  // All hooks must be called at the top level, in the same order every time
  const { isAuthenticated, updateCartCount } = useContext(Context);
  const addresses = useSelector((state) => state.addresses.addresses);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // All useState hooks together
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [isBuyNowMode, setIsBuyNowMode] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("ONLINE");
  const [step, setStep] = useState("address");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyAddress);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const [processingPayment, setProcessingPayment] = useState(false);
  const [addressPincodeWarning, setAddressPincodeWarning] = useState(false);

  // Get buyNowData from location state
  const buyNowData = location.state;

  
  // Effect for initial setup
  useEffect(() => {
    // Initialize selectedAddressId when addresses change
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(
        (addr) => addr.isDefault || addr.default
      );
      const addressToSelect = defaultAddr ? defaultAddr : addresses[0];
      setSelectedAddressId(addressToSelect._id);

      // Check if the address pincode is valid
      if (
        addressToSelect.pincode &&
        !isPincodeInOdisha(addressToSelect.pincode)
      ) {
        setAddressPincodeWarning(true);
      } else {
        setAddressPincodeWarning(false);
      }
    }
  }, [addresses, selectedAddressId]);

  // Effect for fetching data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchAddresses();
    }
  }, [isAuthenticated]);

  // Effect for step index calculation - FIXED to handle payment step
  useEffect(() => {
    const stepToIndex = {
      address: 0,
      summary: 1,
      payment: 2,
    };
    setActiveStepIndex(stepToIndex[step] ?? 0);
  }, [step]);

  // Effect for buy now data
  useEffect(() => {
    if (buyNowData && buyNowData.isBuyNow) {
      setIsBuyNowMode(true);
      setBuyNowItem(buyNowData.buyNowItem);
    }
  }, [buyNowData]);

  // Derived values
  const visibleItems = cart.slice(0, visibleCount);

  // Fetch cart items
  const fetchCart = async () => {
    try {
      setCartLoading(true);

      // Check if this is a Buy Now flow
      if (buyNowData && buyNowData.isBuyNow && buyNowData.buyNowItem) {
        console.log("Buy Now mode detected");
        setIsBuyNowMode(true);
        setBuyNowItem(buyNowData.buyNowItem);
        setCart([buyNowData.buyNowItem]);
        return;
      }

      // Regular cart fetch for normal checkout
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/cart/getCartItems`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const transformedCart = response.data.data.map((item) => ({
          id: item.variantId || item.productId,
          title: item.productName,
          brand: item.productBrand,
          price: Math.round(item.price),
          originalPrice: Math.round(item.originalPrice),
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          image: item.productImage,
          discount: item.discount,
          _id: item._id,
        }));
        setCart(transformedCart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setCartLoading(false);
    }
  };

  // Load addresses from backend
  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/address/addAddress`,
        { withCredentials: true }
      );

      if (data.success && data.addresses) {
        dispatch(setAddresses(data.addresses));
      } else {
        toast.error(data.message || "Failed to load addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Error fetching addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Update quantity - FIXED for Buy Now mode
  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    if (isBuyNowMode) {
      try {
        const item = cart.find((p) => p._id === cartItemId);
        if (!item) return;

        const productId = item.id.split("_")[0];
        const stockRes = await axios.get(
          `${API_BASE_URL}/api/v1/product/${productId}/stock`,
          {
            params: {
              size: item.selectedSize || undefined,
            },
          }
        );

        if (quantity > stockRes.data.stock) {
          toast.error(`Only ${stockRes.data.stock} available in stock!`);
          return;
        }
      } catch (error) {
        console.warn("Could not validate stock in buy now mode");
        // Optional: Let it proceed — backend will block on /updateQuantity
      }

      setCart((prev) =>
        prev.map((item) =>
          item._id === cartItemId ? { ...item, quantity } : item
        )
      );
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1/cart/updateQuantity`,
        {
          cartItemId,
          quantity,
        },
        {
          withCredentials: true,
        }
      );

      setCart((prev) =>
        prev.map((item) =>
          item._id === cartItemId ? { ...item, quantity } : item
        )
      );
      updateCartCount();
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update quantity");
      }
      console.error("Error updating quantity:", error);
    }
  };

  // Remove from cart - FIXED for Buy Now mode
  const removeFromCart = async (cartItemId) => {
    // Handle Buy Now mode locally
    if (isBuyNowMode) {
      setCart((prev) => prev.filter((item) => item._id !== cartItemId));
      toast.success("Removed from cart!");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/v1/cart/deleteCartItem`, {
        data: { cartItemId },
        withCredentials: true,
      });

      setCart((prev) => prev.filter((item) => item._id !== cartItemId));
      updateCartCount();
      toast.success("Removed from cart!");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({
      ...emptyAddress,
      isDefault: addresses.length === 0,
    });
    setOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setIsEdit(true);
    setForm({
      ...addr,
      isDefault: addr.isDefault || addr.default || false,
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.address || {};

          setForm((prev) => ({
            ...prev,
            locality:
              address.suburb || address.neighbourhood || address.road || "",
            address_line: `${
              address.suburb ||
              address.neighbourhood ||
              address.road ||
              address.village ||
              ""
            }, ${
              address.locality || address.town || address.city || ""
            }`.trim(),
            city: address.city || address.town || address.village || "",
            state: address.state || "",
            pincode: address.postcode || "",
          }));
        } catch (error) {
          toast.error("Failed to fetch address from your location");
          console.error(error);
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        toast.error("Unable to retrieve your location: " + error.message);
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address_line || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate pincode is in Odisha
    if (!isPincodeInOdisha(form.pincode)) {
      toast.error(
        "We only deliver to addresses in Odisha. Please enter a valid Odisha pincode."
      );
      return;
    }

    setSaving(true);

    const formData = {
      ...form,
      default: form.isDefault,
    };

    try {
      if (isEdit && form._id) {
        const { data } = await axios.put(
          `${API_BASE_URL}/api/v1/address/update/${form._id}`,
          formData,
          { withCredentials: true }
        );
        if (data.success) {
          dispatch(editAddress(data.address));
          toast.success("Address updated");
          setOpen(false);
        } else {
          toast.error(data.message || "Failed to update address");
        }
      } else {
        const { data } = await axios.post(
          `${API_BASE_URL}/api/v1/address/addAddress`,
          formData,
          { withCredentials: true }
        );
        if (data.success) {
          dispatch(addAddress(data.address));
          toast.success("Address added");
          if (addresses.length === 0) {
            setSelectedAddressId(data.address._id);
          }
          setOpen(false);
        } else {
          toast.error(data.message || "Failed to add address");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error, try again later");
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentClick = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!isPincodeInOdisha(selectedAddress.pincode)) {
      toast.error(
        "We only deliver to addresses in Odisha. Please select an address with a valid Odisha pincode."
      );
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      toast.error("Payment gateway not configured");
      return;
    }

    setProcessingPayment(true);
    setStep("payment"); // Set step to payment

    try {
      const orderData = {
        amount: total,
        currency: "INR",
        cart: cart,
        address: selectedAddress,
        notes: {
          customer_name: selectedAddress.name,
          customer_phone: selectedAddress.phone,
          total_items: cart.length,
          order_type: isBuyNowMode ? "buy_now" : "cart_checkout",
        },
      };

      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/v1/payment/create-order`,
        orderData,
        { withCredentials: true }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || "Failed to create order");
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderResponse.data.order.amount,
        currency: orderResponse.data.order.currency,
        name: "Pickora",
        description: `Payment for ${cart.length} items`,
        order_id: orderResponse.data.order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(
              `${API_BASE_URL}/api/v1/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cart: cart,
                address: selectedAddress,
                amount: total,
                isBuyNow: isBuyNowMode,
              },
              { withCredentials: true }
            );

            if (verifyResponse.data.success) {
              toast.success("Payment successful! Your order has been placed.");

              // Clear cart from database if not Buy Now mode
              if (!isBuyNowMode) {
                try {
                  await axios.delete(`${API_BASE_URL}/api/v1/cart/clearCart`, {
                    withCredentials: true,
                  });
                  updateCartCount();
                } catch (error) {
                  console.error("Error clearing cart:", error);
                }
              }

              // Navigate to success page with order details
              navigate("/order-success", {
                state: {
                  orderDetails: {
                    orderId:
                      verifyResponse.data.orderId || response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                  },
                  address: selectedAddress,
                  cart: cart,
                  paymentMethod: "Online Payment",
                },
              });
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: selectedAddress.name,
          contact: selectedAddress.phone,
        },
        theme: {
          color: "#fa5652",
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            setStep("summary"); // Reset step back to summary
            toast.info("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create order. Please try again."
      );
      setProcessingPayment(false);
      setStep("summary"); // Reset step back to summary
    }
  };

  const handleCODOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!isPincodeInOdisha(selectedAddress.pincode)) {
      toast.error(
        "We only deliver to addresses in Odisha. Please select an address with a valid Odisha pincode."
      );
      return;
    }

    setProcessingPayment(true);

    try {
      const orderData = {
        cart: cart,
        address: selectedAddress,
        amount: total,
        notes: {
          customer_name: selectedAddress.name,
          customer_phone: selectedAddress.phone,
          total_items: cart.length,
          order_type: isBuyNowMode ? "buy_now" : "cart_checkout",
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/payment/create-cod-order`,
        orderData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("COD Order placed successfully!");

        // Clear cart from database if not Buy Now mode
        if (!isBuyNowMode) {
          try {
            await axios.delete(`${API_BASE_URL}/api/v1/cart/clearCart`, {
              withCredentials: true,
            });
            updateCartCount();
          } catch (error) {
            console.error("Error clearing cart:", error);
          }
        }

        // Navigate to success page with order details
        navigate("/order-success", {
          state: {
            orderDetails: {
              orderId: response.data.orderId || "COD" + Date.now(),
            },
            address: selectedAddress,
            cart: cart,
            paymentMethod: "Cash on Delivery",
          },
        });
      } else {
        toast.error(response.data.message || "Failed to place COD order");
      }
    } catch (error) {
      console.error("COD order failed:", error);
      toast.error("Failed to place COD order. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.originalPrice || 0) * (item.quantity || 1),
    0
  );

  const totalDiscount = cart.reduce((discountSum, item) => {
    const original = item.originalPrice || 0;
    const current = item.price || 0;
    const qty = item.quantity || 1;
    const discountPerItem = original > current ? original - current : 0;
    return discountSum + discountPerItem * qty;
  }, 0);

  const total = subtotal - totalDiscount;
  const selectedAddress = addresses.find(
    (addr) => addr._id === selectedAddressId
  );

  // Early returns for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-10">
          <div className="text-center">
            <IoBagCheckOutline
              size={64}
              className="mx-auto text-gray-400 mb-4"
            />
            <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please login to proceed with checkout
            </p>
            <Link
              to="/login"
              className="bg-red-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-600 transition"
            >
              Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (cartLoading || loadingAddresses) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);

    // Check if the selected address has a valid pincode
    const selectedAddr = addresses.find((addr) => addr._id === addressId);
    if (
      selectedAddr &&
      selectedAddr.pincode &&
      !isPincodeInOdisha(selectedAddr.pincode)
    ) {
      setAddressPincodeWarning(true);
      // toast.error(
      //   "This address has a pincode outside our delivery area (Odisha)"
      // );
    } else {
      setAddressPincodeWarning(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-start justify-between max-w-[1200px] mx-auto mt-4 lg:mt-10 mb-4 lg:mb-10 px-4">
        {/* Stepper - Mobile optimized */}
        <div className="w-full sticky top-0 lg:top-32 z-50 self-start bg-[#f9f9f9] py-2 lg:py-0">
          <HorizontalLinearAlternativeLabelStepper
            activeStep={activeStepIndex}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:min-w-[1200px] gap-4 lg:gap-8 w-full lg:mb-5">
          {/* Main Content Section */}
          <div className="border-0 lg:border-2 lg:border-gray-200 lg:shadow rounded-none lg:rounded-xl lg:ml-10 w-full lg:w-[60%] bg-white">
            {/* Address Section */}
            <div className="border-b lg:border-b-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-0 lg:border-t-2 lg:border-l-2 lg:border-r-2 p-4 bg-gray-50 lg:bg-white">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
                  <span className="inline-flex items-center gap-2 text-gray-800 font-semibold">
                    <span className="text-white bg-[#2874f0] flex items-center justify-center w-6 h-6 rounded text-sm">
                      {step !== "address" ? <AiOutlineCheck size={16} /> : "1"}
                    </span>
                    Select Delivery Address
                  </span>
                </h2>

                {step === "address" && addresses.length > 0 && (
                  <div
                    onClick={handleOpenAdd}
                    className="p-2 cursor-pointer border-2 border-[#22B6FC] border-dashed bg-[#f1faff] hover:bg-[#e5f5fb] rounded-md font-semibold transition w-fit"
                  >
                    <button className="text-[#22B6FC] text-sm px-3 py-1">
                      <span className="text-[18px] font-bold mr-1">+</span> ADD
                      NEW ADDRESS
                    </button>
                  </div>
                )}
              </div>

              {/* Address Content */}
              {step === "address" && (
                <div className="border-0 lg:border-l-2 lg:border-r-2 lg:border-b-2 lg:p-4 p-0">
                  {addresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-grow border-2 border-dashed border-gray-300 rounded-xl p-6 lg:p-10 bg-gray-50">
                      <img
                        src="https://ecommerce-frontend-view.netlify.app/map.png"
                        alt="No Address"
                        className="w-20 h-20 lg:w-28 lg:h-28 mb-2 opacity-80"
                      />
                      <p className="text-gray-600 text-center mb-4 text-base lg:text-lg">
                        No addresses found in your account!
                      </p>
                      <button
                        onClick={handleOpenAdd}
                        className="mt-2 bg-red-500 text-white px-6 lg:px-7 py-2.5 text-sm lg:text-[15px] rounded-lg hover:bg-red-600 transition-colors duration-300 font-semibold tracking-wide"
                      >
                        ADD ADDRESS
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((addr) => (
                        <label
                          key={addr._id}
                          className={`bg-[#fff2f2] border ${
                            selectedAddressId === addr._id
                              ? "border-[#22B6FC] bg-[#fff2f2] shadow-lg"
                              : "border-[#e5e7eb] shadow-md"
                          } ${
                            !isPincodeInOdisha(addr.pincode)
                              ? "border-l-4 border-l-amber-400"
                              : ""
                          } rounded-lg px-4 lg:px-5 py-4 flex items-start gap-3 lg:gap-4 cursor-pointer transition`}
                          style={{ boxShadow: "0 2px 12px 0 #eef6fa" }}
                          onClick={() => handleAddressSelection(addr._id)}
                        >
                          <input
                            type="radio"
                            name="selectedAddress"
                            value={addr._id}
                            checked={selectedAddressId === addr._id}
                            onChange={() => setSelectedAddressId(addr._id)}
                            className="accent-red-500 mt-[6px] shrink-0"
                            style={{ width: 18, height: 18 }}
                          />

                          <div className="flex flex-col flex-grow min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold bg-[#e5f5fb] px-3 py-[3px] rounded-full text-[#22B6FC] uppercase">
                                  {addr.type}
                                </span>
                                {(addr.isDefault || addr.default) && (
                                  <span className="text-xs font-semibold bg-green-100 px-2 py-1 rounded-full text-green-700">
                                    Default
                                  </span>
                                )}
                              </div>

                              <button
                                className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:border-blue-400 text-blue-500 text-sm font-semibold transition w-fit"
                                title="Edit Address"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEdit(addr);
                                }}
                              >
                                Edit
                              </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 sm:items-center mb-2">
                              <span className="font-bold text-gray-900 text-[16px] truncate">
                                {addr.name}
                              </span>
                              <span className="text-gray-700 font-semibold text-[15px]">
                                {addr.phone}
                              </span>
                            </div>

                            <div className="text-gray-700 text-[15px] leading-relaxed mb-1">
                              <span className="block truncate">
                                {addr.address_line}, {addr.locality}
                              </span>
                              <span className="block truncate">
                                {addr.city}, {addr.state}
                              </span>
                            </div>

                            <div className="text-gray-500 text-[15px]">
                              Pincode: {addr.pincode}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {addresses.length > 0 && (
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => {
                          if (!selectedAddressId) {
                            toast.error("Please select an address to proceed");
                            return;
                          }

                          // Add pincode validation
                          if (addressPincodeWarning) {
                            toast.error(
                              "We only deliver to addresses in Odisha. Please select or add an address with an Odisha pincode."
                            );
                            return;
                          }

                          setStep("summary");
                        }}
                        className="px-4 py-2 bg-[#22B6FC] text-white rounded hover:bg-blue-700 transition text-sm lg:text-base"
                      >
                        Continue to Order Summary
                      </button>
                    </div>
                  )}
                </div>
              )}

              {step !== "address" && selectedAddress && (
                <div className="border-0 lg:border-l-2 lg:border-r-2 lg:border-b-2 p-4 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {selectedAddress.name} - {selectedAddress.phone}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="block truncate">
                          {selectedAddress.address_line},{" "}
                          {selectedAddress.locality}
                        </span>
                        <span className="block truncate">
                          {selectedAddress.city}, {selectedAddress.state} -{" "}
                          {selectedAddress.pincode}
                        </span>
                      </p>
                      {!isPincodeInOdisha(selectedAddress.pincode) && (
                        <p className="mt-1 text-amber-600 text-sm font-medium">
                          ⚠️ This address is outside our delivery area (Odisha)
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setStep("address")}
                      className="text-blue-600 underline text-sm whitespace-nowrap"
                    >
                      Change address
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Section */}
            <div className="p-4">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4">
                <span className="inline-flex items-center gap-2 text-gray-800 font-semibold">
                  <span className="text-white bg-[#2874f0] flex items-center justify-center w-6 h-6 rounded text-sm">
                    {step === "payment" ? <AiOutlineCheck size={16} /> : "2"}
                  </span>
                  Order Summary
                </span>
              </h2>

              <div>
                {step === "summary" || step === "payment" ? (
                  cart.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Your cart is empty!</p>
                      <Link
                        to="/"
                        className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600 transition"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="border rounded-xl overflow-hidden">
                      <ul className="divide-y max-h-96 overflow-y-auto">
                        {visibleItems.map((product) => (
                          <li
                            key={product._id}
                            className="flex flex-col px-4 lg:px-6 py-4 lg:py-6 bg-white"
                          >
                            <div className="flex items-center gap-3 lg:gap-5 w-full">
                              <Link
                                to={`/product/${product.id.split("_")[0]}`}
                                className="w-16 h-20 lg:w-20 lg:h-24 rounded overflow-hidden block flex-shrink-0"
                              >
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-full h-full object-cover object-top"
                                  loading="lazy"
                                />
                              </Link>

                              <div className="flex-1 px-2 min-w-0">
                                <div className="block text-sm lg:text-[14px] leading-[20px] lg:leading-[22px] font-[500] text-[rgba(0,0,0,0.9)] hover:text-blue-500">
                                  <span className="line-clamp-2 lg:truncate">
                                    {product.title}
                                  </span>
                                </div>

                                <p className="text-sm lg:text-[14px] text-[#878787] mt-1">
                                  Size: {product.selectedSize || "N/A"}
                                </p>
                                <p className="text-sm lg:text-[14px] text-[#878787] mt-1 truncate">
                                  Brand: {product.brand}
                                </p>

                                <div className="mt-2">
                                  <span className="text-red-500 font-[600] text-lg lg:text-xl">
                                    ₹{(product.price || 0).toLocaleString()}
                                  </span>
                                  {product.originalPrice && (
                                    <span className="line-through text-gray-500 text-sm lg:font-[16px] ml-2">
                                      ₹
                                      {(
                                        product.originalPrice || 0
                                      ).toLocaleString()}
                                    </span>
                                  )}
                                  {product.discount && (
                                    <span className="ml-2 text-green-500 text-sm font-semibold">
                                      {product.discount}% off
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                title="Remove"
                                onClick={() => removeFromCart(product._id)}
                                className="p-2 text-xl text-gray-400 hover:text-red-500 transition flex-shrink-0"
                              >
                                <MdDeleteOutline />
                              </button>
                            </div>

                            {product.quantity !== undefined && (
                              <div className="mt-4 flex items-center gap-2 w-max select-none ml-16 lg:ml-28">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      product._id,
                                      product.quantity - 1
                                    )
                                  }
                                  className="w-7 h-7 rounded-full bg-gray-100 text-black flex items-center justify-center hover:bg-gray-300 transition"
                                  aria-label="Decrease quantity"
                                >
                                  &minus;
                                </button>

                                <span className="min-w-[50px] text-center bg-white px-2 py-1 rounded border border-gray-300 font-semibold text-sm text-black">
                                  {product.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      product._id,
                                      product.quantity + 1
                                    )
                                  }
                                  className="w-7 h-7 rounded-full bg-gray-100 text-black flex items-center justify-center hover:bg-gray-300 transition"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ) : (
                  <p className="text-gray-500 italic text-sm lg:text-base">
                    Complete address selection to view order summary
                  </p>
                )}
              </div>
            </div>

            {/* Payment Method Section - FIXED: Only show when step is summary */}
            {step === "summary" && (
              <div className="p-4 border-t">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4">
                  <span className="inline-flex items-center gap-2 text-gray-800 font-semibold">
                    <span className="text-white bg-[#2874f0] flex items-center justify-center w-6 h-6 rounded text-sm">
                      3
                    </span>
                    Payment Method
                  </span>
                </h2>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={selectedPaymentMethod === "ONLINE"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-blue-600 mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800">
                        Online Payment
                      </div>
                      <div className="text-sm text-gray-600">
                        Credit Card, Debit Card, UPI, Net Banking
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={selectedPaymentMethod === "COD"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-blue-600 mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800">
                        Cash on Delivery
                      </div>
                      <div className="text-sm text-gray-600">
                        Pay when you receive the product
                      </div>
                    </div>
                  </label>
                </div>

                {selectedAddressId && cart.length > 0 && (
                  <div className="flex justify-center lg:justify-end mt-6">
                    {selectedPaymentMethod === "ONLINE" ? (
                      <button
                        onClick={handlePaymentClick}
                        disabled={processingPayment}
                        className="px-6 py-3 bg-[#fa5652] hover:bg-[#e94843] text-white rounded-md transition text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                      >
                        {processingPayment
                          ? "Opening Payment..."
                          : "Proceed to Payment"}
                      </button>
                    ) : (
                      <button
                        onClick={handleCODOrder}
                        disabled={processingPayment}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition text-base lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                      >
                        {processingPayment ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            Placing Order...
                          </div>
                        ) : (
                          "Place COD Order"
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Payment Processing Status - Show when step is payment */}
            {step === "payment" && (
              <div className="p-4 border-t">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4">
                  <span className="inline-flex items-center gap-2 text-gray-800 font-semibold">
                    <span className="text-white bg-[#2874f0] flex items-center justify-center w-6 h-6 rounded">
                      <AiOutlineCheck size={16} />
                    </span>
                    Payment Processing
                  </span>
                </h2>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing your payment...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart Totals Sidebar - Mobile responsive */}
          <div className="w-full lg:max-w-[300px] lg:h-[340px] lg:sticky lg:top-52 lg:self-start lg:w-[35%] bg-white rounded-lg shadow-md p-4 lg:p-6 border border-gray-200 mt-4 lg:mt-0">
            <h2 className="text-lg font-semibold mb-4">Cart Totals</h2>
            <hr className="mb-4" />

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 text-sm lg:text-[16px]">
                Price ({cart.length} item{cart.length !== 1 ? "s" : ""})
              </span>
              <span className="text-red-500 text-sm lg:text-[16px] font-semibold">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 text-sm lg:text-[16px]">
                Discount
              </span>
              <span className="text-[#388e3c] text-sm lg:text-[16px] font-semibold">
                - ₹{totalDiscount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 text-sm lg:text-[16px]">
                Shipping
              </span>
              <span className="font-bold text-gray-700 text-sm lg:text-[16px]">
                Free
              </span>
            </div>

            <div className="flex justify-between items-center mt-6 mb-4 lg:mb-8 border-t-2 border-b-2 border-dashed p-2">
              <span className="text-black text-sm lg:text-[16px] font-bold">
                Total Amount
              </span>
              <span className="text-red-500 text-sm lg:text-[16px] font-bold">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Add/Edit Address Modal */}
        {open && (
          <div
            className="fixed inset-0 lg:mt-32 bg-black bg-opacity-20 flex items-center justify-center z-40 md:p-4"
            style={{ zIndex: 9999 }}
          >
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.modal + 1,
              }}
              open={saving}
            >
              <CircularProgress color="inherit" />
            </Backdrop>

            <form
              className="bg-white md:rounded-xl p-4 md:p-8 md:shadow-xl w-full md:max-w-3xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto scrollbar-hide"
              onSubmit={handleSubmit}
            >
              <h2 className="text-lg font-bold mb-4">
                {isEdit ? "Edit Address" : "Add Address"}
              </h2>

              <button
                type="button"
                onClick={useMyLocation}
                disabled={loadingLocation}
                className="mb-3 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition flex items-center gap-2 w-full md:w-auto"
              >
                <BiCurrentLocation className="text-lg" />
                {loadingLocation
                  ? "Detecting Location..."
                  : "Use My Current Location"}
              </button>
              <div className="mb-3">
                <div className="flex flex-col md:flex-row gap-3 mb-3">
                  <TextField
                    name="name"
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={form.name}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "12px 16px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                  <TextField
                    name="phone"
                    label="10-digit mobile number"
                    variant="outlined"
                    fullWidth
                    required
                    inputProps={{
                      maxLength: 10,
                      pattern: "[6-9][0-9]{9}",
                      title:
                        "Enter a valid 10-digit Indian mobile number starting with 6-9",
                    }}
                    value={form.phone}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "12px 16px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-3 mb-3">
                  <TextField
                    name="pincode"
                    label="Pincode"
                    variant="outlined"
                    required
                    value={form.pincode}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "12px 16px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                  <TextField
                    name="locality"
                    label="Locality"
                    variant="outlined"
                    required
                    value={form.locality}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "12px 16px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                </div>

                <TextField
                  name="address_line"
                  label="Address (Area and Street)"
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  rows={2}
                  value={form.address_line}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "12px 16px",
                      fontSize: "1rem",
                    },
                  }}
                  className="!mb-3"
                />

                <div className="flex flex-col md:flex-row gap-3 mb-3">
                  <TextField
                    name="city"
                    label="City / District / Town"
                    variant="outlined"
                    required
                    fullWidth
                    value={form.city}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "12px 16px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                  <FormControl fullWidth required>
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      label="State"
                      MenuProps={{
                        disablePortal: true,
                        PaperProps: {
                          style: { zIndex: 15000 },
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "4px",
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "12px 16px",
                          fontSize: "1rem",
                        },
                      }}
                    >
                      {[
                        "Andhra Pradesh",
                        "Arunachal Pradesh",
                        "Assam",
                        "Bihar",
                        "Chhattisgarh",
                        "Goa",
                        "Gujarat",
                        "Haryana",
                        "Himachal Pradesh",
                        "Jharkhand",
                        "Karnataka",
                        "Kerala",
                        "Madhya Pradesh",
                        "Maharashtra",
                        "Manipur",
                        "Meghalaya",
                        "Mizoram",
                        "Nagaland",
                        "Odisha",
                        "Punjab",
                        "Rajasthan",
                        "Sikkim",
                        "Tamil Nadu",
                        "Telangana",
                        "Tripura",
                        "Uttar Pradesh",
                        "Uttarakhand",
                        "West Bengal",
                        "Andaman and Nicobar Islands",
                        "Chandigarh",
                        "Dadra and Nagar Haveli and Daman and Diu",
                        "Delhi",
                        "Jammu and Kashmir",
                        "Ladakh",
                        "Lakshadweep",
                        "Puducherry",
                      ].map((state) => (
                        <MenuItem key={state} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mb-3">
                  <TextField
                    name="landmark"
                    label="Landmark (Optional)"
                    variant="outlined"
                    fullWidth
                    value={form.landmark}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "12px 16px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                  <TextField
                    name="alternatePhone"
                    label="Alternate Phone (Optional)"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      maxLength: 10,
                      pattern: "\\d*",
                    }}
                    value={form.alternatePhone}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "12px 16px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center my-4">
                  <span className="font-medium">Address Type</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="Home"
                        checked={form.type === "Home"}
                        onChange={handleChange}
                      />
                      Home
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value="Work"
                        checked={form.type === "Work"}
                        onChange={handleChange}
                      />
                      Work
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded bg-gray-100 text-gray-800 border order-2 md:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#22B6FC] text-white font-semibold order-1 md:order-2"
                >
                  {isEdit ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
