import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { HiViewGrid } from "react-icons/hi";
import { TfiViewListAlt } from "react-icons/tfi";
import { BsCart4 } from "react-icons/bs";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { categories } from "../data/categories"; // Fallback categories
import axios from "axios";
import { useContext } from "react";
import { Context } from "../main";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import MobileBottomNav from "./MobileBottomNav";

const GridProductCategory = ({
  SidebarFilterComponent,
  categoryName,
  shouldShowFilter = () => true,
  onFilterClick = () => {},
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // API state management
  const [products, setProducts] = useState([]);
  const [backendCategories, setBackendCategories] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Use category from URL search params or prop
  const category = searchParams.get("category") || categoryName;
  console.log("Selected category:", category);

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
  const location = useLocation();
  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);
  const { isAuthenticated, updateCartCount, updateWishlistCount } =
    useContext(Context);

  const searchQuery = searchParams.get("search");
  const minPriceFromUrl = searchParams.get("minPrice");
  const maxPriceFromUrl = searchParams.get("maxPrice");
  const categoryFromUrl = searchParams.get("category");
  const brandFromUrl = searchParams.get("brand");
  const filterFromUrl = searchParams.get("filter");

  // Fetch categories from backend
  const fetchBackendCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/category/get-categories`
      );

      if (response.data.success) {
        setBackendCategories(response.data.data);
        console.log("Backend categories fetched:", response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching backend categories:", error);
      toast.error("Failed to fetch backend categories");
      // Fallback to static categories if backend fails
      setBackendCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Transform backend category structure to match frontend expectations with 4 levels
  const transformCategoryData = (backendCategories, targetCategoryName) => {
    if (
      !backendCategories ||
      !backendCategories.length ||
      !targetCategoryName
    ) {
      return null;
    }

    // Find the target category (case-insensitive)
    const targetCategory = backendCategories.find(
      (cat) =>
        cat.name && cat.name.toLowerCase() === targetCategoryName.toLowerCase()
    );

    if (!targetCategory) {
      console.log(`Category "${targetCategoryName}" not found in backend data`);
      return null;
    }

    // Transform the structure recursively to support 4 levels
    const transformChildren = (children, level = 1) => {
      if (!children || !Array.isArray(children)) {
        return [];
      }

      return children
        .map((child) => {
          if (!child || !child.name) {
            return null;
          }

          // If child has children, create nested structure
          if (child.children && child.children.length > 0) {
            return {
              name: child.name,
              sub: transformChildren(child.children, level + 1),
            };
          }

          // If no children, return just the name
          return child.name;
        })
        .filter(Boolean); // Remove null values
    };

    const transformedData = {
      name: targetCategory.name,
      sub: targetCategory.children
        ? transformChildren(targetCategory.children)
        : [],
    };

    return transformedData;
  };

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

  // Helper function to generate consistent product ID
  const generateStandardProductId = (productData, variantData) => {
    const baseProductId = productData.id.split("_")[0];
    return baseProductId;
  };

  // API function to fetch products
  const fetchProducts = async (categoryName, searchTerm = null) => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/v1/product/getAllProducts`;
      const params = new URLSearchParams();

      params.append("page", "1");
      params.append("perPage", "1000");

      // Check if we have a search term from URL or parameter
      const currentSearchQuery = searchTerm || searchQuery;

      if (currentSearchQuery) {
        // Use search parameter
        params.append("search", currentSearchQuery);

        // Add other filters if present
        if (minPriceFromUrl) params.append("minPrice", minPriceFromUrl);
        if (maxPriceFromUrl) params.append("maxPrice", maxPriceFromUrl);
        if (brandFromUrl) params.append("brand", brandFromUrl);
        if (filterFromUrl) params.append("filter", filterFromUrl);
      } else if (categoryName) {
        endpoint = `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/product/getAllProductsByCatName`;
        params.append("categoryName", categoryName);
      }

      console.log("Fetching products from:", `${endpoint}?${params}`);

      const response = await axios.get(`${endpoint}?${params}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        const transformedProducts = response.data.products.map((product) => ({
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
          originalPrice: Math.round(
            Number(product.oldPrice || product.price || 0)
          ),
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
        }));

        if (currentSearchQuery) {
          // If this is a search query, update search results
          setSearchResults(transformedProducts);
          setTotalProducts(transformedProducts.length);
        } else {
          // Otherwise update all products
          setProducts(transformedProducts);
          setTotalProducts(response.data.count || transformedProducts.length);
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on current category
  const filteredProducts = useMemo(() => {
    if (loading) return [];

    if (searchQuery) {
      return searchResults; // Use search results when searching
    }

    if (!category) return products;

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
  }, [products, searchResults, category, searchQuery, loading]);

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
    const handleFocus = () => {
      // Refetch products when window regains focus
      if (document.hasFocus()) {
        if (searchQuery) {
          fetchProducts(null, searchQuery);
        } else if (category) {
          fetchProducts(category);
        } else {
          fetchProducts();
        }
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [searchQuery, category]);

  // Update category data when backend categories are loaded or category changes
  useEffect(() => {
    if (backendCategories.length > 0 && category) {
      const transformedData = transformCategoryData(
        backendCategories,
        category
      );
      if (transformedData) {
        setCategoryData(transformedData);
      } else {
        // Fallback to static categories
        const fallbackData = categories.find(
          (cat) =>
            typeof cat?.name === "string" &&
            typeof category === "string" &&
            cat.name.toLowerCase() === category.toLowerCase()
        );
        setCategoryData(fallbackData || null);
      }
    } else if (category) {
      // Use static categories as fallback
      const fallbackData = categories.find(
        (cat) =>
          typeof cat?.name === "string" &&
          typeof category === "string" &&
          cat.name.toLowerCase() === category.toLowerCase()
      );
      setCategoryData(fallbackData || null);
    }
  }, [backendCategories, category]);

  // Fetch categories and products when component mounts
  useEffect(() => {
    fetchBackendCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    let isActive = true;

    const doFetch = async () => {
      if (searchQuery) {
        await fetchProducts(null, searchQuery);
      } else {
        // Clear search results when not searching
        setSearchResults([]);
        if (category) {
          await fetchProducts(category);
        } else {
          await fetchProducts();
        }
      }
    };

    doFetch();

    return () => {
      isActive = false;
    };
  }, [
    searchQuery,
    category,
    minPriceFromUrl,
    maxPriceFromUrl,
    brandFromUrl,
    filterFromUrl,
  ]);

  useEffect(() => {
    const category = searchParams.get("category") || "";
    const subs = searchParams.getAll("sub");
    const rating = searchParams.getAll("rating").map(Number);
    const discount = searchParams.getAll("discount").map(Number);

    // Handle brands - could be comma-separated string
    const brandParam = searchParams.get("brand");
    const brands = brandParam ? brandParam.split(",") : [];

    const colors = searchParams.getAll("color");
    const view = searchParams.get("view") || "grid";
    const sort = searchParams.get("sort") || "";
    const minPrice = parseInt(searchParams.get("minPrice")) || 0;
    const maxPrice = parseInt(searchParams.get("maxPrice")) || Infinity;

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
      return;
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

  useEffect(() => {
    setIsSearching(!!searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    fetchWishlistStatus();
  }, [isAuthenticated]);

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
            {
              withCredentials: true,
            }
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

  useEffect(() => {
    const handleScroll = () => {
      const maxProducts = totalProducts;
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        visibleCount < maxProducts
      ) {
        setVisibleCount((prev) => {
          const newCount = Math.min(prev + 10, maxProducts);
          return newCount;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    if (visibleCount >= totalProducts) {
      window.removeEventListener("scroll", handleScroll);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, totalProducts]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (selectedCategory) params.set("category", selectedCategory);
    selectedSubs.forEach((s) => params.append("sub", s));
    selectedRating.forEach((r) => params.append("rating", r));
    selectedDiscount.forEach((d) => params.append("discount", d));

    // Handle brands
    if (selectedBrands && selectedBrands.length > 0) {
      selectedBrands.forEach((brand) => params.append("brand", brand));
    }

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

    const productsToFilter = searchQuery ? searchResults : filteredProducts;

    productsToFilter.forEach((product) => {
      const subcategories = Array.isArray(product.subcategory)
        ? product.subcategory
        : [];

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

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const shuffledVisibleVariants = React.useMemo(() => {
    if (!sortOption) {
      return shuffleArray(visibleVariants);
    }
    return visibleVariants;
  }, [visibleVariants, sortOption]);

  const handleProductClick = (variantId) => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
    const baseProductId = variantId.split("_")[0];
    navigate(`/product/${baseProductId}`);
  };

  const isInWishlistCheck = (productData, variantData) => {
    const standardProductId = generateStandardProductId(
      productData,
      variantData
    );
    return wishlistItems.has(standardProductId);
  };

  const handleFilterClick = () => {
    setShouldApplyFilters(true);
    handleApplyFilters();
  };

  // Prepare filter props for SidebarFilterComponent
  const filterProps = {
    categoryData: categoryData || {
      name: searchQuery ? "Search Results" : "All Products",
      sub: [],
    },
    onRatingChange: setSelectedRating,
    onDiscountChange: setSelectedDiscount,
    onSubChange: setSelectedSubs,
    onPriceChange: setSelectedPrice,
    selectedSubs,
    selectedRating,
    selectedDiscount,
    selectedPrice,
    brandOptions,
    selectedBrands,
    onBrandChange: (brands) => {
      console.log("Updating brands:", brands); // Debug log
      setSelectedBrands(Array.isArray(brands) ? brands : []);
    },
    onBrandChange: setSelectedBrands,
    colorOptions,
    selectedColors,
    onColorChange: setSelectedColors,
    onApplyFilters: handleApplyFilters,
    onResetFilters: handleResetFilters,
  };

  // Loading state
  if (loading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {categoriesLoading
              ? "Loading categories..."
              : "Loading products..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProducts(category)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 mb-4">
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-1/4 bg-white sticky top-24 h-[calc(100vh-96px)] overflow-y-auto pr-2 custom-scroll z-10">
            {SidebarFilterComponent && (
              <SidebarFilterComponent {...filterProps} />
            )}
          </aside>

          {/* Main Product Area */}
          <main className="scrollbar-hide w-full lg:w-3/4 sticky top-24 h-[calc(100vh-96px)] overflow-y-auto ">
            <div className="flex flex-col sm:flex-row lg:sticky top-0 z-30 items-start sm:items-center justify-between mb-4 px-3 py-2 bg-gray-100 shadow rounded-md gap-3">
              {/* Left section */}
              <div className="flex flex-wrap items-center gap-2">
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
                <span className="text-sm text-gray-700 ml-1 sm:ml-2">
                  There are {filteredVariants.length} products.
                </span>
              </div>

              {/* Right section */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="flex-1 sm:flex-none border border-gray-300 rounded px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  <option value="">-- Select --</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>
            </div>

            {searchQuery && (
              <div className="mb-4 px-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Search results for "{searchQuery}"
                </h2>
                {searchResults.length > 0 ? (
                  <p className="text-sm text-gray-600 mt-1">
                    Found {searchResults.length} products
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mt-1">
                    No products found
                  </p>
                )}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => fetchProducts(category)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Product Cards */}
                {viewType === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {shuffledVisibleVariants.map(({ product, variant }) => {
                      const productImage =
                        variant.images?.[0] || product.images?.[0];
                      const inWishlist = isInWishlistCheck(product, variant);

                      return (
                        <div
                          key={variant.id}
                          className="w-full shadow-md bg-white"
                        >
                          <div
                            onClick={() => handleProductClick(variant.id)}
                            className="w-full h-48 overflow-hidden rounded-md relative group cursor-pointer"
                          >
                            <img
                              src={productImage}
                              alt={`${product.name} - ${variant.color}`}
                              className="w-full h-full object-top object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder-image.jpg";
                              }}
                            />
                            <button
                              onClick={(e) => {
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
                                {Math.round(
                                  variant.originalPrice ?? product.originalPrice
                                )}
                              </span>
                              <span className="text-red-500 font-semibold text-md">
                                ₹
                                {Math.round(
                                  variant.discountedPrice ??
                                    product.discountedPrice
                                )}
                              </span>
                            </div>
                            {product.discount > 0 && (
                              <div className="text-green-500 font-semibold text-sm mt-1 ml-1">
                                {product.discount}% off
                              </div>
                            )}
                            <button
                              onClick={(e) =>
                                handleAddToCart(product, variant, e)
                              }
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
                      const inWishlist = isInWishlistCheck(product, variant);

                      return (
                        <div
                          key={variant.id}
                          className="w-full bg-white shadow rounded-lg overflow-hidden flex flex-col sm:flex-row"
                        >
                          {/* Image section */}
                          <div
                            className="w-full h-72 sm:w-[25%] sm:h-[320px] relative cursor-pointer"
                            onClick={() => handleProductClick(variant.id)}
                          >
                            <img
                              src={productImage}
                              alt={`${product.name} - ${variant.color}`}
                              className="w-full h-full object-cover p-1 rounded-lg"
                              onError={(e) => {
                                e.target.src = "/placeholder-image.jpg";
                              }}
                            />
                            <button
                              onClick={(e) => {
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

                          {/* Details section */}
                          <div className="w-full sm:w-[60%] p-4 flex flex-col justify-between">
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

                              <div className="flex items-center gap-3 mt-2 mb-2">
                                <span className="line-through text-gray-500 text-md">
                                  ₹
                                  {Math.round(
                                    variant.originalPrice ??
                                      product.originalPrice
                                  )}
                                </span>
                                <span className="text-red-500 font-semibold text-md">
                                  ₹
                                  {Math.round(
                                    variant.discountedPrice ??
                                      product.discountedPrice
                                  )}
                                </span>
                              </div>
                              {product.discount > 0 && (
                                <div className="text-green-500 font-semibold text-sm mt-1 ml-1">
                                  {product.discount}% off
                                </div>
                              )}
                            </div>
                            <button
                              onClick={(e) =>
                                handleAddToCart(product, variant, e)
                              }
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
              </>
            )}

            {/* Empty state */}
            {!loading && shuffledVisibleVariants.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                  {searchQuery
                    ? `No products found for "${searchQuery}"`
                    : "No products found"}
                </div>
                <p className="text-gray-400">
                  {searchQuery
                    ? "Try searching with different keywords or check the spelling."
                    : "Try adjusting your filters or check back later."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      navigate("/products");
                      window.location.reload();
                    }}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    View All Products
                  </button>
                )}
              </div>
            )}
          </main>
        </div>

        <MobileBottomNav
          SidebarFilterComponent={SidebarFilterComponent}
          filterProps={{
            ...filterProps,
            onApplyFilters: handleFilterClick,
          }}
          shouldShowFilter={shouldShowFilter}
          setSidebarOpen={() => {}}
          user={isAuthenticated ? {} : null}
          onFilterClick={handleFilterClick}
        />
      </div>
    </div>
  );
};

export default GridProductCategory;
