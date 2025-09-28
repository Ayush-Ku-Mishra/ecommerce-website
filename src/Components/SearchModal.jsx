// Components/SearchModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSearch,
  IoClose,
  IoTimeOutline,
  IoTrendingUpOutline,
  IoPricetagOutline,
  IoFilterOutline,
  IoSparklesOutline,
  IoFlashOutline,
  IoLayersOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchPopularSearches = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/product/popular-searches`
      );

      if (response.data.success) {
        setPopularSearches(response.data.popularSearches);
      }
    } catch (error) {
      console.error("Error fetching popular searches:", error);
      // Fallback to some default searches if API fails
      setPopularSearches(["T-shirts", "Shoes", "Bags"]);
    }
  };

  // Icon mapping for suggestions
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

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchPopularSearches();
    }
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Fetch suggestions
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/product/search-suggestions?query=${query}`
      );

      if (response.data.success) {
        setSuggestions(response.data.suggestions);
      }
    } catch (error) {
      console.error("Suggestions error:", error);
      setSuggestions([]);
    }
  };

  // Search function
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    // Remove setShowSuggestions(false);

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/product/getAllProducts?search=${query}&page=1&perPage=20`
      );

      if (response.data.success) {
        setSearchResults(response.data.products || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  // Debounced functions
  const debouncedSearch = useRef(
    debounce((query) => performSearch(query), 500)
  ).current;

  const debouncedSuggestions = useRef(
    debounce((query) => fetchSuggestions(query), 300)
  ).current;

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);

    if (query.trim()) {
      debouncedSuggestions(query);
      debouncedSearch(query);
    } else {
      setSuggestions([]);
      setSearchResults([]);
    }
  };

  // Save to recent searches
  const saveToRecentSearches = (query) => {
    if (!query.trim()) return;

    const updated = [
      query,
      ...recentSearches.filter((item) => item !== query),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    let searchParams = new URLSearchParams();

    // Always add the search query
    searchParams.set("search", suggestion.query || suggestion.text);

    // Add other parameters based on suggestion type
    if (suggestion.maxPrice) {
      searchParams.set("maxPrice", suggestion.maxPrice);
    }
    if (suggestion.minPrice) {
      searchParams.set("minPrice", suggestion.minPrice);
    }
    if (suggestion.brand) {
      // Handle brand as an array
      searchParams.set("brand", suggestion.brand);
    }
    if (suggestion.category) {
      searchParams.set("category", suggestion.category);
    }
    if (suggestion.filter) {
      searchParams.set("filter", suggestion.filter);
    }

    saveToRecentSearches(suggestion.text);
    navigate(`/products?${searchParams.toString()}`);
    onClose();
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveToRecentSearches(searchQuery);

      // Parse the query for special keywords
      const queryLower = searchQuery.toLowerCase();
      let searchParams = new URLSearchParams();

      // Check for "under X" pattern
      const underMatch = queryLower.match(/under\s+(\d+)/);
      if (underMatch) {
        const priceLimit = underMatch[1];
        const searchTerm = searchQuery.replace(/under\s+\d+/i, "").trim();
        searchParams.set("search", searchTerm);
        searchParams.set("maxPrice", priceLimit);
      } else {
        searchParams.set("search", searchQuery);
      }

      navigate(`/products?${searchParams.toString()}`);
      onClose();
    }
  };

  // Handle result click
  const handleResultClick = (product) => {
    saveToRecentSearches(product.name);
    navigate(`/product/${product._id}`);
    onClose();
  };

  // Handle quick search
  const handleQuickSearch = (query) => {
    saveToRecentSearches(query);

    const queryLower = query.toLowerCase();
    let searchParams = new URLSearchParams();

    // Extract price if mentioned
    const priceMatch = queryLower.match(/under\s+(\d+)/);
    if (priceMatch) {
      searchParams.set("maxPrice", priceMatch[1]);
      searchParams.set("search", query.replace(/under\s+\d+/i, "").trim());
    } else {
      searchParams.set("search", query);
    }

    navigate(`/products?${searchParams.toString()}`);
    onClose();
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white z-[200] md:hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <IoClose className="text-xl" />
          </button>

          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for products, brands and more"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </form>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-80px)] scrollbar-hide pb-14">
          {/* When searching, show both suggestions and products */}
          {searchQuery && (
            <div className="flex flex-col">
              {/* Suggestions Section */}
              {showSuggestions && suggestions && suggestions.length > 0 && (
                <div className="border-b bg-gray-50">
                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-gray-600 mb-2">
                      SUGGESTIONS
                    </h3>
                    <div className="space-y-1">
                      {suggestions.slice(0, 5).map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer"
                        >
                          <div className="text-lg">
                            {getIcon(suggestion.icon)}
                          </div>
                          <span className="text-sm flex-1">
                            {suggestion.displayText}
                          </span>
                          <IoSearch className="text-gray-400 text-sm" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Products Section - Always show when searching */}
              <div className="p-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <p className="mt-2 text-gray-500">Searching...</p>
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-3">
                      PRODUCTS ({searchResults.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.slice(0, 10).map((product) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => handleResultClick(product)}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <img
                            src={
                              product.images?.[0] || "/placeholder-image.jpg"
                            }
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
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
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No products found for "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent and Popular Searches - Only show when not searching */}
          {!searchQuery && (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                      <IoTimeOutline className="text-lg" />
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                  <IoTrendingUpOutline className="text-lg" />
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-full text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchModal;
