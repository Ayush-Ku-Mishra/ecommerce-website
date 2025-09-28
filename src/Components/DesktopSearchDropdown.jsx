// Components/DesktopSearchDropdown.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  IoSearch,
  IoPricetagOutline,
  IoFilterOutline,
  IoSparklesOutline,
  IoFlashOutline,
  IoLayersOutline,
} from "react-icons/io5";
import axios from "axios";

const DesktopSearchDropdown = ({
  isOpen,
  searchResults = [], // Add default empty array
  loading = false, // Add default value
  searchQuery = "",
  onClose,
  onResultClick,
}) => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);

  // Icon mapping
  const getIcon = (iconType) => {
    switch (iconType) {
      case "price":
        return <IoPricetagOutline className="text-green-600" />;
      case "priceRange":
        return <IoPricetagOutline className="text-blue-600" />;
      case "category":
        return <IoLayersOutline className="text-purple-600" />;
      case "brand":
        return <IoSparklesOutline className="text-pink-600" />;
      case "new":
        return <IoFlashOutline className="text-orange-600" />;
      case "sale":
        return <IoFilterOutline className="text-red-600" />;
      default:
        return <IoSearch className="text-gray-600" />;
    }
  };

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery || !isOpen) return;

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/product/search-suggestions?query=${searchQuery}`
        );

        if (response.data.success) {
          setSuggestions(response.data.suggestions || []);
        }
      } catch (error) {
        console.error("Suggestions error:", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchQuery, isOpen]);

  const handleResultClick = (product) => {
    onResultClick(product);
    navigate(`/product/${product._id}`);
    onClose();
  };

  const handleSuggestionClick = (suggestion) => {
    let searchParams = new URLSearchParams();

    // Always add the search query
    searchParams.set("search", suggestion.query || suggestion.text);

    // Handle different types of suggestions
    switch (suggestion.type) {
      case "price":
        if (suggestion.maxPrice) {
          searchParams.set("maxPrice", suggestion.maxPrice);
        }
        break;
      case "priceRange":
        if (suggestion.minPrice)
          searchParams.set("minPrice", suggestion.minPrice);
        if (suggestion.maxPrice)
          searchParams.set("maxPrice", suggestion.maxPrice);
        break;
      case "category":
        if (suggestion.category) {
          searchParams.set("category", suggestion.category);
        }
        break;
      case "brand":
        if (suggestion.brand) {
          // Handle brand as an array
          searchParams.set("brand", suggestion.brand);
        }
        break;
      case "filter":
        if (suggestion.filter) {
          searchParams.set("filter", suggestion.filter);
        }
        break;
    }

    // Save to recent searches
    const saved = localStorage.getItem("recentSearches");
    const recentSearches = saved ? JSON.parse(saved) : [];
    const updated = [
      suggestion.text,
      ...recentSearches.filter((item) => item !== suggestion.text),
    ].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    navigate(`/products?${searchParams.toString()}`);
    onClose();
  };

  const handleViewAll = () => {
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[500px] overflow-y-auto z-50"
        >
          {loading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <>
              {/* Suggestions Section */}
              {suggestions && suggestions.length > 0 && (
                <div className="border-b">
                  <div className="p-2">
                    <p className="text-xs text-gray-500 px-2 py-1">
                      Suggestions
                    </p>
                    {suggestions.slice(0, 5).map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <div className="text-lg">
                          {getIcon(suggestion.icon)}
                        </div>
                        <span className="text-sm flex-1">
                          {suggestion.displayText}
                        </span>
                        <IoSearch className="text-gray-400 text-sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section - Add null check */}
              {searchResults && searchResults.length > 0 ? (
                <>
                  <div className="p-2">
                    <p className="text-xs text-gray-500 px-2 py-1">Products</p>
                    {searchResults.slice(0, 5).map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleResultClick(product)}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <img
                          src={
                            product.images?.[0] ||
                            product.image ||
                            "/placeholder-image.jpg"
                          }
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {product.brand}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          ₹{product.price}
                        </p>
                      </div>
                    ))}
                  </div>
                  {searchResults.length > 5 && (
                    <button
                      onClick={handleViewAll}
                      className="w-full p-3 text-center text-purple-600 hover:bg-purple-50 border-t text-sm font-medium"
                    >
                      View all {searchResults.length} results
                    </button>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No products found for "{searchQuery}"
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DesktopSearchDropdown;
