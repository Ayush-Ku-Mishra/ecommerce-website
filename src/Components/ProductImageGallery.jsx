import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsFillCartFill } from "react-icons/bs";
import { FaBolt, FaHeart } from "react-icons/fa";

const ProductImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [imageKey, setImageKey] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setImageKey(Date.now());
  }, []);

  const handleImageClick = (img) => {
    if (img !== selectedImage) {
      setAnimate(true);
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

  return (
    <div className="flex items-start gap-2 ml-5 mt-0">
      {/* Side thumbnails */}
      <div className="flex flex-col justify-start">
        {images.map((img, index) => (
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
            className={`w-full h-full object-cover transition-all duration-300 ${
              animate ? "animate-slideIn" : ""
            }`}
            style={isHovering ? zoomStyle : {}}
            onAnimationEnd={() => setAnimate(false)}
          />

          {/* Wishlist icon */}
          <Link
            to="/wishlist"
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-red-500"
          >
            <FaHeart size={22} />
          </Link>
        </div>

        {/* Cart & Buy buttons */}
        <div className="flex gap-3 mt-4">
          <Link
            to="/cart"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-w-[140px] border bg-[#ff9f00] hover:bg-[#e68a00] text-white rounded-md font-semibold text-sm md:text-base active:scale-95 transition shadow-sm"
          >
            <BsFillCartFill className="text-lg" />
            <span>ADD TO CART</span>
          </Link>
          <Link
            to="/checkout"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-w-[140px] bg-[#fb641b] text-white rounded-md font-semibold text-sm md:text-base hover:bg-orange-600 active:scale-95 transition shadow-sm"
          >
            <FaBolt className="text-base" />
            <span>BUY NOW</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
