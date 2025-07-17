import React, { useState, useEffect } from "react";
import logo from "../assets/pickoraLogo.jpg";
import { IoSearch } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import { FaRegHeart, FaPlus } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import { IoRocketOutline } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { categories } from "../data/categories.js";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
  if (sidebarOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}, [sidebarOpen]);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[100]"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
     <div
  className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-[110] transform transition-transform duration-300 ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
  <div className="p-4 border-b flex justify-between items-center">
    <img src={logo} alt="Logo" className="h-6 object-contain" />
    <button
      className="text-gray-500 hover:text-pink-500 text-xl"
      onClick={() => setSidebarOpen(false)}
    >
      <IoCloseSharp />
    </button>
  </div>

  <h2 className="px-4 py-3 font-semibold text-gray-800">
    Shop By Categories
  </h2>

  <div className="overflow-y-auto h-[calc(100%-60px)]">
    {categories.map((cat, index) => (
      <div key={index} className="px-4 border-b">
        {/* Main Category */}
        <div className="flex items-center justify-between py-3">
          <span
            onClick={() => {
              setSidebarOpen(false);
              navigate(`/${cat.name.toLowerCase()}`)}}
            className="font-medium text-gray-800 hover:text-pink-600 cursor-pointer"
          >
            {cat.name}
          </span>


          <span
            className="cursor-pointer"
            onClick={() =>
              setExpandedCategory(
                expandedCategory === cat.name ? null : cat.name
              )
            }
          >
            {expandedCategory === cat.name ? "−" : <FaPlus className="text-xs" />}
          </span>
        </div>

        {/* Subcategories */}
        {expandedCategory === cat.name &&
          cat.sub.map((subItem, subIndex) => (
            <div
              key={subIndex}
              className="ml-4 border-l border-gray-200 pl-4"
            >
              <div className="flex items-center justify-between py-2">
                <span
                  onClick={() => {
                    setSidebarOpen(false);
                    navigate(`/${cat.name.toLowerCase()}?sub=${encodeURIComponent(subItem.name)}`);
                  }}
                  className="text-sm text-gray-700 hover:text-pink-600 cursor-pointer"
                >
                  {subItem.name}
                </span>



                <span
                  className="cursor-pointer"
                  onClick={() =>
                    setExpandedSubcategory(
                      expandedSubcategory === subItem.name
                        ? null
                        : subItem.name
                    )
                  }
                >
                  {expandedSubcategory === subItem.name ? "−" : <FaPlus className="text-xs" />}
                </span>
              </div>

              {/* Sub-subcategories */}
              {expandedSubcategory === subItem.name &&
                subItem.sub.map((item, i) => (
                  <span
                    key={i}
                    onClick={() => {
                      setSidebarOpen(false);
                      navigate(`/${cat.name.toLowerCase()}?sub=${encodeURIComponent(item)}`)}}
                    className="ml-4 py-1 text-sm text-gray-600 hover:text-pink-500 block cursor-pointer"
                  >
                    {item}
                  </span>

                ))}
            </div>
          ))}
      </div>
    ))}
  </div>
</div>


      {/* Sticky Wrapper */}
      <div
        className={`w-full z-[50] ${
          isSticky
            ? "fixed top-0 left-0 shadow-md bg-white"
            : "relative bg-white"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Top Navbar */}
        <header className="w-full border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6 justify-between">
            {/* Logo */}
            <div className="w-[25%] flex items-center gap-2 pl-5">
              <Link to="/">
                <img
                  src={logo}
                  alt="Pickora Logo"
                  className="h-8 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Search */}
            <div className="w-[45%] flex justify-center items-center bg-[#e5e5e5] rounded-[8px] p-1">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full pl-10 pr-4 py-2 text-sm focus:outline-none bg-inherit placeholder-gray-600"
                />
                <button className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B4B4B] text-lg rounded-full hover:bg-[#d1d1d1] p-0.5">
                  <IoSearch />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="w-[30%] flex items-center justify-end gap-5 text-gray-700 text-sm font-medium pr-1">
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hover:text-pink-500 transition text-[16px] font-[500] text-gray-600"
                >
                  Login
                </Link>
                <span>|</span>
                <NavLink
                  to="/help"
                  className={({ isActive }) =>
                    `transition text-[16px] font-[500] 
                   ${
                      isActive
                        ? "text-pink-500"
                        : "text-gray-600 hover:text-pink-500"
                    }`
                  }
                >
                  Help
                </NavLink>
              </div>
              <Link
                to="/wishlist"
                title="Wishlist"
                className="text-lg transition p-2 rounded-full hover:bg-gray-200 duration-200"
              >
                <FaRegHeart className="text-lg text-gray-700" />
              </Link>
              <Link
                to="/cart"
                title="Cart"
                className="text-lg transition p-2 rounded-full hover:bg-gray-200 duration-200"
              >
                <FiShoppingCart className="text-lg text-gray-700" />
              </Link>
            </div>
          </div>
        </header>

        {/* Categories Bar */}
        <div className="border-t border-b">
          <div className="py-2 px-4 flex max-w-7xl items-center justify-evenly gap-6 text-sm font-medium text-gray-700">
            {/* Sidebar Toggle */}
            <div
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 cursor-pointer hover:bg-[#EFF6FF] rounded-md p-2 transition duration-200"
            >
              <RiMenu2Fill className="text-md" />
              <button>SHOP BY CATEGORIES</button>
              <FaChevronDown className="text-xs" />
            </div>

            {/* Links */}
            <div className="navbarLinks flex items-center gap-6 pt-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `hover:text-pink-600 pb-2 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/fashion"
                className={({ isActive }) =>
                  `hover:text-pink-600 pb-2 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent"
                  }`
                }
              >
                Fashion
              </NavLink>
              <NavLink
                to="/electronics"
                className={({ isActive }) =>
                  `hover:text-pink-600 pb-2 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent"
                  }`
                }
              >
                Electronics
              </NavLink>
              <NavLink
                to="/bags"
                className={({ isActive }) =>
                  `hover:text-pink-600 pb-2 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent"
                  }`
                }
              >
                Bags
              </NavLink>
              <NavLink
                to="/footwear"
                className={({ isActive }) =>
                  `hover:text-pink-600 pb-2 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent"
                  }`
                }
              >
                Footwear
              </NavLink>
              <NavLink
                to="/groceries"
                className={({ isActive }) =>
                  `hover:text-pink-600 pb-2 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent"
                  }`
                }
              >
                Groceries
              </NavLink>
              <NavLink
                to="/beauty"
                className={({ isActive }) =>
                  `hover:text-pink-600 pb-2 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent"
                  }`
                }
              >
                Beauty & Health
              </NavLink>
              <NavLink
                to="/service"
                className={({ isActive }) =>
                  `hover:text-pink-600 pb-2 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent"
                  }`
                }
              >
                Service
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `hover:text-pink-600 pb-2 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent"
                  }`
                }
              >
                Contact Us
              </NavLink>
            </div>

            {/* Delivery */}
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <IoRocketOutline className="text-base" />
              <span>Free International Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      {isSticky && <div className="h-[112px] w-full"></div>}
    </div>
  );
};

export default Navbar;
