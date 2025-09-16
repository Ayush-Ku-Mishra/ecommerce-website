import React, { useState, useEffect, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../main";
import { IoArrowForward } from "react-icons/io5";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const RelatedProductsSlider = ({ currentProduct, currentCategory }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const navigate = useNavigate();
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

  // Get related products based on exact category level matching only
  const getRelatedProducts = (current, products) => {
    if (!current || !products.length) return [];

    const currentSubs = current.subcategory || [];
    const currentCategory = current.category?.[0];

    const related = products.filter((product) => {
      if (product.id === current.id) return false;

      const productSubs = product.subcategory || [];
      const productCategory = product.category?.[0];

      // Exact matching: Only show products from the same specific level
      // If current product has 4th level, show only 4th level matches
      if (currentSubs[2]) {
        return productSubs[2] && currentSubs[2] === productSubs[2];
      }
      // If current product has 3rd level (but no 4th), show only 3rd level matches
      else if (currentSubs[1]) {
        return (
          productSubs[1] && currentSubs[1] === productSubs[1] && !productSubs[2]
        );
      }
      // If current product has 2nd level (but no 3rd/4th), show only 2nd level matches
      else if (currentSubs[0]) {
        return (
          productSubs[0] &&
          currentSubs[0] === productSubs[0] &&
          !productSubs[1] &&
          !productSubs[2]
        );
      }
      // If current product has only main category, show only main category matches
      else if (currentCategory) {
        return (
          productCategory &&
          currentCategory === productCategory &&
          productSubs.length === 0
        );
      }

      return false;
    });

    return related.slice(0, 20); // Limit to 20 products
  };

  // Fetch related products
  const fetchRelatedProducts = async () => {
    if (!currentProduct) return;

    setLoading(true);
    try {
      // Fetch products from the same category
      const categoryName = currentCategory || currentProduct.category?.[0];
      const endpoint = `${API_BASE_URL}/api/v1/product/getAllProductsByCatName`;
      const params = new URLSearchParams({
        categoryName: categoryName,
        page: "1",
        perPage: "100",
      });

      const response = await axios.get(`${endpoint}?${params}`);

      if (response.data.success) {
        const transformedProducts =
          response.data.products.map(transformProduct);
        const related = getRelatedProducts(currentProduct, transformedProducts);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
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
        `${API_BASE_URL}/api/v1/wishlist/getWishlist`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const wishlistProductIds = new Set(
          response.data.data.map((item) => item.productId)
        );
        setWishlistItems(wishlistProductIds);
      }
    } catch (error) {
      console.error("Error fetching wishlist status:", error);
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
        `${API_BASE_URL}/api/v1/wishlist/createWishlist`,
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

      await axios.post(`${API_BASE_URL}/api/v1/cart/createCart`, cartData, {
        withCredentials: true,
      });

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

  // Handle product click
  const handleProductClick = (variantId) => {
    const baseProductId = variantId.split("_")[0];
    navigate(`/product/${baseProductId}`);
  };

  // Calculate max slides based on screen size
  const getMaxSlides = () => {
    return 0; // Not needed for Swiper
  };

  const maxSlides = useMemo(() => getMaxSlides(), [relatedProducts.length]);

  // Effects
  useEffect(() => {
    fetchRelatedProducts();
  }, [currentProduct, currentCategory]);

  useEffect(() => {
    fetchWishlistStatus();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <div className="lg:mt-8 mt-2 mb-8 lg:px-4 px-2">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Similar Products</h2>
        <IoArrowForward className="text-2xl text-gray-600 cursor-pointer hover:text-gray-900 transition" />
      </div>

      <Swiper
        slidesPerView={6}
        spaceBetween={10}
        freeMode={true}
        modules={[FreeMode]}
        className="mySwiper"
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 8 }, // phones
          480: { slidesPerView: 2, spaceBetween: 10 }, // larger phones
          640: { slidesPerView: 3, spaceBetween: 10 }, // small tablets
          768: { slidesPerView: 4, spaceBetween: 10 }, // tablets
          1024: { slidesPerView: 5, spaceBetween: 10 }, // laptops
          1280: { slidesPerView: 6, spaceBetween: 10 }, // desktops
        }}
      >
        {relatedProducts.map((product) => {
          const variant = product.defaultVariant;
          const productImage = variant.images?.[0] || product.images?.[0];
          const inWishlist = isInWishlistCheck(product, variant);

          return (
            <SwiperSlide key={product.id}>
              <div
                key={variant.id}
                className="w-full shadow-md bg-white rounded-md flex-shrink-0 min-w-0"
              >
                <div className="w-full h-48 overflow-hidden rounded-md relative group cursor-pointer">
                  <Link to={`/product/${variant.id.split("_")[0]}`}>
                    <img
                      src={productImage}
                      alt={`${product.name} - ${variant.color}`}
                      className="w-full h-full object-top object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </Link>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (inWishlist) {
                        removeFromWishlistHandler(product, variant);
                      } else {
                        addToWishlistHandler(product, variant);
                      }
                    }}
                    className={`absolute top-3 right-3 p-1 rounded-full shadow-md transition ${
                      inWishlist
                        ? "text-red-500 bg-white"
                        : "text-gray-600 bg-white hover:text-red-500"
                    }`}
                    title={
                      inWishlist ? "Remove from Wishlist" : "Add to Wishlist"
                    }
                  >
                    {inWishlist ? (
                      <FaHeart size={18} />
                    ) : (
                      <FaRegHeart size={18} />
                    )}
                  </button>
                </div>

                <div className="p-2 shadow-md">
                  <h6 className="text-[13px] mt-2 min-h-[18px] whitespace-nowrap overflow-hidden text-ellipsis text-gray-700 hover:text-pink-600 transition">
                    <Link to={`/product/${variant.id.split("_")[0]}`}>
                      {product.brand}
                    </Link>
                  </h6>
                  <h3 className="text-[14px] leading-[20px] mt-1 font-[500] mb-1 text-[rgba(0,0,0,0.9)] min-h-[40px] line-clamp-2 hover:text-pink-600 transition">
                    <Link to={`/product/${variant.id.split("_")[0]}`}>
                      {product.name} - {variant.color}
                    </Link>
                  </h3>
                  <div className="flex items-center justify-between mb-1">
                    <span className="line-through text-gray-500 font-[16px]">
                      ₹
                      {Math.round(
                        variant.originalPrice ?? product.originalPrice
                      ).toLocaleString()}
                    </span>
                    <span className="text-red-500 font-semibold text-md">
                      ₹
                      {Math.round(
                        variant.discountedPrice ?? product.discountedPrice
                      ).toLocaleString()}
                    </span>
                  </div>
                  {product.discount > 0 && (
                    <div className="text-green-500 font-semibold text-sm mt-1 ml-1">
                      {product.discount}% off
                    </div>
                  )}
                  <button
                    onClick={(e) => handleAddToCart(product, variant, e)}
                    className="group flex items-center w-full max-w-[97%] mx-auto gap-2 mt-6 mb-2 border border-red-500 pl-4 pr-4 pt-2 pb-2 rounded-md hover:bg-black transition"
                  >
                    <BsCart4 className="text-[15px] text-red-500 group-hover:text-white transition ml-2 sm:ml-5" />
                    <span className="text-[12px] sm:text-[15px] md:text-sm text-red-500 font-[500] group-hover:text-white transition">
                      ADD TO CART
                    </span>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default RelatedProductsSlider;
