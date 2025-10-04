import React, { useState, useEffect, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Rating from "@mui/material/Rating";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import toast from "react-hot-toast";
import { ProductSliderSkeleton } from "../Skeletons/ProductSliderSkeleton";

const ProductSlider = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, updateCartCount, updateWishlistCount } =
    useContext(Context);

  // Helper function to get sizes from product
  const getSizesFromProduct = (product) => {
    const sizes = [];
    if (product.dressSizes && product.dressSizes.length > 0) {
      sizes.push(...product.dressSizes);
    }
    if (product.shoesSizes && product.shoesSizes.length > 0) {
      sizes.push(...product.shoesSizes);
    }
    if (product.freeSize === "yes") {
      sizes.push({ size: "Free Size", stock: product.stock || 0 });
    }
    if (sizes.length === 0) {
      sizes.push({ size: "default", stock: product.stock || 0 });
    }
    return sizes;
  };

  // Transform backend product data
  const transformProduct = (product) => {
    return {
      id: product._id,
      name: product.name,
      brand: product.brand || "Unknown Brand",
      category: [product.categoryName || "Uncategorized"],
      subcategory: [
        product.subCatName,
        product.thirdSubCatName,
        product.fourthSubCatName,
      ].filter(Boolean),
      rating: product.rating || 0,
      discount: Number(product.discount || 0),
      description: product.productDetails?.description || "",
      images: product.images || [],
      originalPrice: Math.round(Number(product.oldPrice || product.price || 0)),
      discountedPrice: Math.round(Number(product.price || 0)),
      isFeatured: product.isFeatured || false,
      defaultVariant: {
        id: `${product._id}_default`,
        color: product.color || "Default",
        images: product.images || [],
        originalPrice: Math.round(
          Number(product.oldPrice || product.price || 0)
        ),
        discountedPrice: Math.round(Number(product.price || 0)),
        sizes: getSizesFromProduct(product),
      },
      variants: product.colorVariants
        ? product.colorVariants.map((variant, index) => ({
            id: `${product._id}_variant_${index}`,
            color: variant.colorName || variant.color || "Default",
            images: variant.images || product.images || [],
            originalPrice: Math.round(
              Number(
                variant.oldPrice ||
                  variant.price ||
                  product.oldPrice ||
                  product.price ||
                  0
              )
            ),
            discountedPrice: Math.round(
              Number(variant.price || product.price || 0)
            ),
            sizes: getSizesFromProduct(variant),
          }))
        : [],
    };
  };

  // Fetch Featured Products from all categories
  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/product/getAllProductsForClient?page=1&perPage=100`
      );

      if (response.data.success) {
        // Filter for featured products
        const featuredData = response.data.products.filter(
          (product) => product.isFeatured === true
        );

        const transformedProducts = featuredData.map(transformProduct);
        setFeaturedProducts(transformedProducts);
      } else {
        toast.error("Failed to fetch featured products");
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
      toast.error("Error fetching featured products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist status
  const fetchWishlistStatus = async () => {
    if (!isAuthenticated) {
      setWishlistItems(new Set());
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/wishlist/getWishlist`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const wishlistProductIds = new Set(
          response.data.data.map((item) => item.productId)
        );
        setWishlistItems(wishlistProductIds);
      } else {
        toast.error("Failed to fetch wishlist status");
      }
    } catch (error) {
      console.error("Error fetching wishlist status:", error);
      toast.error("Error fetching wishlist status");
    }
  };

  // Generate standard product ID
  const generateStandardProductId = (productData, variantData) => {
    return productData.id.split("_")[0];
  };

  // Add to wishlist
  const addToWishlistHandler = async (productData, variantData) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    const standardProductId = generateStandardProductId(
      productData,
      variantData
    );

    try {
      const wishlistData = {
        productId: standardProductId,
        productTitle: `${productData.name} - ${variantData.color}`,
        image: variantData.images?.[0] || productData.images?.[0],
        rating: productData.rating || 0,
        price: Math.round(
          variantData.discountedPrice ?? productData.discountedPrice
        ),
        discount: productData.discount || 0,
        oldPrice: Math.round(
          variantData.originalPrice ?? productData.originalPrice
        ),
        brand: productData.brand,
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/wishlist/createWishlist`,
        wishlistData,
        {
          withCredentials: true,
        }
      );

      setWishlistItems((prev) => new Set([...prev, standardProductId]));
      toast.success("Added to wishlist");
      updateWishlistCount();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (error.response?.status === 409) {
        toast.error("Item already in wishlist");
        setWishlistItems((prev) => new Set([...prev, standardProductId]));
      } else {
        toast.error("Failed to add to wishlist");
      }
    }
  };

  // Remove from wishlist
  const removeFromWishlistHandler = async (productData, variantData) => {
    const standardProductId = generateStandardProductId(
      productData,
      variantData
    );

    try {
      const wishlistResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/wishlist/getWishlist`,
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
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/v1/wishlist/deleteWishlist/${wishlistItem._id}`,
            { withCredentials: true }
          );

          setWishlistItems((prev) => {
            const newSet = new Set(prev);
            newSet.delete(standardProductId);
            return newSet;
          });
          toast.success("Removed from wishlist");
          updateWishlistCount();
        }
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  // Add to cart
  const handleAddToCart = async (product, variant, e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const baseProductId = product.id.split("_")[0];
      const standardVariantId = `${baseProductId}_${
        variant.color || "default"
      }_${variant.sizes?.[0]?.size || "default"}`;

      const cartData = {
        productId: baseProductId,
        variantId: standardVariantId,
        quantity: 1,
        selectedSize: variant.sizes?.[0]?.size || null,
        selectedColor: variant.color,
        price: Math.round(variant.discountedPrice ?? product.discountedPrice),
        originalPrice: Math.round(
          variant.originalPrice ?? product.originalPrice
        ),
        productName: product.name,
        productBrand: product.brand,
        productImage: variant.images?.[0] || product.images?.[0],
        discount: product.discount?.toString() || "",
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/cart/createCart`,
        cartData,
        {
          withCredentials: true,
        }
      );

      toast.success("Added to cart!");
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

  // Check if product is in wishlist
  const isInWishlistCheck = (productData, variantData) => {
    const standardProductId = generateStandardProductId(
      productData,
      variantData
    );
    return wishlistItems.has(standardProductId);
  };

  // Toggle wishlist for a product's first variant
  const toggleWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.defaultVariant;
    const inWishlist = isInWishlistCheck(product, variant);
    if (inWishlist) {
      removeFromWishlistHandler(product, variant);
    } else {
      addToWishlistHandler(product, variant);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    fetchWishlistStatus();
  }, [isAuthenticated]);

  if (loading) {
    return <ProductSliderSkeleton />;
  }

  if (!featuredProducts.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No featured products found</p>
      </div>
    );
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
          {featuredProducts.map((product) => {
            const variant = product.defaultVariant;
            const productImage = variant.images?.[0] || product.images?.[0];
            const productHoverImage =
              variant.images?.[1] || product.images?.[1];
            const inWishlist = isInWishlistCheck(product, variant);

            return (
              <SwiperSlide key={product.id}>
                <div className="w-full shadow-md min-w-0 flex-shrink-0 h-[450px] flex flex-col">
                  {" "}
                  {/* Added fixed height and flex column */}
                  {/* Image section - fixed height */}
                  <div className="w-full h-48 overflow-hidden rounded-md relative group">
                    <Link to={`/product/${variant.id.split("_")[0]}`}>
                      <div>
                        <img
                          src={productImage}
                          alt={`${product.name} - ${variant.color}`}
                          className="w-full h-full object-top object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                        {productHoverImage && (
                          <img
                            src={productHoverImage}
                            alt={`${product.name} - ${variant.color} hover`}
                            className="w-full h-full top-0 left-0 object-top object-cover absolute opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:scale-100"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}

                        {product.discount > 0 && (
                          <span className="flex items-center absolute z-50 top-[6px] left-[6px] bg-red-500 text-white rounded-md text-[10px] px-1">
                            {product.discount}% off
                          </span>
                        )}

                        <button
                          onClick={(e) => toggleWishlist(product, e)}
                          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition ${
                            inWishlist
                              ? "text-red-500 bg-white"
                              : "text-gray-600 bg-white hover:text-red-500"
                          }`}
                          title={
                            inWishlist
                              ? "Remove from Wishlist"
                              : "Add to Wishlist"
                          }
                        >
                          {inWishlist ? (
                            <FaHeart size={18} />
                          ) : (
                            <FaRegHeart size={18} />
                          )}
                        </button>
                      </div>
                    </Link>
                  </div>
                  {/* Content section - flex-grow to take remaining space */}
                  <div className="p-2 shadow-md flex-grow flex flex-col">
                    {/* Brand name - fixed height */}
                    <h6 className="text-[13px] mt-2 h-[18px] whitespace-nowrap overflow-hidden text-ellipsis text-gray-700 hover:text-red-500">
                      <Link
                        to={`/product/${variant.id.split("_")[0]}`}
                        className="block w-full"
                      >
                        {product.brand}
                      </Link>
                    </h6>

                    {/* Product name - fixed height with ellipsis */}
                    <h3 className="text-[14px] leading-[20px] mt-1 font-[500] mb-1 text-[rgba(0,0,0,0.9)] h-[40px] line-clamp-2 hover:text-red-500">
                      <Link
                        to={`/product/${variant.id.split("_")[0]}`}
                        className="block w-full"
                      >
                        {product.name} - {variant.color}
                      </Link>
                    </h3>

                    {/* Rating - fixed height */}
                    <div className="h-[24px]">
                      <Rating
                        name="size-small"
                        defaultValue={product.rating}
                        size="small"
                        readOnly
                      />
                    </div>

                    {/* Price section - fixed height */}
                    <div className="h-[24px] flex items-center justify-between">
                      <span className="line-through text-gray-500 font-[16px]">
                        ₹
                        {Math.round(
                          variant.originalPrice ?? product.originalPrice
                        )}
                      </span>
                      <span className="text-red-500 font-semibold text-md">
                        ₹
                        {Math.round(
                          variant.discountedPrice ?? product.discountedPrice
                        )}
                      </span>
                    </div>

                    {/* Discount - fixed height */}
                    <div className="h-[24px]">
                      {product.discount > 0 && (
                        <div className="text-green-500 font-semibold text-sm mt-1 ml-1">
                          {product.discount}% off
                        </div>
                      )}
                    </div>

                    {/* Button section - at the bottom */}
                    <div className="mt-auto">
                      {" "}
                      {/* This pushes the button to the bottom */}
                      <button
                        onClick={(e) => handleAddToCart(product, variant, e)}
                        className="group flex items-center w-full max-w-[97%] mx-auto gap-2 mt-2 mb-2 border border-red-500 pl-4 pr-4 pt-2 pb-2 rounded-md hover:bg-black transition"
                      >
                        <BsCart4 className="text-[15px] text-red-500 group-hover:text-white transition" />
                        <span className="text-[12px] text-red-500 font-[500] group-hover:text-white transition">
                          ADD TO CART
                        </span>
                      </button>
                    </div>
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
