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

  const isVariantInWishlist = (variantId) =>
    wishlist.some((item) => item.id === variantId);

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

  const handleAddToCart = (product, variant, e) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        id: variant.id,
        title: product.name,
        brand: product.brand,
        color: variant.color || product.defaultVariant?.color,
        size: variant.sizes?.[0]?.size || "default",
        price: variant.discountedPrice ?? product.discountedPrice,
        originalPrice: variant.originalPrice ?? product.originalPrice,
        quantity: 1,
        image: variant.images?.[0] || product.images?.[0],
        discount: product.discount,
      })
    );
    toast.success("Added to cart!");
  };

  if (!popularProducts || popularProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="px-4 md:px-8">
        <Swiper
          slidesPerView={6}
          navigation={true}
          spaceBetween={10}
          modules={[Navigation]}
          className="mySwiper m-4"
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 8 }, // phones - 2 products per slide
            480: { slidesPerView: 2, spaceBetween: 10 }, // larger phones - 2 products per slide
            640: { slidesPerView: 3, spaceBetween: 10 }, // small tablets
            768: { slidesPerView: 4, spaceBetween: 10 }, // tablets
            1024: { slidesPerView: 5, spaceBetween: 10 }, // laptops
            1280: { slidesPerView: 6, spaceBetween: 10 }, // desktops
          }}
        >
          {popularProducts.map((product) => {
            const variant = product.variants && product.variants[0];
            if (!variant) return null;

            const inWishlist = isVariantInWishlist(variant.id);

            return (
              <SwiperSlide key={product.id}>
                <div className="w-full shadow-md min-w-0 flex-shrink-0">
                  <div className="w-full h-40 sm:h-44 md:h-48 overflow-hidden rounded-md relative group">
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

                        <span className="flex items-center absolute z-50 top-[6px] left-[6px] sm:top-[10px] sm:left-[10px] bg-red-500 text-white rounded-md text-[10px] sm:text-xs px-1">
                          {product.discount}
                        </span>

                        <button
                          onClick={(e) => toggleWishlist(product, e)}
                          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1 rounded-full shadow-md transition ${
                            inWishlist
                              ? "text-red-500 bg-white"
                              : "text-gray-600 bg-white hover:text-red-500"
                          }`}
                          title={
                            inWishlist
                              ? "Remove from Wishlist"
                              : "Add to Wishlist"
                          }
                          aria-label="Toggle wishlist"
                        >
                          {inWishlist ? (
                            <FaHeart size={14} className="sm:w-[18px] sm:h-[18px]" />
                          ) : (
                            <FaRegHeart size={14} className="sm:w-[18px] sm:h-[18px]" />
                          )}
                        </button>
                      </div>
                    </Link>
                  </div>

                  <div className="p-1 sm:p-2 shadow-md">
                    <h6 className="text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2 min-h-[12px] sm:min-h-[18px] whitespace-nowrap overflow-hidden text-ellipsis">
                      <Link
                        to={`/product/${product.id}`}
                        className="hover:text-pink-600 transition"
                      >
                        {product.brand}
                      </Link>
                    </h6>

                    <h3 className="text-xs sm:text-sm md:text-base leading-[16px] sm:leading-[20px] mt-1 font-[500] mb-1 text-[rgba(0,0,0,0.9)] min-h-[16px] sm:min-h-[20px] line-clamp-1">
                      <Link
                        to={`/product/${product.id}`}
                        className="hover:text-pink-600 transition"
                      >
                        {product.name}
                      </Link>
                    </h3>

                    <div className="hidden sm:block">
                      <Rating
                        name="size-small"
                        defaultValue={product.rating}
                        size="small"
                        readOnly
                      />
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <span className="line-through text-gray-500 text-[10px] sm:text-sm font-[16px]">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-red-500 font-[600] text-[10px] sm:text-sm">
                        ₹{product.discountedPrice.toLocaleString()}
                      </span>
                    </div>

                    {product.discount && (
                      <div className="text-green-500 font-semibold text-[10px] sm:text-sm mt-1 ml-1">
                        {product.discount} off
                      </div>
                    )}

                    <button
                      onClick={(e) => handleAddToCart(product, variant, e)}
                      className="group flex items-center w-full max-w-[97%] mx-auto gap-1 sm:gap-2 mt-3 sm:mt-6 mb-1 sm:mb-2 border border-red-500 pl-2 sm:pl-4 pr-2 sm:pr-4 pt-1 sm:pt-2 pb-1 sm:pb-2 rounded-md hover:bg-black transition"
                    >
                      <div className="text-[12px] sm:text-[15px] text-red-500 ml-2 sm:ml-5 group-hover:text-white transition">
                        <BsCart4 />
                      </div>
                      <div className="text-[10px] sm:text-[12px] md:text-sm text-red-500 font-[500] group-hover:text-white transition">
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