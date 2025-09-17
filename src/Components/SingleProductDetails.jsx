import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, Backdrop, CircularProgress } from "@mui/material";
import {
  IoClose,
  IoChevronBack,
  IoChevronForward,
  IoLocationOutline,
  IoHome,
  IoBusiness,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import ProductImageGallery from "./ProductImageGallery";
import SizeChartModal from "./SizeChartModal";
import PincodeChecker from "./PincodeChecker";
import RatingReviewSection from "./RatingReviewSection";
import RelatedProductsSlider from "./RelatedProductsSlider";
import ContactUsPart from "./ContactUsPart";
import axios from "axios";
import { Context } from "../main";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const SingleProductDetails = () => {
  const { id: variantId } = useParams();
  const navigate = useNavigate();

  // State for current product and selected variant
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated } = useContext(Context);

  // Address-related states
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  // Image Gallery Modal State
  const [imageModal, setImageModal] = useState({
    open: false,
    images: [],
    currentIndex: 0,
  });

  // Zoom functionality states
  const [zoomState, setZoomState] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const [lastTap, setLastTap] = useState(0);
  const imageRef = useRef(null);
  const handleTouchStart = useRef({ x: 0, y: 0 });

  const [selectedSize, setSelectedSize] = useState(null);
  const [showAllColors, setShowAllColors] = useState(false);
  const [isDeliverable, setIsDeliverable] = useState(null);
  const [pincode, setPincode] = useState("");
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const addressRef = useRef();

  // Reset zoom when modal opens/closes or image changes
  const resetZoom = () => {
    setZoomState({
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
  };

  // Handle double tap zoom for mobile
  const handleDoubleTap = (e) => {
    if (!isMobile) return;

    const now = Date.now();
    const timeBetween = now - lastTap;

    if (timeBetween < 300 && timeBetween > 0) {
      e.preventDefault();

      if (zoomState.scale === 1) {
        // Get tap position relative to image
        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);

        // Calculate zoom center
        const centerX = (x - rect.left - rect.width / 2) / 2;
        const centerY = (y - rect.top - rect.height / 2) / 2;

        setZoomState({
          scale: 2.5,
          translateX: -centerX,
          translateY: -centerY,
        });
      } else {
        resetZoom();
      }
    }

    setLastTap(now);
  };

  // Handle pan when zoomed (mobile only)
  const handleTouchMove = (e) => {
    if (!isMobile || zoomState.scale === 1) return;

    e.preventDefault();
    const touch = e.touches[0];

    if (handleTouchStart.current.x === 0 && handleTouchStart.current.y === 0) {
      handleTouchStart.current = { x: touch.clientX, y: touch.clientY };
      return;
    }

    const deltaX = touch.clientX - handleTouchStart.current.x;
    const deltaY = touch.clientY - handleTouchStart.current.y;

    setZoomState((prev) => ({
      ...prev,
      translateX: prev.translateX + deltaX / prev.scale,
      translateY: prev.translateY + deltaY / prev.scale,
    }));

    handleTouchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    handleTouchStart.current = { x: 0, y: 0 };
  };

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Helper function to get sizes from product
  const getSizesFromProduct = (product) => {
    const sizes = [];

    if (product.dressSizes && product.dressSizes.length > 0) {
      sizes.push(
        ...product.dressSizes.map((size) => ({
          size: size.size || size,
          inStock: (size.stock || size.stockQuantity || 0) > 0,
          stockQuantity: size.stock || size.stockQuantity || 0,
        }))
      );
    }

    if (product.shoesSizes && product.shoesSizes.length > 0) {
      sizes.push(
        ...product.shoesSizes.map((size) => ({
          size: size.size || size,
          inStock: (size.stock || size.stockQuantity || 0) > 0,
          stockQuantity: size.stock || size.stockQuantity || 0,
        }))
      );
    }

    if (product.freeSize === "yes") {
      sizes.push({
        size: "Free Size",
        inStock: (product.stock || 0) > 0,
        stockQuantity: product.stock || 0,
      });
    }

    return sizes;
  };

  // Fetch saved addresses from API
  const fetchAddresses = async () => {
    setAddressLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/address/addAddress`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;
      if (data.success && data.addresses) {
        setAddresses(data.addresses);

        const defaultAddr = data.addresses.find(
          (addr) => addr.default || addr.isDefault
        );
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        } else if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);

      // Check if it's an authentication error
      if (err.response?.status === 401) {
        console.log(
          "User not authenticated - redirect to login or handle accordingly"
        );
        // You can redirect to login or show login modal here
        // Example: navigate('/login') or setShowLoginModal(true)
      } else {
        console.error("Failed to fetch addresses:", err.message);
        // Show error toast or message to user
        toast.error("Failed to load addresses. Please try again.");
      }
    } finally {
      setAddressLoading(false);
    }
  };

  // Fetch product data from API
  const fetchProduct = async (productId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/product/getProduct/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        const productData = data.product;

        const transformedProduct = {
          id: productData._id,
          name: productData.name,
          brand: productData.brand || "Unknown Brand",
          category: [productData.categoryName || "Uncategorized"],
          subcategory: [
            productData.subCatName,
            productData.thirdSubCatName,
            productData.fourthSubCatName,
          ].filter(Boolean),
          rating: productData.rating || 0,
          totalReviews: productData.totalReviews || 0,
          discount: Number(productData.discount || 0),
          description: productData.productDetails?.description || "",
          images: productData.images || [],
          originalPrice: Number(productData.oldPrice || productData.price || 0),
          discountedPrice: Number(productData.price || 0),
          deliveryDays: productData.deliveryDays || 7,
          sizeChartImage: productData.sizeChartImage || "",
          productDetails: productData.productDetails
            ? Object.entries(productData.productDetails).map(
                ([key, value]) => ({
                  label: key.charAt(0).toUpperCase() + key.slice(1),
                  value: value,
                })
              )
            : [],
          variants: [
            {
              id: productData._id,
              color: productData.color || "Default",
              images: productData.images || [],
              originalPrice: Number(
                productData.oldPrice || productData.price || 0
              ),
              discountedPrice: Number(productData.price || 0),
              discount: Number(productData.discount || 0),
              sizes: getSizesFromProduct(productData),
            },
          ],
        };

        setProduct(transformedProduct);
        setSelectedVariant(transformedProduct.variants[0]);
      } else {
        throw new Error(data.message || "Failed to fetch product");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch product"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (variantId) {
      const baseProductId = variantId.includes("_")
        ? variantId.split("_")[0]
        : variantId;
      fetchProduct(baseProductId);
    }
    fetchAddresses();
  }, [variantId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addressRef.current && !addressRef.current.contains(event.target)) {
        setShowAddressDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSizeClick = (sizeObj) => {
    setSelectedSize(sizeObj);
  };

  const handleColorChange = (variant) => {
    setSelectedVariant(variant);
    setSelectedSize(null);
    navigate(`/product/${variant.id}`, { replace: true });
  };

  // Image Gallery Modal Functions
  const openImageGallery = (images, startIndex = 0) => {
    setImageModal({
      open: true,
      images: images || [],
      currentIndex: startIndex,
    });
    resetZoom(); // Reset zoom when opening gallery
  };

  const closeImageGallery = () => {
    setImageModal({ open: false, images: [], currentIndex: 0 });
    resetZoom(); // Reset zoom when closing gallery
  };

  const goToNextImage = () => {
    setImageModal((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
    }));
    resetZoom(); // Reset zoom when changing images
  };

  const goToPrevImage = () => {
    setImageModal((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex === 0
          ? prev.images.length - 1
          : prev.currentIndex - 1,
    }));
    resetZoom(); // Reset zoom when changing images
  };

  const goToImage = (index) => {
    setImageModal((prev) => ({
      ...prev,
      currentIndex: index,
    }));
    resetZoom(); // Reset zoom when changing images
  };

  // Handle keyboard navigation in gallery
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!imageModal.open) return;

      if (event.key === "Escape") {
        closeImageGallery();
      } else if (event.key === "ArrowLeft") {
        goToPrevImage();
      } else if (event.key === "ArrowRight") {
        goToNextImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [imageModal.open]);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "Select delivery address";
    return `${address.address_line}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}`;
  };

  // Get address type icon
  const getAddressTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "work":
        return <IoBusiness className="text-blue-600" size={18} />;
      default:
        return <IoHome className="text-green-600" size={18} />;
    }
  };

  // Compute related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return [];
  }, [product]);

  // Loading state
  if (loading) {
    return (
      <Backdrop
        open={loading}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", zIndex: 9999 }}
      >
        <div className="text-center">
          <CircularProgress size={60} style={{ color: "#ef4444" }} />
          <p className="text-gray-600 mt-4 text-lg">Loading product...</p>
        </div>
      </Backdrop>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            ⚠️ Error loading product
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProduct(variantId)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className="text-center text-red-500 mt-10">
        Product or variant not found
      </div>
    );
  }

  return (
    <div className={`${isMobile ? "lg:pb-20" : ""}`}>
      <div
        className={`max-w-7xl mx-auto lg:px-4 px-3 lg:py-4 py-2 ${
          isMobile ? "flex-col" : "flex gap-8"
        }`}
      >
        {/* Image Gallery Section */}
        <div
          className={`${isMobile ? "w-full mb-6" : "sticky top-32 self-start"}`}
        >
          <ProductImageGallery
            product={product}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            selectedSize={selectedSize}
            isDeliverable={isDeliverable}
            onOpenGallery={openImageGallery}
          />
        </div>

        {/* Product Details Section */}
        <div
          className={`${
            isMobile ? "w-full" : "mt-3 overflow-y-auto pr-4 scrollbar-hide"
          }`}
        >
          <p className="text-[#878787] text-[16px] font-[500]">
            {product.brand}
          </p>
          <h2
            className={`text-lg font-[400] mb-1 font-custom2 ${
              isMobile ? "max-w-full" : "max-w-[700px]"
            }`}
          >
            {product.name}
          </h2>

          {/* Pricing Section */}
          <div className="flex items-center gap-3 mb-4">
            <p
              className={`${
                isMobile ? "text-[24px]" : "text-[28px]"
              } font-[500] text-[#212121]`}
            >
              ₹{selectedVariant?.discountedPrice}
            </p>
            <p
              className={`line-through text-[#878787] ${
                isMobile ? "text-[14px]" : "text-[16px]"
              } align-middle`}
            >
              ₹{selectedVariant?.originalPrice}
            </p>
            <p
              className={`text-[#388e3c] font-[500] ${
                isMobile ? "text-[14px]" : "text-[16px]"
              }`}
            >
              {selectedVariant?.discount}% off
            </p>
          </div>

          {/* Size Options */}
          {selectedVariant?.sizes && selectedVariant.sizes.length > 0 && (
            <div
              className={`mb-4 ${
                isMobile ? "flex flex-col gap-3" : "flex gap-10"
              }`}
            >
              <p className="text-[14px] font-[500] text-[#878787] mb-2">Size</p>

              <div className="flex flex-col flex-wrap gap-2">
                <div
                  className={`flex gap-2 flex-wrap items-center ${
                    isMobile ? "justify-start" : ""
                  }`}
                >
                  {selectedVariant.sizes.map((sizeObj, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSizeClick(sizeObj)}
                      className={`${
                        isMobile ? "px-3 py-2 text-sm" : "px-4 py-2 text-md"
                      } rounded border-2 font-semibold transition duration-200
            ${
              selectedSize?.size === sizeObj.size
                ? "border-yellow-700 text-yellow-700"
                : "border-gray-300"
            }
            ${
              !sizeObj.inStock || sizeObj.stockQuantity === 0
                ? "bg-gray-200 text-gray-500"
                : "bg-white text-black hover:border-gray-500"
            }
          `}
                    >
                      {sizeObj.size}
                    </button>
                  ))}
                </div>

                {selectedSize && (
                  <p
                    className={`mt-2 ${
                      isMobile ? "text-sm" : "text-md"
                    } font-medium ${
                      selectedSize.inStock && selectedSize.stockQuantity > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedSize.inStock && selectedSize.stockQuantity > 0
                      ? `In Stock (${selectedSize.stockQuantity})`
                      : "Out of Stock"}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Pincode Checker */}
          <PincodeChecker
            pincode={pincode}
            setPincode={setPincode}
            deliveryDays={product.deliveryDays}
            isDeliverable={isDeliverable}
            setIsDeliverable={setIsDeliverable}
            deliveryChecked={deliveryChecked}
            setDeliveryChecked={setDeliveryChecked}
            inStock={selectedSize?.inStock === true}
          />

          {/* Modern Delivery Address Selection */}
          <div
            className={`mt-6 w-full ${isMobile ? "max-w-full" : "max-w-2xl"}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <IoLocationOutline className="text-blue-600" size={20} />
              <label className="text-sm font-semibold text-gray-800">
                Deliver to:
              </label>
            </div>

            <div className="relative" ref={addressRef}>
              {addressLoading ? (
                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <CircularProgress size={20} style={{ color: "#ef4444" }} />
                  <span className="ml-2 text-sm text-gray-600">
                    Loading addresses...
                  </span>
                </div>
              ) : (
                <div
                  className="w-full p-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {selectedAddress ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getAddressTypeIcon(selectedAddress.type)}
                            <span
                              className={`font-semibold text-gray-800 ${
                                isMobile ? "text-sm" : ""
                              }`}
                            >
                              {selectedAddress.name}
                            </span>
                            {(selectedAddress.default ||
                              selectedAddress.isDefault) && (
                              <span
                                className={`bg-green-100 text-green-700 ${
                                  isMobile ? "text-xs" : "text-xs"
                                } px-2 py-1 rounded-full font-medium`}
                              >
                                Default
                              </span>
                            )}
                          </div>
                          <p
                            className={`${
                              isMobile ? "text-xs" : "text-sm"
                            } text-gray-600 leading-relaxed`}
                          >
                            {formatAddress(selectedAddress)}
                          </p>
                          <p
                            className={`${
                              isMobile ? "text-xs" : "text-xs"
                            } text-gray-500`}
                          >
                            📞 {selectedAddress.phone}
                          </p>
                        </div>
                      ) : (
                        <div
                          className={`text-gray-500 ${
                            isMobile ? "text-sm" : "text-sm"
                          }`}
                        >
                          {addresses.length === 0
                            ? "No saved addresses"
                            : "Select delivery address"}
                        </div>
                      )}
                    </div>
                    <IoMdArrowDropdown
                      className={`text-xl text-gray-400 transition-transform duration-200 ${
                        showAddressDropdown ? "transform rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              )}

              {showAddressDropdown && addresses.length > 0 && (
                <div
                  className={`absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-xl mt-2 ${
                    isMobile ? "max-h-60" : "max-h-80"
                  } overflow-y-auto`}
                >
                  <div className="p-2">
                    <div
                      className={`${
                        isMobile ? "text-xs" : "text-xs"
                      } font-semibold text-gray-500 uppercase tracking-wider px-3 py-2`}
                    >
                      Saved Addresses ({addresses.length})
                    </div>

                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => {
                          setSelectedAddress(addr);
                          setShowAddressDropdown(false);
                        }}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 hover:bg-blue-50 ${
                          selectedAddress?._id === addr._id
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              {getAddressTypeIcon(addr.type)}
                              <span
                                className={`font-medium text-gray-800 ${
                                  isMobile ? "text-sm" : "text-sm"
                                }`}
                              >
                                {addr.name}
                              </span>
                              {(addr.default || addr.isDefault) && (
                                <IoCheckmarkCircle
                                  className="text-green-600"
                                  size={16}
                                />
                              )}
                            </div>
                            <p
                              className={`${
                                isMobile ? "text-xs" : "text-xs"
                              } text-gray-600 leading-relaxed`}
                            >
                              {formatAddress(addr)}
                            </p>
                            <p
                              className={`${
                                isMobile ? "text-xs" : "text-xs"
                              } text-gray-400`}
                            >
                              📞 {addr.phone}
                            </p>
                          </div>

                          {selectedAddress?._id === addr._id && (
                            <div className="ml-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div
            className={`mt-6 w-full border-t-2 border-b-2 pt-4 cursor-pointer ${
              isMobile ? "pb-4" : ""
            }`}
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                className={`${
                  isMobile ? "text-[20px]" : "text-[25px]"
                } font-semibold`}
              >
                Product Details
              </h3>
              <p
                className={`${
                  isMobile ? "text-[20px]" : "text-[25px]"
                } font-semibold`}
              >
                {showDetails ? "−" : "+"}
              </p>
            </div>

            {showDetails && (
              <div className="flex flex-col gap-y-3 pr-2">
                {product.productDetails?.map((item, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      isMobile
                        ? "flex-row gap-x-2 items-center"
                        : "flex-row gap-x-2 items-center"
                    } ${isMobile ? "text-[13px]" : "text-[14px]"}`}
                  >
                    <span
                      className={`font-medium text-gray-700 ${
                        isMobile ? "min-w-[120px]" : "min-w-[120px]"
                      }`}
                    >
                      {item.label}:
                    </span>
                    <span className={`text-gray-900 ${isMobile ? "" : "ml-1"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`mt-5 ${isMobile ? "mb-8" : ""}`}>
            <RatingReviewSection productId={product.id} />
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <Dialog
        open={imageModal.open}
        onClose={closeImageGallery}
        maxWidth={false}
        fullScreen
        PaperProps={{
          style: {
            backgroundColor: "rgba(255, 255, 255, 0.95)", // white instead of black
            margin: 0,
            maxHeight: "100vh",
            maxWidth: "100vw",
          },
        }}
      >
        <div className="relative w-full h-full bg-white flex items-center justify-center overflow-hidden">
          {/* Close Button */}
          <button
            onClick={closeImageGallery}
            className="absolute top-4 right-4 z-50 p-3 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-all backdrop-blur-sm"
          >
            <IoClose size={isMobile ? 24 : 28} />
          </button>

          {/* Loading State */}
          {imageModal.images.length === 0 && (
            <div className="flex items-center justify-center">
              <CircularProgress style={{ color: "#000000" }} />{" "}
              {/* black spinner */}
            </div>
          )}

          {/* Main Image */}
          {imageModal.images.length > 0 && (
            <div className="flex items-center justify-center w-full h-full relative">
              <div
                className="relative w-full h-full flex items-center justify-center"
                onTouchStart={isMobile ? (e) => e.preventDefault() : undefined}
                onTouchMove={isMobile ? handleTouchMove : undefined}
                onTouchEnd={isMobile ? handleTouchEnd : undefined}
              >
                <img
                  ref={imageRef}
                  src={imageModal.images[imageModal.currentIndex]}
                  alt={`Product ${imageModal.currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain transition-transform duration-300 cursor-pointer select-none"
                  style={{
                    transform: `scale(${zoomState.scale}) translate(${zoomState.translateX}px, ${zoomState.translateY}px)`,
                    transformOrigin: "center center",
                  }}
                  onClick={handleDoubleTap}
                  onTouchEnd={handleDoubleTap}
                  draggable={false}
                />

                {/* Zoom Instructions */}
                {isMobile && zoomState.scale === 1 && (
                  <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-gray-200 text-black px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    Double tap to zoom
                  </div>
                )}

                {/* Reset Zoom Button */}
                {isMobile && zoomState.scale > 1 && (
                  <button
                    onClick={resetZoom}
                    className="absolute top-20 left-4 p-2 bg-gray-200 text-black rounded-full backdrop-blur-sm z-40"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {imageModal.images.length > 1 && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-all backdrop-blur-sm z-40"
                disabled={zoomState.scale > 1 && isMobile}
              >
                <IoChevronBack size={isMobile ? 24 : 28} />
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-all backdrop-blur-sm z-40"
                disabled={zoomState.scale > 1 && isMobile}
              >
                <IoChevronForward size={isMobile ? 24 : 28} />
              </button>
            </>
          )}

          {/* Thumbnail Navigation */}
          {imageModal.images.length > 1 && zoomState.scale === 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-gray-200 p-3 rounded-lg max-w-[90vw] overflow-x-auto backdrop-blur-sm">
              {imageModal.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`${
                    isMobile ? "w-12 h-12" : "w-16 h-16"
                  } object-cover rounded cursor-pointer border-2 transition-all flex-shrink-0 ${
                    index === imageModal.currentIndex
                      ? "border-black opacity-100"
                      : "border-transparent opacity-60 hover:opacity-80"
                  }`}
                  onClick={() => goToImage(index)}
                />
              ))}
            </div>
          )}

          {/* Swipe/Pan Instructions */}
          {isMobile && zoomState.scale > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-200 text-black px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              Pan to move • Tap reset to zoom out
            </div>
          )}
        </div>
      </Dialog>

      <div className={`${isMobile ? "lg:px-4 lg:mb-0 mb-20" : "lg:ml-11 ml-0"}`}>
        <RelatedProductsSlider
          currentProduct={product}
          currentCategory={product?.category?.[0]}
        />
      </div>
    </div>
  );
};

export default SingleProductDetails;
