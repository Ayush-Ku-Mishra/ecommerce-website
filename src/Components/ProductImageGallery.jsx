import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsFillCartFill } from "react-icons/bs";
import { FaBolt, FaHeart, FaRegHeart } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import { useContext } from "react";
import { Context } from "../main";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ProductImageGallery = ({
  product,
  selectedVariant,
  setSelectedVariant,
  selectedSize,
  isDeliverable,
  onOpenGallery,
}) => {
  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [selectedImage, setSelectedImage] = useState(
    selectedVariant?.images?.[0] || ""
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageKey, setImageKey] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, updateCartCount, updateWishlistCount } =
    useContext(Context);
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const isOutOfStock =
    selectedSize && (!selectedSize.inStock || selectedSize.stockQuantity === 0);
  const images = selectedVariant?.images || [];

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setSelectedImage(selectedVariant?.images?.[0] || "");
    setCurrentImageIndex(0);
  }, [selectedVariant]);

  useEffect(() => {
    setImageKey(Date.now());
  }, [selectedImage]);

  // Navigation functions for mobile swipe
  const goToNextImage = () => {
    if (!selectedVariant?.images?.length) return;
    const nextIndex = (currentImageIndex + 1) % selectedVariant.images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(selectedVariant.images[nextIndex]);
  };

  const goToPrevImage = () => {
    if (!selectedVariant?.images?.length) return;
    const prevIndex =
      currentImageIndex === 0
        ? selectedVariant.images.length - 1
        : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(selectedVariant.images[prevIndex]);
  };

  // Thumbnail click - only changes main image
  const handleImageClick = (img, index) => {
    if (img !== selectedImage) {
      setSelectedImage(img);
      setCurrentImageIndex(index);
      setImageKey(Date.now());
    }
  };

  const handleMouseMove = (e) => {
    if (isMobile) return; // Disable zoom on mobile

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)",
    });
  };

  const resetZoom = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center center",
    });
  };

  // Helper function to generate consistent product ID
  const generateStandardProductId = (variant, size) => {
    const baseProductId = variant.id.split("_")[0];
    return baseProductId;
  };

  useEffect(() => {
    if (!selectedVariant || !isAuthenticated) {
      setIsInWishlistState(false);
      return;
    }

    const checkWishlistStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/wishlist/getWishlist`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          const standardProductId = generateStandardProductId(
            selectedVariant,
            selectedSize
          );

          const isInWishlist = response.data.data.some(
            (item) => item.productId === standardProductId
          );
          setIsInWishlistState(isInWishlist);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [selectedVariant, selectedSize, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    const hasSizes =
      Array.isArray(selectedVariant?.sizes) && selectedVariant.sizes.length > 0;

    if (hasSizes && !selectedSize) {
      toast.error("Please select a size first.");
      return;
    }

    if (
      hasSizes &&
      (!selectedSize.inStock || selectedSize.stockQuantity === 0)
    ) {
      toast.error("Selected size is out of stock.");
      return;
    }

    if (isDeliverable === null || isDeliverable === undefined) {
      toast.error("Please check estimated delivery first.");
      return;
    }

    if (!isDeliverable) {
      toast.error("This product is not deliverable to your location.");
      return;
    }

    try {
      const baseProductId = selectedVariant.id.split("_")[0];
      const standardVariantId = `${baseProductId}_${
        selectedVariant?.color || "default"
      }_${selectedSize?.size || "default"}`;

      const cartData = {
        productId: baseProductId,
        variantId: standardVariantId,
        quantity: 1,
        selectedSize: hasSizes ? selectedSize?.size : null,
        selectedColor: selectedVariant?.color,
        price: Math.round(
          selectedVariant.discountedPrice ?? product.discountedPrice
        ),
        originalPrice: Math.round(
          selectedVariant.originalPrice ?? product.originalPrice
        ),
        productName: product.name,
        productBrand: product.brand,
        productImage: selectedVariant.images?.[0] || product.images?.[0],
        discount: (
          selectedVariant.discount ??
          product.discount ??
          ""
        ).toString(),
      };

      await axios.post(`${API_BASE_URL}/api/v1/cart/createCart`, cartData, {
        withCredentials: true,
      });

      toast.success("Item added to cart!");
      updateCartCount();
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 409) {
        toast.info("Item already in cart");
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }

    const hasSizes =
      Array.isArray(selectedVariant?.sizes) && selectedVariant.sizes.length > 0;

    if (hasSizes && !selectedSize) {
      toast.error("Please select a size first.");
      return;
    }

    if (
      hasSizes &&
      (!selectedSize.inStock || selectedSize.stockQuantity === 0)
    ) {
      toast.error("Selected size is out of stock.");
      return;
    }

    if (isDeliverable === null || isDeliverable === undefined) {
      toast.error("Please check estimated delivery first.");
      return;
    }

    if (!isDeliverable) {
      toast.error("This product is not deliverable to your location.");
      return;
    }

    const buyNowItem = {
      id: `${selectedVariant.id.split("_")[0]}_${
        selectedVariant?.color || "default"
      }_${selectedSize?.size || "default"}`,
      title: product.name,
      brand: product.brand,
      price: Math.round(
        selectedVariant.discountedPrice ?? product.discountedPrice
      ),
      originalPrice: Math.round(
        selectedVariant.originalPrice ?? product.originalPrice
      ),
      quantity: 1,
      selectedSize: hasSizes ? selectedSize?.size : "default",
      image: selectedVariant.images?.[0] || product.images?.[0],
      discount: (selectedVariant.discount ?? product.discount ?? "").toString(),
      _id: `temp_${Date.now()}`,
      isBuyNow: true,
    };

    navigate("/checkout", {
      state: {
        buyNowItem: buyNowItem,
        isBuyNow: true,
      },
    });
  };

  if (!selectedVariant) return null;

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    if (!selectedVariant || !product) return;

    const standardProductId = generateStandardProductId(
      selectedVariant,
      selectedSize
    );

    try {
      if (isInWishlistState) {
        const wishlistResponse = await axios.get(
          `${API_BASE_URL}/api/v1/wishlist/getWishlist`,
          {
            withCredentials: true,
          }
        );

        if (wishlistResponse.data.success) {
          const wishlistItem = wishlistResponse.data.data.find(
            (item) => item.productId === standardProductId
          );
          if (wishlistItem) {
            await axios.delete(
              `${API_BASE_URL}/api/v1/wishlist/deleteWishlist/${wishlistItem._id}`,
              {
                withCredentials: true,
              }
            );
            setIsInWishlistState(false);
            toast.success("Removed from wishlist");
            updateWishlistCount();
          }
        }
      } else {
        const wishlistData = {
          productId: standardProductId,
          productTitle: `${product.name} - ${selectedVariant.color}`,
          image: selectedVariant.images?.[0] || product.images?.[0],
          rating: product.rating || 0,
          price: Math.round(
            selectedVariant.discountedPrice ?? product.discountedPrice
          ),
          discount: selectedVariant.discount ?? product.discount ?? 0,
          oldPrice: Math.round(
            selectedVariant.originalPrice ?? product.originalPrice
          ),
          brand: product.brand,
        };

        await axios.post(
          `${API_BASE_URL}/api/v1/wishlist/createWishlist`,
          wishlistData,
          {
            withCredentials: true,
          }
        );

        setIsInWishlistState(true);
        toast.success("Added to wishlist");
        updateWishlistCount();
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      if (error.response?.status === 409) {
        toast.error("Item already in wishlist");
        setIsInWishlistState(true);
      } else {
        toast.error("Failed to update wishlist");
      }
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="w-full">
          {/* Main Image with Navigation */}
          <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
            {/* Swiper */}
            <Swiper
              pagination={{ dynamicBullets: true }}
              modules={[Pagination]}
              onSlideChange={(swiper) => {
                setCurrentImageIndex(swiper.activeIndex);
                setSelectedImage(images[swiper.activeIndex]);
                setImageKey(Date.now());
              }}
              className="h-full"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    alt={`${product.name} - ${idx + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => onOpenGallery(images, idx)}
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist();
              }}
              className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 transition-all duration-200 hover:bg-white hover:shadow-xl hover:scale-110 active:scale-95 z-10 ${
                isInWishlistState
                  ? "text-red-500"
                  : "text-gray-700 hover:text-red-500"
              }`}
              title={
                isInWishlistState ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              {isInWishlistState ? (
                <FaHeart className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <FaRegHeart className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>

          {/* Fixed Bottom Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-10 shadow-lg">
            <div className="flex gap-3 max-w-sm mx-auto">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold text-white transition shadow-sm ${
                  isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#ff9f00] hover:bg-[#e68a00]"
                }`}
              >
                <BsFillCartFill className="text-lg" />
                <span className="text-sm">ADD TO CART</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold text-white transition shadow-sm ${
                  isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#fb641b] hover:bg-orange-600"
                }`}
              >
                <FaBolt className="text-base" />
                <span className="text-sm">BUY NOW</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Desktop Layout (Original)
        <div className="flex items-start gap-4 ml-5 mt-0">
          {/* Thumbnails */}
          <div className="flex flex-col justify-start gap-2">
            {selectedVariant.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumb-${index}`}
                className={`w-16 h-16 rounded-lg cursor-pointer object-cover ${
                  selectedImage === img
                    ? "border-2 border-black"
                    : "border-2 border-transparent opacity-50"
                }`}
                onClick={() => handleImageClick(img, index)}
              />
            ))}
          </div>

          <div>
            {/* Main Image */}
            <div
              className="w-[350px] h-[460px] border rounded-md overflow-hidden relative custom-cursor"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => {
                setIsHovering(false);
                resetZoom();
              }}
              onClick={() =>
                onOpenGallery(selectedVariant.images, currentImageIndex)
              }
            >
              <img
                key={imageKey}
                src={selectedImage}
                alt="Product"
                className="w-full h-full object-cover transition-all duration-300"
                style={isHovering ? zoomStyle : {}}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist();
                }}
                className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md transition ${
                  isInWishlistState
                    ? "text-red-500"
                    : "text-gray-600 hover:text-red-500"
                }`}
                title={
                  isInWishlistState ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {isInWishlistState ? (
                  <FaHeart size={22} className="text-red-500" />
                ) : (
                  <FaRegHeart size={22} className="text-gray-400" />
                )}
              </button>
            </div>

            {/* Cart and Buy buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 min-w-[140px] rounded-md font-semibold text-white transition shadow-sm ${
                  isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#ff9f00] hover:bg-[#e68a00]"
                }`}
              >
                <BsFillCartFill className="text-lg" />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-semibold text-white transition shadow-sm ${
                  isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#fb641b] hover:bg-orange-600"
                }`}
              >
                <FaBolt className="text-base" />
                <span>BUY NOW</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImageGallery;
