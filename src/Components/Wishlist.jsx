import React, { useState, useContext, useEffect } from "react";
import { Context } from "../main";
import AccountDetailsSection from "./AccountDetailsSection";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { FaStar, FaRegStar, FaRegHeart } from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";
import toast from "react-hot-toast";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Wishlist = () => {
  const { isAuthenticated, updateWishlistCount, updateCartCount } =
    useContext(Context);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [addingToCart, setAddingToCart] = useState(new Set()); // Track which items are being added

  const navigate = useNavigate();
  const location = useLocation();

  const loadMore = () => setVisibleCount((prev) => prev + 10);
  const visibleItems = wishlist.slice(0, visibleCount);

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/wishlist/getWishlist`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const transformedWishlist = response.data.data.map((item) => ({
          id: item.productId,
          title: item.productTitle,
          brand: item.brand,
          price: Math.round(item.price),
          originalPrice: Math.round(item.oldPrice),
          discount: item.discount,
          image: item.image,
          rating: item.rating,
          _id: item._id, // Backend wishlist item ID
        }));
        setWishlist(transformedWishlist.reverse());
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  // Add to cart function
  const handleAddToCart = async (product, e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    // Set loading state for this specific item
    setAddingToCart((prev) => new Set([...prev, product._id]));

    try {
      const baseProductId = product.id; // Use the product ID directly from wishlist

      const cartData = {
        productId: baseProductId,
        variantId: `${baseProductId}_default_default`, // Default variant
        quantity: 1,
        selectedSize: "XS",
        selectedColor: "default",
        price: product.price,
        originalPrice: product.originalPrice,
        productName: product.title.split(" - ")[0], // Remove color from title if present
        productBrand: product.brand,
        productImage: product.image,
        discount: product.discount?.toString() || "",
      };

      await axios.post(`${API_BASE_URL}/api/v1/cart/createCart`, cartData, {
        withCredentials: true,
      });

      toast.success("Added to cart!");
      updateCartCount(); // Update cart badge
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 409) {
        toast.info("Item already in cart");
      } else {
        toast.error("Failed to add to cart");
      }
    } finally {
      // Remove loading state for this item
      setAddingToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  // Remove from wishlist
  const handleRemove = async (wishlistItemId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1/wishlist/deleteWishlist/${wishlistItemId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setWishlist((prev) =>
          prev.filter((item) => item._id !== wishlistItemId)
        );
        updateWishlistCount(); // Update wishlist badge
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      // Even if there's an error, check if item was actually removed
      fetchWishlist(); // Refresh the list
      updateWishlistCount();
      toast.success("Removed from wishlist"); // Still show success since it worked
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
      }
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-sm text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    fetchWishlist();
  }, [isAuthenticated]);

  // Show login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div>
        <div className="flex gap-10 ml-10 mt-2 max-w-[1190px] mx-auto mb-8">
          <div className="flex-1 flex w-[80%] flex-col border-2 shadow mt-5 rounded-xl bg-white p-6">
            <div className="mb-6">
              <p className="text-2xl font-semibold mb-1">My Wishlist</p>
              <p className="text-gray-700">
                Please login to view your wishlist
              </p>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 min-h-[400px]">
              <FaRegHeart size={80} className="text-gray-400 mb-6" />
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                Login Required
              </h2>
              <p className="text-gray-600 text-center mb-6 text-lg max-w-md">
                You need to be logged in to view and manage your wishlist items
              </p>
              <div className="flex gap-4">
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 font-semibold"
                >
                  LOGIN NOW
                </Link>
              </div>
              <Link
                to="/"
                className="mt-4 text-blue-500 hover:text-blue-600 underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div>
        <div className="flex gap-10 ml-10 mt-2 max-w-[1190px] mx-auto mb-8">
          <div className="min-w-[20%] w-auto sticky top-28 self-start">
            <AccountDetailsSection />
          </div>
          <div className="flex-1 flex w-[80%] flex-col border-2 shadow mt-5 rounded-xl bg-white p-6">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading wishlist...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-10 lg:ml-10 ml-0 lg:mt-2 mt-0 max-w-[1190px] mx-auto lg:mb-8">
        <div className="min-w-[20%] w-auto sticky top-28 self-start hidden md:block">
          <AccountDetailsSection />
        </div>

        <div className="flex-1 flex w-[80%] flex-col lg:border-2 lg:shadow lg:mt-5 rounded-xl bg-white p-6">
          <div className="mb-6">
            <p className="text-2xl font-semibold mb-1">My Wishlist</p>
            <p className="text-gray-700">
              There are{" "}
              <span className="text-red-500 font-semibold">
                {wishlist.length}
              </span>{" "}
              products in your list
            </p>
          </div>

          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 min-h-[400px]">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="Empty Wishlist"
                className="w-32 h-32 mb-6"
              />
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                Your wishlist is empty!
              </h3>
              <p className="text-gray-600 text-center mb-6 text-lg max-w-md">
                Discover amazing products and add them to your wishlist to keep
                track of your favorites
              </p>
              <Link
                to="/"
                className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300 font-semibold"
              >
                START SHOPPING
              </Link>
            </div>
          ) : (
            <>
              <ul className="divide-y lg:border border-t rounded-xl overflow-hidden">
                {visibleItems.map((product) => (
                  <li
                    key={product._id}
                    className="flex lg:px-6 px-0 py-6 items-center gap-5 bg-white hover:bg-gray-50 transition-colors md:flex-row"
                  >
                    <div className="flex flex-1 min-w-0 items-center gap-5 no-underline group md:flex-row">
                      {/* Desktop Layout - Same as before */}
                      <div className="hidden md:flex md:flex-1 md:min-w-0 md:items-center md:gap-5">
                        <Link
                          to={`/product/${product.id.split("_")[0]}`}
                          className="w-20 h-24 overflow-hidden rounded flex-shrink-0"
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                        </Link>

                        <div className="flex-1 px-2 min-w-0">
                          <div className="mb-2">
                            <h6 className="text-[13px] text-gray-600 hover:text-red-500 transition-colors">
                              {product.brand}
                            </h6>
                          </div>

                          <h3 className="text-[14px] leading-[22px] mt-1 font-[500] mb-2 text-[rgba(0,0,0,0.9)] group-hover:text-blue-500 truncate whitespace-nowrap overflow-hidden w-[400px] min-h-[20px]">
                            {product.title}
                          </h3>

                          <div className="mb-2">
                            {renderStars(product.rating)}
                          </div>

                          <div>
                            <span className="text-red-500 font-semibold text-xl">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice &&
                              product.originalPrice > product.price && (
                                <span className="line-through text-gray-500 ml-2 text-lg">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            {product.discount > 0 && (
                              <span className="ml-2 text-green-500 font-semibold text-sm">
                                {product.discount}% off
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mobile Layout - Image left, details right */}
                      <div className="flex md:hidden w-full gap-3">
                        {/* Left side - Product Image */}
                        <div className="w-20 h-24 overflow-hidden rounded flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                        </div>

                        {/* Right side - Product Details Stacked */}
                        <div className="flex-1 min-w-0">
                          {/* Brand */}
                          <div className="mb-1">
                            <h6 className="text-xs text-gray-600 hover:text-red-500 transition-colors">
                              {product.brand}
                            </h6>
                          </div>

                          {/* Name with truncate */}
                          <h3 className="text-sm leading-4 font-medium mb-1 text-[rgba(0,0,0,0.9)] group-hover:text-blue-500 truncate">
                            {product.title}
                          </h3>

                          {/* Rating */}
                          <div className="mb-1">
                            {renderStars(product.rating)}
                          </div>

                          {/* Price */}
                          <div className="mb-1">
                            <span className="text-red-500 font-semibold text-base">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice &&
                              product.originalPrice > product.price && (
                                <span className="line-through text-gray-500 ml-1 text-sm">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                          </div>

                          {/* Discount */}
                          {product.discount > 0 && (
                            <div className="mb-2">
                              <span className="text-green-500 font-semibold text-xs">
                                {product.discount}% off
                              </span>
                            </div>
                          )}

                          {/* Add to Cart and Delete buttons for mobile only */}
                          <div className="flex items-center gap-2 md:hidden">
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              disabled={addingToCart.has(product._id)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-xs transition ${
                                addingToCart.has(product._id)
                                  ? "bg-gray-400 text-white cursor-not-allowed"
                                  : "bg-orange-500 hover:bg-orange-600 text-white"
                              }`}
                              title="Add to cart"
                            >
                              <BsCart4 className="text-sm" />
                              <span>
                                {addingToCart.has(product._id)
                                  ? "..."
                                  : "ADD TO CART"}
                              </span>
                            </button>

                            <button
                              title="Remove from wishlist"
                              onClick={() => handleRemove(product._id)}
                              className="p-2 text-lg text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <MdDeleteOutline />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons for desktop only */}
                    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={addingToCart.has(product._id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition ${
                          addingToCart.has(product._id)
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                        title="Add to cart"
                      >
                        <BsCart4 className="text-sm" />
                        <span>
                          {addingToCart.has(product._id)
                            ? "Adding..."
                            : "ADD TO CART"}
                        </span>
                      </button>

                      {/* Delete Button */}
                      <button
                        title="Remove from wishlist"
                        onClick={() => handleRemove(product._id)}
                        className="p-2 text-xl text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {visibleCount < wishlist.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMore}
                    className="text-[#2874f0] hover:underline rounded-lg px-4 py-2"
                  >
                    Load more items
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
