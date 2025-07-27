import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Rating from "@mui/material/Rating";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";

import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { products } from "../data/productItems.js";

import { useSelector, useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { toast } from "react-toastify";

const ProductSlider = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  const popularProducts = products.filter((item) =>
    item.category.includes("popular")
  );

  // Check if variant is in wishlist
  const isVariantInWishlist = (variantId) =>
    wishlist.some((item) => item.id === variantId);

  // Toggle wishlist for a product's first variant
  const toggleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product?.variants || product.variants.length === 0) {
      toast.error("Product variants not available");
      return;
    }

    const variant = product.variants[0];
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

  if (!popularProducts || popularProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <div>
        <Swiper
          slidesPerView={6}
          navigation={true}
          spaceBetween={10}
          modules={[Navigation]}
          className="mySwiper m-4"
        >
          {popularProducts.map((product) => {
            const variant = product.variants && product.variants[0];
            if (!variant) return null; // if no variant, skip

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
                        {product.images[1] && (
                          <img
                            src={product.images[1]}
                            alt={`${product.name} hover`}
                            className="w-full h-full top-0 left-0 object-top object-cover absolute opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:scale-100"
                          />
                        )}

                        <span className="flex items-center absolute z-50 top-[10px] left-[10px] bg-red-500 text-white rounded-md">
                          {product.discount}
                        </span>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => toggleWishlist(product, e)}
                          className={`absolute top-3 right-3 p-1 rounded-full shadow-md transition ${
                            inWishlist
                              ? "text-red-500 bg-white"
                              : "text-gray-600 bg-white hover:text-red-500"
                          }`}
                          title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                          aria-label="Toggle wishlist"
                        >
                          {inWishlist ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                        </button>
                      </div>
                    </Link>
                  </div>

                  <div className="p-2 shadow-md">
                    <h6 className="text-[13px] mt-2 min-h-[18px] whitespace-nowrap overflow-hidden text-ellipsis">
                      <Link to={`/product/${product.id}`} className="hover:text-pink-600 transition">
                        {product.brand}
                      </Link>
                    </h6>

                    <h3 className="text-[14px] leading-[20px] mt-1 font-[500] mb-1 text-[rgba(0,0,0,0.9)] min-h-[20px] line-clamp-1">
                      <Link to={`/product/${product.id}`} className="hover:text-pink-600 transition">
                        {product.name}
                      </Link>
                    </h3>

                    <Rating
                      name="size-small"
                      defaultValue={product.rating}
                      size="small"
                      readOnly
                    />

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

                    <button className="group flex items-center w-full max-w-[97%] mx-auto gap-2 mt-6 mb-2 border border-red-500 pl-4 pr-4 pt-2 pb-2 rounded-md hover:bg-black transition">
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

export default ProductSlider;
