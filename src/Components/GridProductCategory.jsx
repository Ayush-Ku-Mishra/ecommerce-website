import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { HiViewGrid } from "react-icons/hi";
import { TfiViewListAlt } from "react-icons/tfi";
import { BsCart4 } from "react-icons/bs";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ContactUsPart from "./ContactUsPart";
import { products } from "../data/productItems";
import { categories } from "../data/categories";

import { useSelector, useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice"; // adjust path if needed
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";

const GridProductCategory = ({ SidebarFilterComponent }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Redux wishlist hooks
  const wishlist = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  // Use category from URL search params
  const category = searchParams.get("category");
  console.log("Selected category:", category);

  // Correctly find categoryData based on URL param category
  const categoryData = Array.isArray(categories)
    ? categories.find(
        (cat) =>
          typeof cat?.name === "string" &&
          typeof category === "string" &&
          cat.name.toLowerCase() === category.toLowerCase()
      )
    : null;

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [selectedRating, setSelectedRating] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState({ min: 0, max: Infinity });
  const [viewType, setViewType] = useState("grid");
  const [sortOption, setSortOption] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredProducts = useMemo(() => {
    if (!category) return products; // fallback: show all if no category

    return products.filter((product) => {
      const productCategories = Array.isArray(product.category)
        ? product.category
        : [product.category];

      return productCategories.some(
        (cat) =>
          typeof cat === "string" &&
          cat.toLowerCase() === category.toLowerCase()
      );
    });
  }, [products, category]);

  const brandOptions = useMemo(
    () => [...new Set(filteredProducts.map((p) => p.brand))].sort(),
    [filteredProducts]
  );

  const colorOptions = useMemo(() => {
    return [
      ...new Set(
        filteredProducts.flatMap((p) => {
          const defaultColor = p?.defaultVariant?.color?.toLowerCase?.();
          const variantColors = Array.isArray(p?.variants)
            ? p.variants.map((v) => v?.color?.toLowerCase?.()).filter(Boolean)
            : [];
          return [defaultColor, ...variantColors].filter(Boolean);
        })
      ),
    ].sort();
  }, [filteredProducts]);

  useEffect(() => {
    const category = searchParams.get("category") || "";
    const subs = searchParams.getAll("sub");
    const rating = searchParams.getAll("rating").map(Number);
    const discount = searchParams.getAll("discount").map(Number);
    const brands = searchParams.getAll("brand");
    const colors = searchParams.getAll("color");
    const view = searchParams.get("view") || "grid";
    const sort = searchParams.get("sort") || "";
    const minPrice = parseInt(searchParams.get("minPrice")) || 0;
    const maxPrice = parseInt(searchParams.get("maxPrice")) || Infinity;

    if (!category) return;

    setSelectedCategory(category);
    setSelectedSubs(subs);
    setSelectedRating(rating);
    setSelectedDiscount(discount);
    setSelectedBrands(brands);
    setSelectedColors(colors);
    setSelectedPrice({ min: minPrice, max: maxPrice });
    setViewType(view);
    setSortOption(sort);
  }, [searchParams]);

  const didMount = React.useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return; // skip initial run to avoid loop
    }

    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    selectedSubs.forEach((s) => params.append("sub", s));
    selectedRating.forEach((r) => params.append("rating", r));
    selectedDiscount.forEach((d) => params.append("discount", d));
    selectedBrands.forEach((b) => params.append("brand", b));
    selectedColors.forEach((c) => params.append("color", c));
    if (selectedPrice.min > 0) params.set("minPrice", selectedPrice.min);
    if (selectedPrice.max !== Infinity)
      params.set("maxPrice", selectedPrice.max);
    if (viewType) params.set("view", viewType);
    if (sortOption) params.set("sort", sortOption);
    setSearchParams(params, { replace: true });
  }, [
    selectedCategory,
    selectedSubs,
    selectedRating,
    selectedDiscount,
    selectedBrands,
    selectedColors,
    selectedPrice,
    viewType,
    sortOption,
    setSearchParams,
  ]);

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

  useEffect(() => {
    const handleScroll = () => {
      // Assume products is your array of product data
      const maxProducts = products.length;
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        visibleCount < maxProducts // Only load more if not all shown
      ) {
        setVisibleCount((prev) => {
          // Calculate new count, capped at maxProducts
          const newCount = Math.min(prev + 10, maxProducts);
          return newCount;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up: remove listener if all products are shown
    if (visibleCount >= products.length) {
      window.removeEventListener("scroll", handleScroll);
    }

    // Cleanup on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, products.length]); // Add dependencies here!

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    selectedSubs.forEach((s) => params.append("sub", s));
    selectedRating.forEach((r) => params.append("rating", r));
    selectedDiscount.forEach((d) => params.append("discount", d));
    selectedBrands.forEach((b) => params.append("brand", b));
    selectedColors.forEach((c) => params.append("color", c));
    if (selectedPrice.min > 0) params.set("minPrice", selectedPrice.min);
    if (selectedPrice.max !== Infinity)
      params.set("maxPrice", selectedPrice.max);
    if (viewType) params.set("view", viewType);
    if (sortOption) params.set("sort", sortOption);
    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    setSelectedSubs([]);
    setSelectedRating([]);
    setSelectedDiscount([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedPrice({ min: 0, max: Infinity });

    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    setSearchParams(params, { replace: true });
  };

  const getFilteredVariants = () => {
    let result = [];

    filteredProducts.forEach((product) => {
      const subcategories = Array.isArray(product.subcategory)
        ? product.subcategory
        : [];

      // ✅ Get default variant price for product-level price check
      const defaultPrice =
        product.defaultVariant?.discountedPrice ?? product.discountedPrice ?? 0;

      if (
        (selectedSubs.length === 0 ||
          selectedSubs.some((s) => subcategories.includes(s))) &&
        (selectedRating.length === 0 ||
          selectedRating.some((r) => product.rating >= r)) &&
        (selectedDiscount.length === 0 ||
          selectedDiscount.some((d) => parseInt(product.discount) >= d)) &&
        (selectedBrands.length === 0 ||
          selectedBrands.includes(product.brand)) &&
        // ✅ Add product-level price check
        defaultPrice >= selectedPrice.min &&
        defaultPrice <= selectedPrice.max
      ) {
        const matchingVariants = product.variants.filter((variant) => {
          const colorMatch =
            selectedColors.length === 0 ||
            selectedColors.some(
              (selColor) =>
                variant.color?.toLowerCase() === selColor.toLowerCase()
            );

          const price = variant.discountedPrice ?? product.discountedPrice ?? 0;
          const priceMatch =
            price >= selectedPrice.min && price <= selectedPrice.max;

          return colorMatch && priceMatch;
        });

        // ✅ Add price check for defaultVariant push
        if (
          selectedColors.length === 0 &&
          matchingVariants.length === 0 &&
          product.defaultVariant
        ) {
          const defPrice =
            product.defaultVariant.discountedPrice ??
            product.discountedPrice ??
            0;
          if (defPrice >= selectedPrice.min && defPrice <= selectedPrice.max) {
            matchingVariants.push(product.defaultVariant);
          }
        }

        matchingVariants.forEach((variant) => {
          result.push({ product, variant });
        });
      }
    });

    return result;
  };

  const filteredVariants = useMemo(
    () => getFilteredVariants(),
    [
      filteredProducts,
      selectedSubs,
      selectedRating,
      selectedDiscount,
      selectedBrands,
      selectedColors,
      selectedPrice.min,
      selectedPrice.max,
    ]
  );

  const sortedVariants = useMemo(() => {
    let sorted = [...filteredVariants];

    if (sortOption === "name-asc")
      sorted.sort((a, b) => a.product.name.localeCompare(b.product.name));
    if (sortOption === "name-desc")
      sorted.sort((a, b) => b.product.name.localeCompare(a.product.name));
    if (sortOption === "price-asc")
      sorted.sort(
        (a, b) =>
          (a.variant.discountedPrice ?? a.product.discountedPrice) -
          (b.variant.discountedPrice ?? b.product.discountedPrice)
      );
    if (sortOption === "price-desc")
      sorted.sort(
        (a, b) =>
          (b.variant.discountedPrice ?? b.product.discountedPrice) -
          (a.variant.discountedPrice ?? a.product.discountedPrice)
      );

    return sorted;
  }, [filteredVariants, sortOption]);

  const visibleVariants = useMemo(() => {
    return sortedVariants.slice(0, visibleCount);
  }, [sortedVariants, visibleCount]);

  // Fisher-Yates shuffle function (unchanged)
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Remove state and useEffect, instead useMemo with conditional shuffle:
  const shuffledVisibleVariants = React.useMemo(() => {
    if (!sortOption) {
      // No sorting applied, shuffle variants for better UX
      return shuffleArray(visibleVariants);
    }
    // Sorting applied, do not shuffle to preserve sort order
    return visibleVariants;
  }, [visibleVariants, sortOption]);

  // Updated handleProductClick that now navigates with variant id
  const handleProductClick = (variantId) => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
    navigate(`/product/${variantId}`);
  };

  // Check if variant is in wishlist
  const isInWishlist = (variantId) => {
    return wishlist.some((item) => item.id === variantId);
  };

  return (
    <div>
      <div className="p-4 mb-4">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-[24%] bg-white sticky top-24 h-[calc(100vh-96px)] overflow-y-auto pr-2 custom-scroll z-10">
            {SidebarFilterComponent && categoryData && (
              <SidebarFilterComponent
                categoryData={categoryData}
                onCategoryChange={setSelectedCategory}
                onRatingChange={setSelectedRating}
                onDiscountChange={setSelectedDiscount}
                onSubChange={setSelectedSubs}
                onPriceChange={setSelectedPrice}
                onBrandChange={setSelectedBrands}
                onColorChange={setSelectedColors}
                selectedCategory={selectedCategory}
                selectedRating={selectedRating}
                selectedDiscount={selectedDiscount}
                selectedSubs={selectedSubs}
                selectedPrice={selectedPrice}
                selectedBrands={selectedBrands}
                selectedColors={selectedColors}
                brandOptions={brandOptions}
                colorOptions={colorOptions}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />
            )}
          </aside>

          {/* Main Product Area */}
          <main className="scrollbar-hide w-[76%] sticky top-24 h-[calc(100vh-96px)] overflow-y-auto pr-4">
            <div className="flex sticky top-0 z-30 items-center justify-between mb-4 px-3 py-2 bg-gray-100 shadow rounded-md">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewType("grid")}
                  className={`p-1 rounded ${
                    viewType === "grid" ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  <HiViewGrid size={20} />
                </button>
                <button
                  onClick={() => setViewType("list")}
                  className={`p-1 rounded ${
                    viewType === "list" ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  <TfiViewListAlt size={14} />
                </button>
                <span className="text-sm text-gray-700 ml-2">
                  There are {filteredVariants.length} products.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  <option value="">-- Select --</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Product Cards */}
            {viewType === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {shuffledVisibleVariants.map(({ product, variant }) => {
                  const productImage =
                    variant.images?.[0] || product.images?.[0];

                  // new: isInWishlist for this card
                  const inWishlist = isInWishlist(variant.id);

                  return (
                    <div key={variant.id} className="w-full shadow-md bg-white">
                      <div
                        onClick={() => handleProductClick(variant.id)}
                        className="w-full h-48 overflow-hidden rounded-md relative group cursor-pointer"
                      >
                        <img
                          src={productImage}
                          alt={`${product.name} - ${variant.color}`}
                          className="w-full h-full object-top object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (inWishlist) {
                              dispatch(removeFromWishlist(variant.id));
                              toast.info("Removed from wishlist");
                            } else {
                              dispatch(
                                addToWishlist({
                                  id: variant.id,
                                  title: product.name,
                                  brand: product.brand,
                                  image:
                                    variant.images?.[0] || product.images?.[0],
                                  price:
                                    variant.discountedPrice ??
                                    product.discountedPrice,
                                  originalPrice:
                                    variant.originalPrice ??
                                    product.originalPrice,
                                  discount: product.discount,
                                  description: product.description || "",
                                })
                              );
                              toast.success("Added to wishlist");
                            }
                          }}
                          className={`absolute top-3 right-3 p-1 rounded-full shadow-md transition ${
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

                      <div className="p-2 shadow-md">
                        <h6 className="text-[13px] mt-2 min-h-[18px] whitespace-nowrap overflow-hidden text-ellipsis text-gray-700 hover:text-red-500">
                          {product.brand}
                        </h6>
                        <h3 className="text-[14px] leading-[20px] mt-1 font-[500] mb-1 text-[rgba(0,0,0,0.9)] min-h-[40px] line-clamp-2 hover:text-red-500">
                          <Link
                            to={`/product/${variant.id}`}
                            className="block w-full"
                          >
                            {product.name} - {variant.color}
                          </Link>
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="line-through text-gray-500 font-[16px]">
                            ₹
                            {(
                              variant.originalPrice ?? product.originalPrice
                            ).toLocaleString()}
                          </span>
                          <span className="text-red-500 font-[600]">
                            ₹
                            {(
                              variant.discountedPrice ?? product.discountedPrice
                            ).toLocaleString()}
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
                          <BsCart4 className="text-[15px] text-red-500 group-hover:text-white transition" />
                          <span className="text-[12px] text-red-500 font-[500] group-hover:text-white transition">
                            ADD TO CART
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {shuffledVisibleVariants.map(({ product, variant }) => {
                  const productImage =
                    variant.images?.[0] || product.images?.[0];

                  const inWishlist = isInWishlist(variant.id);

                  return (
                    <div
                      key={variant.id}
                      className="w-full bg-white shadow rounded-lg overflow-hidden flex"
                    >
                      <div
                        className="w-[25%] h-[320px] relative cursor-pointer"
                        onClick={() => handleProductClick(variant.id)}
                      >
                        <img
                          src={productImage}
                          alt={`${product.name} - ${variant.color}`}
                          className="w-full h-full object-cover p-1 rounded-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (inWishlist) {
                              dispatch(removeFromWishlist(variant.id));
                              toast.info("Removed from wishlist");
                            } else {
                              dispatch(
                                addToWishlist({
                                  id: variant.id,
                                  title: product.name,
                                  brand: product.brand,
                                  image:
                                    variant.images?.[0] || product.images?.[0],
                                  price:
                                    variant.discountedPrice ??
                                    product.discountedPrice,
                                  originalPrice:
                                    variant.originalPrice ??
                                    product.originalPrice,
                                  discount: product.discount,
                                  description: product.description || "",
                                })
                              );
                              toast.success("Added to wishlist");
                            }
                          }}
                          className={`absolute top-3 right-3 p-1 rounded-full shadow-md transition ${
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

                      <div className="w-[60%] p-4 flex flex-col justify-between">
                        <div>
                          <h6 className="text-[13px] min-h-[18px] whitespace-nowrap overflow-hidden text-ellipsis hover:text-red-500">
                            {product.brand}
                          </h6>
                          <h3 className="mt-2 hover:text-red-500">
                            <Link
                              to={`/product/${variant.id}`}
                              className="block w-full"
                            >
                              {product.name} - {variant.color}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-600 mt-2">
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                          </p>
                          <div className="flex items-center gap-3 mt-2 mb-2">
                            <span className="line-through text-gray-500 text-md">
                              ₹
                              {(
                                variant.originalPrice ?? product.originalPrice
                              ).toLocaleString()}
                            </span>
                            <span className="text-red-500 font-semibold text-md">
                              ₹
                              {(
                                variant.discountedPrice ??
                                product.discountedPrice
                              ).toLocaleString()}
                            </span>
                          </div>
                          {product.discount && (
                            <div className="text-green-500 font-semibold text-sm mt-1 ml-1">
                              {product.discount} off
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(product, variant, e)}
                          className="flex items-center gap-2 border border-red-500 px-4 py-2 rounded-md text-md font-[500] text-red-500 hover:bg-black hover:text-white transition w-fit mt-2"
                        >
                          <BsCart4 />
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
      <ContactUsPart />
    </div>
  );
};

export default GridProductCategory;
