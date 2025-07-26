import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsFillCartFill } from "react-icons/bs";
import { FaBolt, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductImageGallery = ({
  product,
  selectedVariant,
  setSelectedVariant,
  selectedSize,
  isDeliverable,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const colorParam = new URLSearchParams(location.search).get("color");

  const initialVariant =
    product?.variants?.find((v) => v.color === colorParam) ||
    product?.variants?.[0];

  const [selectedImage, setSelectedImage] = useState(
    initialVariant?.images?.[0] || ""
  );
  const [imageKey, setImageKey] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setSelectedImage(selectedVariant?.images?.[0] || "");
  }, [selectedVariant]);

  const handleColorClick = (variant) => {
    setSelectedVariant(variant);
  };

  useEffect(() => {
    setImageKey(Date.now());
  }, [selectedImage]);

  const handleImageClick = (img) => {
    if (img !== selectedImage) {
      setSelectedImage(img);
      setImageKey(Date.now());
    }
  };

  const handleMouseMove = (e) => {
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

  const handleAddToCart = () => {
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

    const cartItem = {
      ...selectedVariant,
      selectedSize: hasSizes ? selectedSize?.size : null,
      quantity: 1,
    };

    console.log("Added to cart:", cartItem);
    toast.success("Item added to cart!");
  };
  

  const handleBuyNow = () => {
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

    navigate("/checkout");
  };

  if (!selectedVariant) return null;

  return (
    <div className="flex items-start gap-2 ml-5 mt-0">
      {/* Thumbnails */}
      <div className="flex flex-col justify-start gap-2">
        {selectedVariant.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumb-${index}`}
            className={`w-16 h-16 rounded-lg cursor-pointer object-cover border-2 ${
              selectedImage === img
                ? "border-black"
                : "border-transparent opacity-50"
            }`}
            onClick={() => handleImageClick(img)}
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
        >
          <img
            key={imageKey}
            src={selectedImage}
            alt="Product"
            className="w-full h-full object-cover transition-all duration-300"
            style={isHovering ? zoomStyle : {}}
          />

          <Link
            to="/wishlist"
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-red-500"
          >
            <FaHeart size={22} />
          </Link>
        </div>

        {/* Cart & Buy buttons */}
        <div className="flex gap-3 mt-4">
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={
              selectedSize &&
              (!selectedSize.inStock || selectedSize.stockQuantity === 0)
            }
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 min-w-[140px] rounded-md font-semibold text-sm md:text-base active:scale-95 transition shadow-sm ${
              selectedSize && selectedSize.stockQuantity === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#ff9f00] hover:bg-[#e68a00] text-white"
            }`}
          >
            <BsFillCartFill className="text-lg" />
            <span>ADD TO CART</span>
          </button>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            disabled={
              selectedSize &&
              (!selectedSize.inStock || selectedSize.stockQuantity === 0)
            }
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 min-w-[140px] rounded-md font-semibold text-sm md:text-base active:scale-95 transition shadow-sm 
    ${
      selectedSize &&
      (!selectedSize.inStock || selectedSize.stockQuantity === 0)
        ? "bg-gray-400 text-white cursor-not-allowed"
        : "bg-[#fb641b] hover:bg-orange-600 text-white"
    }`}
          >
            <FaBolt className="text-base" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
