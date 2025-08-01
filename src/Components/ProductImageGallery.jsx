import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsFillCartFill } from "react-icons/bs";
import { FaBolt, FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
// ADD THIS import for addToCart action
import { addToCart } from "../redux/cartSlice"; // Adjust path if needed

const ProductImageGallery = ({
  product,
  selectedVariant,
  setSelectedVariant,
  selectedSize,
  isDeliverable,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

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

  // UPDATED: Add to Cart button logic dispatches action to Redux store
  const handleAddToCart = () => {
    const hasSizes =
      Array.isArray(selectedVariant?.sizes) && selectedVariant.sizes.length > 0;

    if (hasSizes && !selectedSize) {
      toast.error("Please select a size first.");
      return;
    }

    if (hasSizes && (!selectedSize.inStock || selectedSize.stockQuantity === 0)) {
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
      id: selectedVariant.id,
      title: product.name,
      brand: product.brand,
      image: selectedVariant.images?.[0] || product.images?.[0],
      price: selectedVariant.discountedPrice ?? product.discountedPrice,
      originalPrice: selectedVariant.originalPrice ?? product.originalPrice,
      discount: selectedVariant.discount ?? product.discount ?? "",
      description: product.description || "",
      selectedSize: hasSizes ? selectedSize?.size : null,
      quantity: 1,
    };

    // Dispatch addToCart action here!
    dispatch(addToCart(cartItem));

    toast.success("Item added to cart!");
  };

  const handleBuyNow = () => {
    const hasSizes =
      Array.isArray(selectedVariant?.sizes) && selectedVariant.sizes.length > 0;

    if (hasSizes && !selectedSize) {
      toast.error("Please select a size first.");
      return;
    }

    if (hasSizes && (!selectedSize.inStock || selectedSize.stockQuantity === 0)) {
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

  // Wishlist status and toggle handler
  const isInWishlist = wishlist.some((item) => item.id === selectedVariant.id);
  const toggleWishlist = () => {
    if (!selectedVariant || !product) return;
    if (isInWishlist) {
      dispatch(removeFromWishlist(selectedVariant.id));
      toast.info("Removed from wishlist");
    } else {
      dispatch(
        addToWishlist({
          id: selectedVariant.id,
          title: product.name,
          brand: product.brand,
          image: selectedVariant.images?.[0] || product.images?.[0],
          price: selectedVariant.discountedPrice ?? product.discountedPrice,
          originalPrice: selectedVariant.originalPrice ?? product.originalPrice,
          discount: selectedVariant.discount ?? product.discount ?? "",
          description: product.description || "",
        })
      );
      toast.success("Added to wishlist");
    }
  };

  return (
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

          {/* Wishlist heart button (red filled when in wishlist, outline when not) */}
          <button
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md transition ${
              isInWishlist ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-label="Toggle wishlist"
          >
            {isInWishlist ? (
              <FaHeart size={22} className="text-red-500" />
            ) : (
              <FaRegHeart size={22} className="text-gray-400" />
            )}
          </button>
        </div>

        {/* Cart and Buy buttons */}
        <div className="flex gap-3 mt-4">
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={selectedSize && !selectedSize.inStock}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 min-w-[140px] rounded-md font-semibold text-white transition shadow-sm ${
              selectedSize && selectedSize.stockQuantity === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#ff9f00] hover:bg-[#e68a00]"
            }`}
          >
            <BsFillCartFill className="text-lg" />
            <span>ADD TO CART</span>
          </button>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            disabled={selectedSize && !selectedSize.inStock}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 min-w-[140px] rounded-md font-semibold text-white transition shadow-sm ${
              selectedSize && selectedSize.stockQuantity === 0
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
  );
};

export default ProductImageGallery;
