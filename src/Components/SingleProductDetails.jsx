import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/productItems";
import ProductImageGallery from "./ProductImageGallery";
import SizeChartModal from "./SizeChartModal";
import PincodeChecker from "./PincodeChecker";
import { IoMdArrowDropdown } from "react-icons/io";
import RatingReviewSection from "./RatingReviewSection";
import RelatedProductsSlider from "./RelatedProductsSlider";
import ContactUsPart from "./ContactUsPart";

const SingleProductDetails = () => {
  const { id: variantId } = useParams(); // variant id from URL
  const navigate = useNavigate();

  // State for current product and selected variant
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Find product and variant by variantId
  useEffect(() => {
    let foundProduct = null;
    let foundVariant = null;

    for (const p of products) {
      const v = p.variants.find(
        (variant) => String(variant.id) === String(variantId)
      );
      if (v) {
        foundProduct = p;
        foundVariant = v;
        break;
      }
    }

    setProduct(foundProduct);
    setSelectedVariant(foundVariant);
  }, [variantId]);

  const [selectedSize, setSelectedSize] = useState(null);
  const [showAllColors, setShowAllColors] = useState(false);
  const [isDeliverable, setIsDeliverable] = useState(null);
  const [pincode, setPincode] = useState("");
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    "123 Main Street, Bhubaneswar"
  );
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const addresses = [
    "123 Main Street, Bhubaneswar",
    "456 Gandhi Marg, Cuttack",
    "789 Nehru Street, Khordha",
  ];

  const addressRef = useRef();

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

  // Compute related products based on matching category or subcategory
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const currentCats = Array.isArray(product.category)
      ? product.category.map((c) => c.toLowerCase())
      : [product.category?.toLowerCase()];
    const currentSubs = Array.isArray(product.subcategory)
      ? product.subcategory.map((s) => s.toLowerCase())
      : [];

    return products
      .filter((p) => {
        if (p.id === product.id) return false; // exclude current product
        const pCats = Array.isArray(p.category)
          ? p.category.map((c) => c.toLowerCase())
          : [p.category?.toLowerCase()];
        const pSubs = Array.isArray(p.subcategory)
          ? p.subcategory.map((s) => s.toLowerCase())
          : [];

        const shareCategory = pCats.some((c) => currentCats.includes(c));
        const shareSubcategory = pSubs.some((s) => currentSubs.includes(s));

        return shareCategory || shareSubcategory;
      })
      .slice(0, 10); // limit related to 10 products
  }, [product]);

  if (!product || !selectedVariant) {
    return (
      <div className="text-center text-red-500 mt-10">
        Product or variant not found
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-8">
        <div className="sticky top-32 self-start">
          {/* 🖼️ Image Section */}
          <ProductImageGallery
            product={product}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            selectedSize={selectedSize}
            isDeliverable={isDeliverable}
          />
        </div>

        {/* 🔤 Description Section */}
        <div className="mt-3 overflow-y-auto pr-4 scrollbar-hide">
          <p className="text-[#878787] text-[16px] font-[500]">
            {product.brand}
          </p>
          <h2 className="text-lg font-[400] mb-1 font-custom2 max-w-[700px]">
            {product.name}
          </h2>

          {/* 💰 Pricing Section (now variant-based) */}
          <div className="flex items-center gap-3 mb-3">
            <p className="text-[28px] font-[500] text-[#212121] ">
              ₹{selectedVariant?.discountedPrice}
            </p>
            <p className="line-through text-[#878787] text-[16px] align-middle">
              ₹{selectedVariant?.originalPrice}
            </p>
            <p className="text-[#388e3c] font-[500] text-[16px]">
              {selectedVariant?.discount} off
            </p>
          </div>

          {/* ⭐ Ratings & Reviews */}
          <div className="flex items-center gap-1 mb-4">
            <div className="flex items-center gap-3">
              <span className="bg-green-600 text-white text-sm font-semibold px-1.5 py-0.5 rounded-md">
                {product.rating} ★
              </span>
              <span className="text-[#878787] text-md font-[500]">
                Ratings &
              </span>
            </div>
            <span className="text-[#878787] text-md font-[500]">
              {product.totalReviews} Reviews
            </span>
          </div>

          {/* 🎨 Color Options */}
          <div className="flex gap-10 mb-4 mt-8">
            <p className="text-[14px] font-[500] text-[#878787] min-w-[50px]">
              Color
            </p>

            <div className="flex flex-wrap gap-3 max-w-[600px]">
              {(showAllColors
                ? product?.variants
                : product?.variants.slice(0, 5)
              )?.map((variant, idx) => (
                <img
                  key={idx}
                  src={variant.images[0]}
                  alt={variant.color}
                  title={variant.color}
                  className={`w-14 h-14 rounded-full object-cover cursor-pointer border-2 ${
                    variant.color === selectedVariant.color
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleColorChange(variant)}
                />
              ))}

              {!showAllColors && product?.variants?.length > 5 && (
                <button
                  onClick={() => setShowAllColors(true)}
                  className="w-[64px] h-[64px] flex items-center justify-center text-sm text-[#2874f0] font-medium rounded-md transition"
                >
                  +{product.variants.length - 5} more
                </button>
              )}
            </div>
          </div>

          {/* 📏 Size Options */}
          {selectedVariant?.sizes && selectedVariant.sizes.length > 0 && (
            <div className="mb-4 flex gap-10">
              <p className="text-[14px] font-[500] text-[#878787] mb-2">Size</p>

              <div className="flex flex-col flex-wrap gap-2">
                <div className="flex gap-2 flex-wrap items-center">
                  {selectedVariant.sizes.map((sizeObj, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSizeClick(sizeObj)}
                      className={`px-4 py-2 rounded border-2 text-md font-semibold transition duration-200
                      ${
                        selectedSize?.size === sizeObj.size
                          ? "border-yellow-700 text-yellow-700"
                          : "border-gray-300"
                      }
                      ${
                        !sizeObj.inStock || sizeObj.stockQuantity === 0
                          ? "bg-gray-100 text-gray-400"
                          : "bg-white text-black"
                      }
                    `}
                    >
                      {sizeObj.size}
                    </button>
                  ))}

                  <SizeChartModal imageUrl={product?.sizeChartImage} />
                </div>

                {/* ✅ Stock Status Message */}
                {selectedSize && (
                  <p
                    className={`mt-2 text-md font-medium ${
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

          {/* Delivery Address Section ... */}
          <div className="mt-6 w-full max-w-md">
            <div className="flex items-center gap-2 mb-1">
              <img
                className="h-[18px] w-[18px]"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZWxsaXBzZSBjeD0iOSIgY3k9IjE0LjQ3OCIgZmlsbD0iI0ZGRTExQiIgcng9IjkiIHJ5PSIzLjUyMiIvPjxwYXRoIGZpbGw9IiMyODc0RjAiIGQ9Ik04LjYwOSA3LjAxYy0xLjA4IDAtMS45NTctLjgyNi0xLjk1Ny0xLjg0NSAwLS40ODkuMjA2LS45NTguNTczLTEuMzA0YTIuMDIgMi4wMiAwIDAgMSAxLjM4NC0uNTRjMS4wOCAwIDEuOTU2LjgyNSAxLjk1NiAxLjg0NCAwIC40OS0uMjA2Ljk1OS0uNTczIDEuMzA1cy0uODY0LjU0LTEuMzgzLjU0ek0zLjEzIDUuMTY1YzAgMy44NzQgNS40NzkgOC45MjIgNS40NzkgOC45MjJzNS40NzgtNS4wNDggNS40NzgtOC45MjJDMTQuMDg3IDIuMzEzIDExLjYzNCAwIDguNjA5IDAgNS41ODMgMCAzLjEzIDIuMzEzIDMuMTMgNS4xNjV6Ii8+PC9nPjwvc3ZnPg=="
                alt=""
              />
              <label className="text-sm font-medium mb-1 block text-gray-700">
                Deliver to:
              </label>
            </div>

            <div className="relative" ref={addressRef}>
              <div
                className="w-[75%] px-4 py-2 border border-gray-300 rounded-sm focus:outline-none text-sm cursor-pointer flex justify-between items-center"
                onClick={() => setShowAddressDropdown(!showAddressDropdown)}
              >
                <span>{selectedAddress || "Select or enter address"}</span>
                <IoMdArrowDropdown className="text-xl text-gray-500" />
              </div>

              {showAddressDropdown && (
                <div className="absolute z-10 w-[75%] bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
                  {addresses.map((addr, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddressDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                    >
                      {addr}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className="mt-6 w-full border-t-2 pt-4 cursor-pointer"
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[25px] font-semibold">Product Details</h3>
              <p className="text-[25px] font-semibold">
                {showDetails ? "−" : "+"}
              </p>
            </div>

            {showDetails && (
              <div className="flex flex-col gap-y-3 pr-2">
                {product.productDetails?.map((item, index) => (
                  <div key={index} className="flex text-[14px]">
                    <span className="font-medium text-gray-700 min-w-[120px]">
                      {item.label}:
                    </span>
                    <span className="text-gray-900 ml-1">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border-t-2 mt-5">
                        <RatingReviewSection productId={product.id} />         {" "}
          </div>
        </div>
      </div>

      <div className="ml-11">
        {/* Related Products Section */}
        <RelatedProductsSlider relatedProducts={relatedProducts} />
      </div>

      <div className="mt-8">
        <ContactUsPart />
      </div>
    </div>
  );
};

export default SingleProductDetails;
