import React, { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const JewellerySidebarFilter = ({
  categoryData,
  onRatingChange,
  onDiscountChange,
  onSubChange,
  onPriceChange,
  selectedSubs = [],
  selectedRating = [],
  selectedDiscount,
  selectedPrice = { min: 0, max: 10000 },
  brandOptions,
  selectedBrands,
  onBrandChange,
  colorOptions, // ✅ new
  selectedColors, // ✅ new
  onColorChange,
  onApplyFilters,
  onResetFilters, // ✅ new
}) => {
  const [priceRange, setPriceRange] = useState([
    selectedPrice.min,
    selectedPrice.max,
  ]);
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [brandExpanded, setBrandExpanded] = useState(false);
  const [colorExpanded, setColorExpanded] = useState(false); // ✅ new

  const [expandedSubcategory, setExpandedSubcategory] = useState(null);

  useEffect(() => {
    if (categoryData?.sub?.length) {
      const firstWithSub = categoryData.sub.find(
        (sub) => Array.isArray(sub.sub) && sub.sub.length > 0
      );
      if (firstWithSub) {
        setExpandedSubcategory(firstWithSub.name);
      }
    }
  }, [categoryData]);

  useEffect(() => {
    setPriceRange([selectedPrice.min, selectedPrice.max]);
  }, [selectedPrice]);

  const handleSubChange = (subName) => {
    const updated = selectedSubs.includes(subName)
      ? selectedSubs.filter((s) => s !== subName)
      : [...selectedSubs, subName];
    onSubChange(updated);
  };

  const handleRatingChange = (rating) => {
    const updated = selectedRating.includes(rating)
      ? selectedRating.filter((r) => r !== rating)
      : [...selectedRating, rating];
    onRatingChange(updated);
  };

  const handleDiscountChange = (discount) => {
    const updated = selectedDiscount.includes(discount)
      ? selectedDiscount.filter((d) => d !== discount)
      : [...selectedDiscount, discount];
    onDiscountChange(updated);
  };

  const handleColorChange = (color) => {
    const updated = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    onColorChange(updated);
  };

  const handleSliderChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleSliderCommit = (event, newValue) => {
    onPriceChange({ min: newValue[0], max: newValue[1] });
  };

  const handleInputChange = (e, index) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      const newRange = [...priceRange];
      newRange[index] = value;
      setPriceRange(newRange);
      onPriceChange({
        min: index === 0 ? value : newRange[0],
        max: index === 1 ? value : newRange[1],
      });
    }
  };

  const valuetext = (value) => `₹${value}`;

  if (!categoryData) return <p>Loading...</p>;

  return (
    <div className="ml-10 space-y-6">
      {/* Category Filter */}
      <div>
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => setCategoryExpanded(!categoryExpanded)}
        >
          <h3 className="text-sm font-bold text-gray-800">Shop by Category</h3>
          {categoryExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {categoryExpanded && (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 visible-scrollbar">
            {categoryData.sub.map((subcat, i) => (
              <div key={i}>
                {Array.isArray(subcat.sub) && subcat.sub.length > 0 ? (
                  <>
                    <div
                      className="flex items-center justify-between font-semibold text-gray-800 text-[15px] mb-1 cursor-pointer"
                      onClick={() =>
                        setExpandedSubcategory(
                          expandedSubcategory === subcat.name
                            ? null
                            : subcat.name
                        )
                      }
                    >
                      <span>{subcat.name}</span>
                      <span className="text-xs">
                        {expandedSubcategory === subcat.name ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </span>
                    </div>

                    {expandedSubcategory === subcat.name && (
                      <div className="ml-2 pl-2 border-l max-h-[130px] overflow-y-auto visible-scrollbar space-y-1">
                        {subcat.sub.map((item, j) => (
                          <label
                            key={j}
                            className="flex items-center gap-2 text-[14px] text-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSubs.includes(item)}
                              onChange={() => handleSubChange(item)}
                              className="w-4 h-4"
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <label className="flex items-center gap-2 text-[14px] text-gray-700 cursor-pointer mb-1">
                    <input
                      type="checkbox"
                      checked={selectedSubs.includes(subcat.name)}
                      onChange={() => handleSubChange(subcat.name)}
                      className="w-4 h-4"
                    />
                    <span className="text-[15px] font-semibold text-gray-800 mb-1">
                      {subcat.name}
                    </span>
                  </label>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-sm font-bold mb-2 text-gray-800">
          Filter by Price
        </h3>
        <Box sx={{ width: 220, pl: 1 }}>
          <Slider
            getAriaLabel={() => "Price range"}
            value={priceRange}
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
                value={priceRange[0]}
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
                value={priceRange[1] === Infinity ? "" : priceRange[1]}
                onChange={(e) => handleInputChange(e, 1)}
                className="w-20 border px-2 py-1 text-sm rounded"
              />
            </div>
          </div>
        </Box>
      </div>

      {/* Color Filter */}
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
            colorExpanded ? "max-h-[0px]" : "max-h-[120px]"
          }`}
          style={{ scrollbarWidth: "thin" }}
        >
          {colorOptions.map(
            (color, i) =>
              color &&
              color.trim() !== "" && (
                <label
                  key={i}
                  className="flex items-center gap-2 text-[14px] text-gray-700 cursor-pointer ml-2 mb-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() => handleColorChange(color)}
                    className="w-4 h-4"
                  />
                  <span
                    className="w-3 h-3 rounded-full inline-block border"
                    style={
                      color
                        ? {
                            backgroundColor: color.toLowerCase(),
                            borderColor: color.toLowerCase(),
                          }
                        : {}
                    }
                  />

                  <span>{color}</span>
                </label>
              )
          )}
        </div>
      </div>

      {/* Rating Filter */}
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
                checked={selectedRating.includes(rating)}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4"
              />
              <Rating value={rating} readOnly size="small" />
              <span className="text-gray-700">& up</span>
            </label>
          ))}
        </div>
      </div>

      {/* Discount Filter */}
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
                checked={selectedDiscount.includes(discount)}
                onChange={() => handleDiscountChange(discount)}
                className="w-4 h-4"
              />
              <span>{discount}% or more</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
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
            brandExpanded ? "max-h-[0px]" : "max-h-[120px]"
          }`}
          style={{ scrollbarWidth: "thin" }}
        >
          {brandOptions.map((brand, i) => (
            <label
              key={i}
              className="flex items-center gap-2 text-[14px] text-gray-700 cursor-pointer ml-2 mb-1"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => {
                  const updated = selectedBrands.includes(brand)
                    ? selectedBrands.filter((b) => b !== brand)
                    : [...selectedBrands, brand];
                  onBrandChange(updated);
                }}
                className="w-4 h-4"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-6 mr-6">
        <button
          className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded"
          onClick={onResetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default JewellerySidebarFilter;
