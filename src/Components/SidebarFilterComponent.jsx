import React, { useEffect, useState, useCallback } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import useMediaQuery from "@mui/material/useMediaQuery";
import { debounce } from "lodash";

const SidebarFilterComponent = ({
  categoryData,
  onRatingChange,
  onDiscountChange,
  onSubChange,
  onPriceChange,
  selectedSubs = [],
  selectedRating = [],
  selectedDiscount = [],
  selectedPrice = { min: 0, max: 10000 },
  brandOptions = [],
  selectedBrands = [],
  onBrandChange,
  colorOptions = [],
  selectedColors = [],
  onColorChange,
  onResetFilters,
  onApplyFilters,
}) => {
  const isDesktop = useMediaQuery("(min-width:768px)");

  // Create local state for mobile filters
  const [localPriceRange, setLocalPriceRange] = useState([
    selectedPrice.min,
    selectedPrice.max === Infinity ? 10000 : selectedPrice.max,
  ]);
  const [localBrands, setLocalBrands] = useState(selectedBrands || []);
  const [localSubs, setLocalSubs] = useState(selectedSubs || []);
  const [localRatings, setLocalRatings] = useState(selectedRating || []);
  const [localDiscounts, setLocalDiscounts] = useState(selectedDiscount || []);
  const [localColors, setLocalColors] = useState(selectedColors || []);

  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [brandExpanded, setBrandExpanded] = useState(false);
  const [colorExpanded, setColorExpanded] = useState(false);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [expandedThirdLevel, setExpandedThirdLevel] = useState(null);

  // Define debounced functions for desktop mode
  const debouncedBrandChange = useCallback(
    debounce((brands) => {
      onBrandChange(brands);
    }, 300),
    [onBrandChange]
  );

  const debouncedPriceChange = useCallback(
    debounce((newValue) => {
      const min = newValue[0];
      const max = newValue[1] === 10000 ? Infinity : newValue[1];
      onPriceChange({ min, max });
    }, 300),
    [onPriceChange]
  );

  // Sync props with local state when they change
  useEffect(() => {
    setLocalPriceRange([
      selectedPrice.min,
      selectedPrice.max === Infinity ? 10000 : selectedPrice.max,
    ]);
  }, [selectedPrice]);

  useEffect(() => {
    setLocalBrands(selectedBrands || []);
  }, [selectedBrands]);

  useEffect(() => {
    setLocalSubs(selectedSubs || []);
  }, [selectedSubs]);

  useEffect(() => {
    setLocalRatings(selectedRating || []);
  }, [selectedRating]);

  useEffect(() => {
    setLocalDiscounts(selectedDiscount || []);
  }, [selectedDiscount]);

  useEffect(() => {
    setLocalColors(selectedColors || []);
  }, [selectedColors]);

  useEffect(() => {
    if (categoryData?.sub?.length) {
      const firstWithSub = categoryData.sub.find((sub) => {
        if (typeof sub === "string") return false;
        return Array.isArray(sub.sub) && sub.sub.length > 0;
      });
      if (firstWithSub) {
        setExpandedSubcategory(firstWithSub.name);
      }
    }
  }, [categoryData]);

  // Apply function for mobile
  const applyAllFilters = () => {
    // Convert 10000 to Infinity for max price
    const max = localPriceRange[1] === 10000 ? Infinity : localPriceRange[1];
    onPriceChange({ min: localPriceRange[0], max: max });
    onBrandChange(localBrands);
    onSubChange(localSubs);
    onRatingChange(localRatings);
    onDiscountChange(localDiscounts);
    onColorChange(localColors);
    onApplyFilters && onApplyFilters();
  };

  // Handle slider change - just update local state during dragging
  const handleSliderChange = (_, newValue) => {
    setLocalPriceRange(newValue);
  };

  // Apply changes when slider is released
  const handleSliderCommit = (_, newValue) => {
    setLocalPriceRange(newValue);

    // Only apply on desktop when slider is released
    if (isDesktop && onPriceChange) {
      const min = newValue[0];
      const max = newValue[1] === 10000 ? Infinity : newValue[1];
      onPriceChange({ min, max });
    }
  };

  // Input change handler
  const handleInputChange = (e, index) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      const newRange = [...localPriceRange];
      newRange[index] = index === 0 ? 0 : 10000;
      setLocalPriceRange(newRange);
      return;
    }

    const value = Number(inputValue);
    if (!isNaN(value) && value >= 0) {
      const newRange = [...localPriceRange];
      newRange[index] = value;
      setLocalPriceRange(newRange);

      // Apply on desktop after a short delay to prevent rapid firing
      if (
        isDesktop &&
        onPriceChange &&
        typeof newRange[0] === "number" &&
        typeof newRange[1] === "number"
      ) {
        // Use a simple timeout instead of debounce for direct input
        clearTimeout(window.priceInputTimeout);
        window.priceInputTimeout = setTimeout(() => {
          const min = newRange[0];
          const max = newRange[1] === 10000 ? Infinity : newRange[1];
          onPriceChange({ min, max });
        }, 500);
      }
    }
  };

  const valuetext = (value) => `₹${value}`;

  // Handle subcategory change
  const handleSubChange = (itemName) => {
    const updated = localSubs.includes(itemName)
      ? localSubs.filter((s) => s !== itemName)
      : [...localSubs, itemName];

    setLocalSubs(updated);

    // Apply immediately only on desktop
    if (isDesktop && onSubChange) {
      onSubChange(updated);
    }
  };

  // Handle local reset
  const handleResetFilters = () => {
    setLocalPriceRange([0, 10000]);
    setLocalBrands([]);
    setLocalSubs([]);
    setLocalRatings([]);
    setLocalDiscounts([]);
    setLocalColors([]);

    // Always apply reset immediately
    onResetFilters();
  };

  // Helper function to render subcategory items safely with 4-level support
  const renderSubcategoryItems = (items, level = 1) => {
    if (!Array.isArray(items)) return null;

    return items
      .map((item, index) => {
        if (!item) return null;

        // Handle string items (leaf nodes)
        if (typeof item === "string") {
          return (
            <label
              key={`string-${level}-${index}`}
              className="flex items-center gap-2 text-[14px] text-gray-700 cursor-pointer mb-1"
              style={{ marginLeft: `${(level - 1) * 12}px` }}
            >
              <input
                type="checkbox"
                checked={localSubs.includes(item)}
                onChange={() => handleSubChange(item)}
                className="w-4 h-4"
              />
              <span
                className={
                  level === 1 ? "text-[15px] font-semibold text-gray-800" : ""
                }
              >
                {item}
              </span>
            </label>
          );
        }

        // Handle object items with nested structure
        if (typeof item === "object" && item !== null && item.name) {
          const hasChildren = Array.isArray(item.sub) && item.sub.length > 0;
          const isExpanded =
            level === 1
              ? expandedSubcategory === item.name
              : expandedThirdLevel === item.name;

          return (
            <div
              key={`object-${level}-${index}`}
              style={{ marginLeft: `${(level - 1) * 12}px` }}
            >
              {/* Category header with checkbox and expand/collapse */}
              <div className="flex items-center justify-between mb-1">
                <label className="flex items-center gap-2 text-[14px] text-gray-700 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={localSubs.includes(item.name)}
                    onChange={() => handleSubChange(item.name)}
                    className="w-4 h-4"
                  />
                  <span
                    className={
                      level === 1
                        ? "text-[15px] font-semibold text-gray-800"
                        : "font-medium"
                    }
                  >
                    {item.name}
                  </span>
                </label>

                {hasChildren && (
                  <span
                    className="cursor-pointer text-gray-400 hover:text-gray-600 ml-2"
                    onClick={() => {
                      if (level === 1) {
                        setExpandedSubcategory(isExpanded ? null : item.name);
                      } else if (level === 2) {
                        setExpandedThirdLevel(isExpanded ? null : item.name);
                      }
                    }}
                  >
                    {isExpanded ? (
                      <FaChevronUp size={12} />
                    ) : (
                      <FaChevronDown size={12} />
                    )}
                  </span>
                )}
              </div>

              {/* Render children if expanded */}
              {hasChildren && isExpanded && (
                <div className="ml-4 pl-2 border-l border-gray-200 max-h-[130px] overflow-y-auto visible-scrollbar space-y-1">
                  {renderSubcategoryItems(item.sub, level + 1)}
                </div>
              )}
            </div>
          );
        }

        return null;
      })
      .filter(Boolean);
  };

  if (!categoryData) return null;

  return (
    <div className="lg:ml-10 space-y-6">
      {/* CATEGORY SECTION - Updated to support 4 levels */}
      {Array.isArray(categoryData.sub) && categoryData.sub.length > 0 && (
        <div>
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => setCategoryExpanded(!categoryExpanded)}
          >
            <h3 className="text-sm font-bold text-gray-800">
              Shop by Category
            </h3>
            {categoryExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {categoryExpanded && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 visible-scrollbar">
              {renderSubcategoryItems(categoryData.sub)}
            </div>
          )}
        </div>
      )}

      {/* PRICE SECTION */}
      {onPriceChange && (
        <div>
          <h3 className="text-sm font-bold mb-2 text-gray-800">
            Filter by Price
          </h3>
          <Box sx={{ width: "100%", maxWidth: 220, pl: 1 }}>
            <Slider
              getAriaLabel={() => "Price range"}
              value={localPriceRange}
              onChange={handleSliderChange}
              onChangeCommitted={handleSliderCommit}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              min={0}
              max={10000}
              step={100}
            />
            <div className="flex items-center justify-between gap-3 mt-3">
              <div className="flex items-center gap-1">
                <label className="text-[15px] font-medium text-gray-700">
                  Min:
                </label>
                <input
                  type="number"
                  value={localPriceRange[0]}
                  onChange={(e) => handleInputChange(e, 0)}
                  className="w-20 border px-2 py-1 text-sm rounded"
                />
              </div>
              <div className="flex items-center gap-1">
                <label className="text-[15px] font-medium text-gray-700">
                  Max:
                </label>
                <input
                  type="number"
                  value={
                    localPriceRange[1] === Infinity ? "" : localPriceRange[1]
                  }
                  onChange={(e) => handleInputChange(e, 1)}
                  className="w-20 border px-2 py-1 text-sm rounded"
                />
              </div>
            </div>
          </Box>
        </div>
      )}

      {/* COLOR SECTION */}
      {Array.isArray(colorOptions) && colorOptions.length > 0 && (
        <div>
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => setColorExpanded(!colorExpanded)}
          >
            <h3 className="text-sm font-bold text-gray-800">Filter by Color</h3>
            {colorExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          <div
            className={`space-y-2 overflow-y-auto pr-1 transition-all duration-300 visible-scrollbar ${
              colorExpanded ? "max-h-[120px]" : "max-h-[0px]"
            }`}
          >
            {colorOptions.map((color, i) => {
              if (!color) return null;

              return (
                <label
                  key={i}
                  className="flex items-center gap-2 text-[14px] text-gray-700 cursor-pointer ml-2 mb-1"
                >
                  <input
                    type="checkbox"
                    checked={localColors.includes(color)}
                    onChange={() => {
                      const updated = localColors.includes(color)
                        ? localColors.filter((c) => c !== color)
                        : [...localColors, color];

                      setLocalColors(updated);

                      // Apply immediately only on desktop
                      if (isDesktop && onColorChange) {
                        onColorChange(updated);
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span
                    className="w-3 h-3 rounded-full inline-block border"
                    style={{
                      backgroundColor: color.toLowerCase(),
                      borderColor: color.toLowerCase(),
                    }}
                  ></span>
                  <span>{color}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* RATING SECTION */}
      {onRatingChange && (
        <div>
          <h3 className="text-sm font-bold mb-2 text-gray-800">
            Filter by Rating
          </h3>
          <div className="space-y-2 ml-1">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 text-[14px] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localRatings.includes(rating)}
                  onChange={() => {
                    const updated = localRatings.includes(rating)
                      ? localRatings.filter((r) => r !== rating)
                      : [...localRatings, rating];

                    setLocalRatings(updated);

                    // Apply immediately only on desktop
                    if (isDesktop && onRatingChange) {
                      onRatingChange(updated);
                    }
                  }}
                  className="w-4 h-4"
                />
                <Rating value={rating} readOnly size="small" />
                <span className="text-gray-700">& up</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* DISCOUNT SECTION */}
      {onDiscountChange && (
        <div>
          <h3 className="text-sm font-bold mb-2 text-gray-800">
            Filter by Discount
          </h3>
          <div className="space-y-2 ml-1">
            {[50, 30, 10].map((discount) => (
              <label
                key={discount}
                className="flex items-center gap-2 text-[14px] text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localDiscounts.includes(discount)}
                  onChange={() => {
                    const updated = localDiscounts.includes(discount)
                      ? localDiscounts.filter((d) => d !== discount)
                      : [...localDiscounts, discount];

                    setLocalDiscounts(updated);

                    // Apply immediately only on desktop
                    if (isDesktop && onDiscountChange) {
                      onDiscountChange(updated);
                    }
                  }}
                  className="w-4 h-4"
                />
                <span>{discount}% or more</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* BRAND SECTION */}
      {Array.isArray(brandOptions) && brandOptions.length > 0 && (
        <div>
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => setBrandExpanded(!brandExpanded)}
          >
            <h3 className="text-sm font-bold text-gray-800">Filter by Brand</h3>
            {brandExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          <div
            className={`space-y-2 overflow-y-auto pr-1 transition-all duration-300 visible-scrollbar ${
              brandExpanded ? "max-h-[120px]" : "max-h-[0px]"
            }`}
          >
            {brandOptions.map((brand, i) => {
              if (!brand) return null;

              return (
                <label
                  key={i}
                  className="flex items-center gap-2 text-[14px] text-gray-700 cursor-pointer ml-2 mb-1"
                >
                  <input
                    type="checkbox"
                    checked={localBrands.includes(brand)}
                    onChange={() => {
                      const updated = localBrands.includes(brand)
                        ? localBrands.filter((b) => b !== brand)
                        : [...localBrands, brand];

                      setLocalBrands(updated);

                      // Apply immediately only on desktop
                      if (isDesktop && onBrandChange) {
                        debouncedBrandChange(updated);
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span>{brand}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* BUTTONS SECTION - Fixed at bottom for mobile */}
      <div className="flex flex-col gap-3 mt-6 lg:mr-6">
        {/* Desktop Reset Button */}
        <button
          className="hidden md:block bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded"
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>

      {/* Mobile Fixed Bottom Buttons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-50">
        <button
          className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-3 px-4 rounded font-medium"
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
        {onApplyFilters && (
          <button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-3 px-4 rounded font-medium"
            onClick={applyAllFilters}
          >
            Apply Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SidebarFilterComponent;