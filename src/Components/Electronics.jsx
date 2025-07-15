import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ContactUsPart from './ContactUsPart';
import ElectronicsSidebarFilter from './ElectronicsSidebarFilter';
import { categories } from '../data/categories';
import { products } from '../data/productItems';
import { BsCart4 } from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';
import { HiViewGrid } from 'react-icons/hi';
import { TfiViewListAlt } from 'react-icons/tfi';

const Electronics  = () => {
  const electronicsCategory  = categories.find(cat => cat.name === "Electronics");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedSubs, setSelectedSubs] = useState([]);
  const [selectedRating, setSelectedRating] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]); // ✅ New color state
  const [selectedPrice, setSelectedPrice] = useState({ min: 0, max: Infinity });
  const [viewType, setViewType] = useState('grid');
  const [sortOption, setSortOption] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  // ✅ Apply filters manually
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    selectedSubs.forEach(s => params.append('sub', s));
    selectedRating.forEach(r => params.append('rating', r));
    selectedDiscount.forEach(d => params.append('discount', d));
    selectedBrands.forEach(b => params.append('brand', b));
    selectedColors.forEach(c => params.append('color', c));
    if (selectedPrice.min > 0) params.set('minPrice', selectedPrice.min);
    if (selectedPrice.max !== Infinity) params.set('maxPrice', selectedPrice.max);
    if (viewType) params.set('view', viewType);
    if (sortOption) params.set('sort', sortOption);
    setSearchParams(params, { replace: true });
  };

  // ✅ Reset all filters
  const handleResetFilters = () => {
    setSelectedSubs([]);
    setSelectedRating([]);
    setSelectedDiscount([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedPrice({ min: 0, max: Infinity });
    setSearchParams({});
  };


  const brandOptions = [...new Set(products.filter(p => p.category.includes('electronics')).map(p => p.brand))].sort();
  const colorOptions = [...new Set(products.filter(p => p.category.includes('electronics')).map(p => p.color))].sort();



  // Load filters from URL
  useEffect(() => {
  const subs = searchParams.getAll('sub');
  const rating = searchParams.getAll('rating').map(Number);
  const discount = searchParams.getAll('discount').map(Number);
  const brands = searchParams.getAll('brand');
  const colors = searchParams.getAll('color'); // ✅ NEW
  const view = searchParams.get('view') || 'grid';
  const sort = searchParams.get('sort') || '';
  const minPrice = parseInt(searchParams.get('minPrice')) || 0;
  const maxPrice = parseInt(searchParams.get('maxPrice')) || Infinity;

  setSelectedSubs(subs);
  setSelectedRating(rating);
  setSelectedDiscount(discount);
  setSelectedBrands(brands);
  setSelectedColors(colors); // ✅ NEW
  setSelectedPrice({ min: minPrice, max: maxPrice });
  setViewType(view);
  setSortOption(sort);
}, [searchParams]);


  // Update URL when filters change
  useEffect(() => {
  const params = new URLSearchParams();

  // Subcategory filter
  selectedSubs.forEach(s => params.append('sub', s));

  // Rating filter
  if (selectedRating.length > 0) {
    selectedRating.forEach(r => params.append('rating', r));
  }

  // Discount filter
  if (selectedDiscount.length > 0) {
    selectedDiscount.forEach(d => params.append('discount', d));
  }

  // Brand filter
  if (selectedBrands.length > 0) {
    selectedBrands.forEach(b => params.append('brand', b));
  }

  // Color filter
  if (selectedColors.length > 0) {
    selectedColors.forEach(c => params.append('color', c));
  }

  // Price range filter
  if (selectedPrice.min > 0) params.set('minPrice', selectedPrice.min);
  if (selectedPrice.max !== Infinity) params.set('maxPrice', selectedPrice.max);

  // View type and sorting
  if (viewType) params.set('view', viewType);
  if (sortOption) params.set('sort', sortOption);

  // Update URL
  setSearchParams(params, { replace: true });
}, [
  selectedSubs,
  selectedRating,
  selectedDiscount,
  selectedBrands,
  selectedColors,
  selectedPrice,
  viewType,
  sortOption,
]);



  // Restore scroll position
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('scrollPosition');
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll));
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setVisibleCount(prev => prev + 10);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter products
  const ElectronicsProducts = products.filter(p =>
  p.category.includes('electronics') &&
  (selectedSubs.length === 0 || selectedSubs.includes(p.subcategory)) &&
  (selectedRating.length === 0 || selectedRating.some(r => p.rating >= r)) &&
  (selectedDiscount.length === 0 || selectedDiscount.some(d => parseInt(p.discount) >= d)) &&
  (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
  (selectedColors.length === 0 || selectedColors.includes(p.color)) && // ✅ New filter by color
  (p.discountedPrice >= selectedPrice.min && p.discountedPrice <= selectedPrice.max)
);


  const getSortedProducts = () => {
    const sorted = [...ElectronicsProducts];
    if (sortOption === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOption === 'name-desc') sorted.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortOption === 'price-asc') sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
    else if (sortOption === 'price-desc') sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
    return sorted;
  };

  const sortedProducts = getSortedProducts();
  const visibleProducts = sortedProducts.slice(0, visibleCount);

  const handleProductClick = (id) => {
    sessionStorage.setItem('scrollPosition', window.scrollY);
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <div className="p-4 mb-4">
      <div className="flex gap-2">
        {/* Sidebar */}
        <div className="w-[24%] bg-white sticky top-36 h-[calc(100vh-140px)] overflow-y-auto overflow-x-hidden pr-2 custom-scroll z-10">
          <ElectronicsSidebarFilter 
            categoryData={electronicsCategory}
            onRatingChange={setSelectedRating}
            onDiscountChange={setSelectedDiscount}
            onSubChange={setSelectedSubs}
            onPriceChange={setSelectedPrice}
            onBrandChange={setSelectedBrands}
            onColorChange={setSelectedColors} // ✅ new
            selectedRating={selectedRating}
            selectedDiscount={selectedDiscount}
            selectedSubs={selectedSubs}
            selectedPrice={selectedPrice}
            selectedBrands={selectedBrands}
            selectedColors={selectedColors}    // ✅ new
            brandOptions={brandOptions}
            colorOptions={colorOptions}        // ✅ new
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Main Product Area */}
        <div className="w-[76%]">
          <div className="flex sticky top-32 z-30 items-center justify-between mb-4 px-3 py-2 bg-gray-100 shadow rounded-md">
  <div className="flex items-center gap-2">
    <button
      onClick={() => setViewType('grid')}
      className={`p-1 rounded ${viewType === 'grid' ? 'text-red-500' : 'text-gray-600'}`}
    >
      <HiViewGrid size={20} />
    </button>
    <button
      onClick={() => setViewType('list')}
      className={`p-1 rounded ${viewType === 'list' ? 'text-red-500' : 'text-gray-600'}`}
    >
      <TfiViewListAlt size={14} />
    </button>
    <span className="text-sm text-gray-700 ml-2">There are {sortedProducts.length} products.</span>
  </div>

  <div className="flex items-center gap-2">
    <label className="text-sm font-medium text-gray-700">Sort by:</label>
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
{viewType === 'grid' ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {visibleProducts.map(product => (
      <div key={product.id} className="w-full shadow-md bg-white">
        <div
          onClick={() => handleProductClick(product.id)}
          className="w-full h-48 overflow-hidden rounded-md relative group cursor-pointer"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-top object-cover"
          />
          <button className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-md text-gray-600 hover:text-red-500">
            <FaHeart size={18} />
          </button>
        </div>

        <div className="p-2 shadow-md">
          <h6 className="text-[13px] mt-2 min-h-[18px] whitespace-nowrap overflow-hidden text-ellipsis text-gray-700">{product.brand}</h6>
          <h3 className="text-[14px] leading-[20px] mt-1 font-[500] mb-1 text-[rgba(0,0,0,0.9)] min-h-[40px] line-clamp-2">{product.name}</h3>
          <div className='flex items-center justify-between'>
            <span className='line-through text-gray-500 font-[16px]'>₹{product.originalPrice.toLocaleString()}</span>
            <span className='text-red-500 font-[600]'>₹{product.discountedPrice.toLocaleString()}</span>
          </div>
          <button className='group flex items-center w-full max-w-[97%] mx-auto gap-2 mt-6 mb-2 border border-red-500 pl-4 pr-4 pt-2 pb-2 rounded-md hover:bg-black transition'>
            <BsCart4 className='text-[15px] text-red-500 group-hover:text-white transition' />
            <span className='text-[12px] text-red-500 font-[500] group-hover:text-white transition'>ADD TO CART</span>
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="flex flex-col gap-4">
    {visibleProducts.map(product => (
      <div key={product.id} className="w-full bg-white shadow rounded-lg overflow-hidden flex">
        <div className="w-[25%] h-[320px] relative cursor-pointer" onClick={() => handleProductClick(product.id)}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover p-1 rounded-lg"
          />
          <button className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-md text-gray-600 hover:text-red-500">
            <FaHeart size={18} />
          </button>
        </div>

        <div className="w-[60%] p-4 flex flex-col justify-between">
          <div>
            <h6 className="text-[13px] min-h-[18px] whitespace-nowrap overflow-hidden text-ellipsis">{product.brand}</h6>
            <h3 className='mt-2'>{product.name}</h3>
            <p className="text-sm text-gray-600 mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="line-through text-gray-500 text-md">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="text-red-500 font-semibold text-md">
                ₹{product.discountedPrice.toLocaleString()}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 border border-red-500 px-4 py-2 rounded-md text-sm text-red-500 hover:bg-black hover:text-white transition w-fit mt-2">
            <BsCart4 />
            Add to Cart
          </button>
        </div>
      </div>
    ))}
  </div>
)}
        </div>
      </div>
    </div>
    <ContactUsPart />
    </div>
  );
};

export default Electronics;
