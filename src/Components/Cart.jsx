import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";
import { Context } from "../main";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Cart = () => {
  const { isAuthenticated, updateCartCount } = useContext(Context);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  const visibleItems = cart.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // Fetch cart items
  const fetchCart = async () => {
    try {
      setLoading(true);
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
          price: Math.round(item.price), // Fix price precision
          originalPrice: Math.round(item.originalPrice), // Fix price precision
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          image: item.productImage,
          discount: item.discount,
          _id: item._id, // Backend cart item ID
        }));
        setCart(transformedCart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    try {
      // First, check stock availability
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

      // If stock check passes, update the quantity
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

  // Remove from cart
  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/cart/deleteCartItem`, {
        data: { cartItemId },
        withCredentials: true,
      });

      setCart((prev) => prev.filter((item) => item._id !== cartItemId));
      updateCartCount(); // Update cart badge
      toast.success("Removed from cart!");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Show login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-10">
        <div className="text-center">
          <FiShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your cart</p>
          <Link
            to="/login"
            className="bg-red-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-600 transition"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

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

  const shippingCost = 0;
  const total = subtotal - totalDiscount;

  return (
    <div className="sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:mt-4 mt-0 max-w-[1230px] mx-auto lg:mb-8">
        {/* Left: Cart items or empty state */}
        <div
          className={`bg-white rounded-sm shadow-md p-6 sm:p-8 flex flex-col justify-between border-2 ${
            cart.length === 0 ? "w-full" : "lg:w-2/3"
          }`}
        >
          <h1 className="text-xl sm:text-2xl font-semibold mb-2">My Cart</h1>
          <p className="text-gray-700 mb-6 text-sm sm:text-base">
            There are{" "}
            <span className="text-red-500 font-semibold">{cart.length}</span>{" "}
            products in your cart
          </p>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 sm:p-10 rounded-xl flex-1 border-2 border-dashed border-gray-300 bg-gray-50">
              <img
                src="https://ecommerce-frontend-view.netlify.app/empty-cart.png"
                alt="Empty Cart"
                className="w-24 h-24 sm:w-32 sm:h-32 mb-6"
              />
              <p className="text-sm sm:text-base font-medium text-gray-600 mb-5 text-center">
                Your cart is currently empty!
              </p>
              <Link
                to="/"
                className="bg-red-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-md font-semibold shadow hover:bg-red-600 transition text-sm sm:text-base"
                title="Continue Shopping"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : (
            <>
              {/* Cart items list */}
              <ul className="divide-y border-t overflow-hidden">
                {visibleItems.map((product) => (
                  <li
                    key={product._id}
                    className="flex flex-col px-0 sm:px-6 py-6 bg-white relative"
                  >
                    <div className="flex items-center gap-4 sm:gap-5 w-full flex-wrap sm:flex-nowrap">
                      <Link
                        to={`/product/${product.id.split("_")[0]}`}
                        className="w-20 h-24 sm:w-24 sm:h-28 rounded overflow-hidden block flex-shrink-0"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      </Link>

                      <div className="flex-1 px-1 sm:px-2 min-w-0">
                        <Link
                          to={`/product/${product.id.split("_")[0]}`}
                          className="block text-sm sm:text-[14px] leading-[22px] font-[500] text-[rgba(0,0,0,0.9)] hover:text-blue-500 truncate"
                        >
                          {product.title}
                        </Link>

                        <p className="text-[13px] sm:text-[14px] text-[#878787]">
                          <span className="font-semibold text-gray-700">
                            Size:
                          </span>{" "}
                          {product.selectedSize || "N/A"}
                        </p>
                        <p className="text-[13px] sm:text-[14px] text-[#878787] mt-1">
                          <span className="font-semibold text-gray-700">
                            Brand:
                          </span>{" "}
                          {product.brand}
                        </p>

                        <div className="mt-1">
                          <span className="text-red-500 font-[600] text-lg sm:text-xl">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="line-through text-gray-500 text-sm sm:text-base ml-2">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <br />
                          {product.discount && (
                            <span className="ml-2 text-green-500 text-xs sm:text-sm font-semibold">
                              {product.discount}% off
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        title="Remove"
                        onClick={() => {
                          removeFromCart(product._id);
                          toast.info("Removed from cart");
                        }}
                        className="p-2 text-lg sm:text-xl text-gray-400 hover:text-red-500 transition flex-shrink-0"
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>

                    {/* Quantity selector */}
                    <div className="mt-4 flex items-center gap-2 w-max select-none ml-24 sm:ml-28">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(product._id, product.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full bg-gray-100 text-black flex items-center justify-center hover:bg-gray-300 transition"
                        aria-label="Decrease quantity"
                      >
                        &minus;
                      </button>

                      <span className="min-w-[40px] sm:min-w-[50px] text-center bg-white px-2 py-1 rounded border border-gray-300 font-semibold text-xs sm:text-sm text-black">
                        {product.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(product._id, product.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full bg-gray-100 text-black flex items-center justify-center hover:bg-gray-300 transition"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {visibleCount < cart.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMore}
                    className="bg-red-500 text-white px-5 sm:px-6 py-2 rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Cart Totals Card */}
        {cart.length > 0 && (
          <div className="w-full lg:max-w-[350px] lg:h-[390px] sticky top-32 self-start bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 lg:w-1/4">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Cart Totals
            </h2>
            <hr className="mb-4" />
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 text-sm sm:text-[16px]">
                Price ({cart.length} item{cart.length !== 1 ? "s" : ""})
              </span>
              <span className="text-red-500 text-sm sm:text-[16px] font-semibold">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 text-sm sm:text-[16px]">
                Discount
              </span>
              <span className="text-[#388e3c] text-sm sm:text-[16px] font-semibold">
                - ₹{totalDiscount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 text-sm sm:text-[16px]">
                Shipping
              </span>
              <span className="font-bold text-gray-700 text-sm sm:text-[16px]">
                Free
              </span>
            </div>
            <div className="flex justify-between items-center mt-6 mb-8 border-t-2 border-b-2 border-dashed p-2">
              <span className="text-black text-sm sm:text-[16px] font-bold">
                Total Amount
              </span>
              <span className="text-red-500 text-sm sm:text-[16px] font-bold">
                ₹{total.toLocaleString()}
              </span>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-[#fa5652] hover:bg-[#e94843] text-white text-sm sm:text-[17px] font-semibold rounded-lg py-2 mt-4 hidden lg:flex lg:items-center lg:justify-center lg:gap-1 shadow transition"
              style={{ letterSpacing: 1 }}
              title="Place Order"
            >
              <IoBagCheckOutline size={20} className="mr-2" />
              PLACE ORDER
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Place Order Button for Mobile */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <Link
            to="/checkout"
            className="w-full bg-[#fa5652] hover:bg-[#e94843] text-white text-base font-semibold rounded-lg py-3 flex items-center justify-center gap-2 shadow transition"
            style={{ letterSpacing: 1 }}
            title="Place Order"
          >
            <IoBagCheckOutline size={20} />
            PLACE ORDER
          </Link>
        </div>
      )}

      {/* Add bottom padding to prevent content from hiding behind fixed button */}
      {cart.length > 0 && <div className="lg:hidden h-20"></div>}
    </div>
  );
};

export default Cart;
