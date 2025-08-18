import React, { useState, useEffect } from "react";
import logo from "../assets/PickoraLogo2.jpg";
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
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import ButtonBase from "@mui/material/ButtonBase";
import { FaRegUser } from "react-icons/fa";
import { IoPowerSharp } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { useContext } from "react";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const navigate = useNavigate();

  const { setIsAuthenticated, setUser } = useContext(Context);
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("user-info");
    if (data) {
      setLocalUser(JSON.parse(data));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("user-info"); // Clear local storage on logout
      toast.success("Logged out successfully.");
      navigate("/");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
    setShowConfirm(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Extract initials for avatar
  const getInitials = (fullName) => {
    const names = fullName.split(" ");
    if (names.length === 0) return "";
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  };

  const { user } = useContext(Context);

  const wishlist = useSelector((state) => state.wishlist.items);
  const count = wishlist.length;

  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

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
          <img src={logo} alt="Logo" className="h-11 object-contain" />
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
                    navigate({
                      pathname: "/products", // or your main listing route
                      search: `?category=${encodeURIComponent(
                        cat.name.toLowerCase()
                      )}`,
                    });
                  }}
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
                  {expandedCategory === cat.name ? (
                    "−"
                  ) : (
                    <FaPlus className="text-xs" />
                  )}
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
                          navigate({
                            pathname: "/products",
                            search: `?category=${encodeURIComponent(
                              cat.name.toLowerCase()
                            )}&sub=${encodeURIComponent(subItem.name)}`,
                          });
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
                        {expandedSubcategory === subItem.name ? (
                          "−"
                        ) : (
                          <FaPlus className="text-xs" />
                        )}
                      </span>
                    </div>

                    {/* Sub-subcategories */}
                    {expandedSubcategory === subItem.name &&
                      subItem.sub.map((item, i) => (
                        <span
                          onClick={() => {
                            setSidebarOpen(false);
                            navigate({
                              pathname: "/products",
                              search: `?category=${encodeURIComponent(
                                cat.name.toLowerCase()
                              )}&sub=${encodeURIComponent(item)}`,
                            });
                          }}
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
        className={`w-full z-[60] ${
          isSticky
            ? "fixed top-0 left-0 shadow-md bg-white"
            : "relative bg-white"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Top Navbar */}
        <header className="w-full border-b ">
          <div className="max-w-7xl mx-auto px-2 py-2 flex items-center gap-6 justify-between">
            {/* Logo */}
            <div className="w-[25%] flex items-center gap-2 pl-5">
              <Link to="/">
                <img
                  src={logo}
                  alt="Pickora Logo"
                  className="h-11 w-auto object-contain ml-5"
                />
              </Link>
            </div>

            {/* Search */}
            <div className="w-[45%] flex justify-center items-center bg-[#e5e5e5] rounded-[8px] p-1 mr-10">
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

            {/* Your logout modal */}
            {showConfirm && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                <div className="bg-white p-6 rounded-lg shadow-lg w-72 text-center">
                  <p className="mb-4 text-gray-800">
                    Are you sure you want to logout?
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="w-[30%] flex items-center justify-end gap-5 text-gray-700 font-medium pr-1">
              <div className="flex items-center gap-2">
                {/* User logged in */}
                {user ? (
                  <>
                    <Tooltip title="Account settings">
                      <ButtonBase
                        onClick={handleClick}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1,
                          borderRadius: 1,
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            fontSize: "1rem",
                            bgcolor: "#455a64",
                          }}
                        >
                          {getInitials(user.name)}
                        </Avatar>
                        <Box
                          sx={{
                            minWidth: 140,
                            width: 167,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <div className="flex flex-col items-start">
                            <span
                              className="block font-semibold text-gray-700 truncate text-[13px]"
                              title={user.name}
                            >
                              {user.name}
                            </span>
                            <span
                              className="block text-gray-500 truncate text-[13px]"
                              title={user.email}
                            >
                              {user.email}
                            </span>
                          </div>
                        </Box>
                      </ButtonBase>
                    </Tooltip>
                    <span>|</span>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="hover:text-pink-500 transition text-[16px] font-[500] text-gray-600"
                    >
                      Login
                    </Link>
                    <span>|</span>
                  </>
                )}

                {/* Account dropdown menu */}
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      minWidth: 180,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem
                    onClick={handleClose}
                    className="flex items-center gap-2 text-[15px]"
                  >
                    <Link
                      to="/account/profile"
                      className="flex items-center gap-2"
                    >
                      <FaRegUser /> My Account
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    className="flex items-center gap-2 text-[15px]"
                  >
                    <Link
                      to="/account/address"
                      className="flex items-center gap-2"
                    >
                      <SlLocationPin /> Saved Address
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    className="flex items-center gap-2 text-[15px]"
                  >
                    <Link to="/wishlist" className="flex items-center gap-2">
                      <FaRegHeart /> My Wishlist
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    className="flex items-center gap-2 text-[15px]"
                  >
                    <Link
                      to="/account/orders"
                      className="flex items-center gap-2"
                    >
                      <HiOutlineShoppingBag /> My Orders
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose(); // closes the menu
                      setShowConfirm(true); // opens the confirmation modal
                    }}
                    className="flex items-center gap-2 text-[15px] cursor-pointer"
                  >
                    <IoPowerSharp /> Logout
                  </MenuItem>
                </Menu>

                {/* Help always */}
                <NavLink
                  to="/help"
                  className={({ isActive }) =>
                    `transition text-[16px] font-[500] ${
                      isActive
                        ? "text-pink-500"
                        : "text-gray-600 hover:text-pink-500"
                    }`
                  }
                >
                  Help
                </NavLink>
              </div>

              {/* Wishlist Icon */}
              <NavLink
                to="/wishlist"
                title="Wishlist"
                className={({ isActive }) =>
                  `relative text-lg transition p-2 rounded-full duration-200 ${
                    isActive
                      ? "text-red-500"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                <FaRegHeart size={22} />
                {count > 0 && (
                  <span
                    className="absolute -top-[0.5px] -right-[0.5px] bg-red-500 text-white rounded-full text-[10px] w-4 h-4 flex justify-center items-center font-semibold"
                    aria-label={`${count} items in wishlist`}
                  >
                    {count}
                  </span>
                )}
              </NavLink>

              {/* Cart Icon */}
              <NavLink
                to="/cart"
                title="Cart"
                className={({ isActive }) =>
                  `relative text-lg transition p-2 rounded-full duration-200 ${
                    isActive
                      ? "text-red-500"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
              >
                <FiShoppingCart className="text-lg" size={22} />
                {totalQuantity > 0 && (
                  <span className="absolute -top-[0.5px] -right-[0.5px] bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold select-none pointer-events-none">
                    {totalQuantity}
                  </span>
                )}
              </NavLink>
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
                to="/fashion?category=fashion"
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
                to="/electronics?category=electronics"
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
                to="/bags?category=bags"
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
                to="/footwear?category=footwear"
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
                to="/groceries?category=groceries"
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
                to="/beauty?category=beauty"
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
