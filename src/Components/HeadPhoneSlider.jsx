import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { products } from "../data/productItems.js";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { MdZoomOutMap } from "react-icons/md";
import { VscGitCompare } from "react-icons/vsc";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";

import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice"; // Import addToCart here
import { toast } from "react-toastify";

const HeadPhoneSlider = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  const Headphones = products.filter((item) =>
    item.category.some(
      (cat) => typeof cat === "string" && cat.toLowerCase() === "headphones"
    )
  );

  // check if the first variant of a product is in wishlist
  const isVariantInWishlist = (variantId) =>
    wishlist.some((item) => item.id === variantId);

  // wishlist toggle handler
  const toggleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product?.variants || product.variants.length === 0) {
      toast.error("Product variants not available");
      return;
    }

    const variant = product.variants[0]; // using first variant
    const inWishlist = isVariantInWishlist(variant.id);

    if (inWishlist) {
      dispatch(removeFromWishlist(variant.id));
      toast.info("Removed from wishlist");
    } else {
      dispatch(
        addToWishlist({
          id: variant.id,
          title: product.name,
          brand: product.brand,
          image: variant.images?.[0] || product.images?.[0],
          price: variant.discountedPrice ?? product.discountedPrice,
          originalPrice: variant.originalPrice ?? product.originalPrice,
          discount: product.discount,
          description: product.description || "",
        })
      );
      toast.success("Added to wishlist");
    }
  };

  // Add to cart handler with random size selection
  const handleAddToCart = (product, variant, e) => {
    e.stopPropagation(); // Prevent navigation on card click
    dispatch(
      addToCart({
        id: variant.id,
        title: product.name,
        brand: product.brand,
        color: variant.color || product.defaultVariant?.color,
        size: variant.sizes?.[0]?.size || "default", // you can prompt user to pick size
        price: variant.discountedPrice ?? product.discountedPrice,
        originalPrice: variant.originalPrice ?? product.originalPrice,
        quantity: 1,
        image: variant.images?.[0] || product.images?.[0],
        discount: product.discount,
      })
    );
    toast.success("Added to cart!");
  };

  return (
    <div>
      <div>
        <Swiper
          slidesPerView={6}
          spaceBetween={10}
          freeMode={true}
          modules={[FreeMode]}
          className="mySwiper"
        >
          {Headphones.map((product) => {
            const variant = product.variants && product.variants[0];
            if (!variant) return null;

            const inWishlist = isVariantInWishlist(variant.id);

            return (
              <SwiperSlide key={product.id}>
                <div className="w-full shadow-md">
                  <div className="w-full h-48 overflow-hidden rounded-md relative group">
                    <Link to={`/product/${product.id}`}>
                      <div>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-top object-cover"
                        />
                      </div>
                    </Link>

                    <div className="popularProducts absolute top-[-200px] right-[5px] z-50 flex flex-col items-center gap-2 w-[50px] group-hover:top-[15px] transition-all duration-500 opacity-0 group-hover:opacity-100">
                      <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white !text-black hover:!bg-red-500 hover:text-white transition group">
                        <MdZoomOutMap className="text-[22px] !text-black group-hover:text-white transition" />
                      </Button>

                      <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white !text-black hover:!bg-red-500 hover:text-white transition group">
                        <VscGitCompare className="text-[22px] !text-black group-hover:text-white transition" />
                      </Button>

                      {/* Wishlist Button (unchanged) */}
                      <Button
                        onClick={(e) => toggleWishlist(product, e)}
                        className={`!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-white hover:!bg-red-500 hover:text-white transition group ${
                          inWishlist ? "text-red-500" : "text-gray-600"
                        }`}
                        title={
                          inWishlist
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                        aria-label="Toggle wishlist"
                      >
                        {inWishlist ? (
                          <FaHeart className="text-[22px] transition text-red-500 group-hover:text-red-700" />
                        ) : (
                          <FaRegHeart className="text-[22px] !text-black group-hover:text-white transition" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="p-2 shadow-md">
                    <h6 className="text-[13px] mt-2 min-h-[18px] whitespace-nowrap overflow-hidden text-ellipsis">
                      <Link
                        to={`/product/${product.id}`}
                        className="hover:text-pink-600 transition"
                      >
                        {product.brand}
                      </Link>
                    </h6>

                    <h3 className="text-[14px] leading-[20px] mt-1 font-[500] mb-1 text-[rgba(0,0,0,0.9)] min-h-[40px] line-clamp-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="hover:text-pink-600 transition"
                      >
                        {product.name}
                      </Link>
                    </h3>

                    <div className="flex items-center justify-between mb-1">
                      <span className="line-through text-gray-500 font-[16px]">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-red-500 font-[600]">
                        ₹{product.discountedPrice.toLocaleString()}
                      </span>
                    </div>

                    {product.discount && (
                      <div className="text-green-500 font-semibold text-sm mt-1 ml-1">
                        {product.discount} off
                      </div>
                    )}

                    <button
                      onClick={(e) => handleAddToCart(product, variant, e)}
                      className="group flex items-center w-full max-w-[97%] mx-auto gap-2 mt-6 mb-2 border border-red-500 pl-4 pr-4 pt-2 pb-2 rounded-md hover:bg-black transition"
                    >
                      <div className="text-[15px] text-red-500 ml-5 group-hover:text-white transition">
                        <BsCart4 />
                      </div>
                      <div className="text-[12px] text-red-500 font-[500] group-hover:text-white transition">
                        ADD TO CART
                      </div>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default HeadPhoneSlider;
