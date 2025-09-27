import React, { useState, useEffect } from "react";
import logo from "../assets/PickoraLogo2.jpg";
import { IoSearch, IoNotifications, IoHomeSharp } from "react-icons/io5";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaRegHeart, FaPlus, FaRegUser } from "react-icons/fa6";
import { FiShoppingCart, FiFilter } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import { IoRocketOutline } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { categories } from "../data/categories.js"; // Fallback categories
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import ButtonBase from "@mui/material/ButtonBase";
import { IoPowerSharp } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { useContext } from "react";
import { Context } from "../main";
import axios from "axios";
import toast from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MobileBottomNav from "./MobileBottomNav.jsx";
import { useNotifications } from "../hooks/useNotifications";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { IoTrashOutline } from "react-icons/io5";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Navbar = ({ onFilterClick }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [expandedThirdLevel, setExpandedThirdLevel] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLogo, setCurrentLogo] = useState("");
  const [logoLoading, setLogoLoading] = useState(true);
  const [backendCategories, setBackendCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const { cartCount } = useContext(Context);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { setIsAuthenticated, setUser } = useContext(Context);
  const [localUser, setLocalUser] = useState(null);
  const { isAuthenticated, wishlistCount } = useContext(Context);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileNotificationOpen, setIsMobileNotificationOpen] =
    useState(false);
  const {
    notifications,
    unreadCount,
    loading: notificationLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onProductPage =
    location.pathname.startsWith("/product/") ||
    location.pathname === "/cart" ||
    location.pathname === "/account/profile" ||
    location.pathname === "/wishlist" ||
    location.pathname === "/account/address" ||
    location.pathname.startsWith("/account/orders") ||
    location.pathname.startsWith("/checkout") ||
    location.pathname.startsWith("/order-success");

  useEffect(() => {
    if (!currentLogo) {
      setCurrentLogo(
        `${import.meta.env.VITE_BACKEND_URL}/api/placeholder/100/50`
      );
    }

    const data = localStorage.getItem("user-info");
    if (data) {
      setLocalUser(JSON.parse(data));
    }
  }, []);

  // Check if current page is a category page that should show filter
  const shouldShowFilter = () => {
    const categoryPages = [
      "/fashion",
      "/electronics",
      "/bags",
      "/footwear",
      "/groceries",
      "/beauty",
    ];
    return (
      categoryPages.some((page) => location.pathname.includes(page)) ||
      location.pathname.includes("/products")
    );
  };

  // Fetch categories from backend
  const fetchBackendCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/category/get-categories`
      );

      if (response.data.success) {
        setBackendCategories(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching backend categories:", error);
      // Fallback to static categories if backend fails
      setBackendCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendCategories();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("user-info");
      toast.success("Logged out successfully.");
      navigate("/");
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
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
    if (!fullName) return "";
    const names = fullName.split(" ");
    if (names.length === 0) return "";
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  };

  const { user } = useContext(Context);

  const wishlist = useSelector((state) => state.wishlist?.items || []);
  const count = wishlist.length;

  const cartItems = useSelector((state) => state.cart?.items || []);
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const fetchCurrentLogo = async () => {
    setLogoLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/logo/all`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch logos: ${response.statusText}`);
      }

      const data = await response.json();
      const logos = data.logos || [];

      if (logos.length > 0) {
        setCurrentLogo(logos[0].url);
      } else {
        setCurrentLogo(
          `${import.meta.env.VITE_BACKEND_URL}/api/placeholder/100/50`
        );
      }
    } catch (error) {
      console.error("Error fetching current logo:", error);
      setCurrentLogo(
        `${import.meta.env.VITE_BACKEND_URL}/api/placeholder/100/50`
      );
    } finally {
      setLogoLoading(false);
    }
  };
  useEffect(() => {
    const handleLogoUpdate = () => {
      console.log("Logo update event received, fetching new logo...");
      fetchCurrentLogo();
    };

    window.addEventListener("logoUpdated", handleLogoUpdate);
    fetchCurrentLogo();

    return () => {
      window.removeEventListener("logoUpdated", handleLogoUpdate);
    };
  }, []);

  useEffect(() => {
    if (sidebarOpen || mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [sidebarOpen, mobileMenuOpen]);

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

  const handleLogoError = () => {
    setCurrentLogo("/api/placeholder/100/50");
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    if (notification.link) {
      setIsMobileNotificationOpen(false);
      navigate(notification.link);
    }
  };

  // Use backend categories if available, otherwise fallback to static
  const categoriesToUse =
    backendCategories.length > 0 ? backendCategories : categories;

  // Function to render category navigation with proper 4-level support
  const renderCategoryNavigation = (categoryList) => {
    if (!categoryList || categoryList.length === 0) {
      return (
        <div className="px-4 py-2 text-gray-500">No categories available</div>
      );
    }

    return categoryList
      .map((cat, index) => {
        // Ensure cat exists and has required properties
        if (!cat || !cat.name) {
          return null;
        }

        // Handle both backend format (children) and static format (sub)
        const hasChildren =
          (cat.children && cat.children.length > 0) ||
          (cat.sub && cat.sub.length > 0);
        const childrenArray = cat.children || cat.sub || [];

        return (
          <div
            key={cat._id || cat.id || index}
            className="border-b border-gray-100 last:border-0"
          >
            {/* Main Category */}
            <div className="flex items-center justify-between py-4 px-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg mx-2 transition-all duration-300">
              <span
                onClick={() => {
                  setSidebarOpen(false);
                  setMobileMenuOpen(false);
                  navigate({
                    pathname: "/products",
                    search: `?category=${encodeURIComponent(
                      cat.name.toLowerCase()
                    )}`,
                  });
                }}
                className="font-semibold text-gray-800 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text cursor-pointer text-base"
              >
                {cat.name}
              </span>

              {hasChildren && (
                <button
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                  onClick={() =>
                    setExpandedCategory(
                      expandedCategory === cat.name ? null : cat.name
                    )
                  }
                >
                  <div
                    className={`transform transition-transform duration-300 ${
                      expandedCategory === cat.name ? "rotate-45" : ""
                    }`}
                  >
                    <FaPlus className="text-xs text-gray-600" />
                  </div>
                </button>
              )}
            </div>

            {/* Second Level Categories */}
            {expandedCategory === cat.name && hasChildren && (
              <div className="ml-6 border-l-2 border-gradient-to-b from-purple-300 to-pink-300 pl-6 pb-2">
                {childrenArray.map((subItem, subIndex) => {
                  if (!subItem) return null;

                  // Handle both string and object formats
                  const subName =
                    typeof subItem === "string" ? subItem : subItem.name;
                  const subHasChildren =
                    typeof subItem === "object" &&
                    ((subItem.children && subItem.children.length > 0) ||
                      (subItem.sub && subItem.sub.length > 0));
                  const subChildrenArray =
                    typeof subItem === "object"
                      ? subItem.children || subItem.sub || []
                      : [];

                  if (!subName) return null;

                  return (
                    <div
                      key={subItem._id || subItem.id || subIndex}
                      className="my-2"
                    >
                      <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-md transition-colors">
                        <span
                          onClick={() => {
                            setSidebarOpen(false);
                            setMobileMenuOpen(false);
                            navigate({
                              pathname: "/products",
                              search: `?category=${encodeURIComponent(
                                cat.name.toLowerCase()
                              )}&sub=${encodeURIComponent(subName)}`,
                            });
                          }}
                          className="text-sm text-gray-700 hover:text-purple-600 cursor-pointer font-medium"
                        >
                          {subName}
                        </span>

                        {subHasChildren && (
                          <button
                            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                            onClick={() =>
                              setExpandedSubcategory(
                                expandedSubcategory === subName ? null : subName
                              )
                            }
                          >
                            <div
                              className={`transform transition-transform duration-300 ${
                                expandedSubcategory === subName
                                  ? "rotate-45"
                                  : ""
                              }`}
                            >
                              <FaPlus className="text-xs text-gray-500" />
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Third Level Categories */}
                      {expandedSubcategory === subName && subHasChildren && (
                        <div className="ml-4 border-l border-gray-200 pl-4">
                          {subChildrenArray.map((thirdItem, thirdIndex) => {
                            if (!thirdItem) return null;

                            const thirdName =
                              typeof thirdItem === "string"
                                ? thirdItem
                                : thirdItem.name;
                            const thirdHasChildren =
                              typeof thirdItem === "object" &&
                              ((thirdItem.children &&
                                thirdItem.children.length > 0) ||
                                (thirdItem.sub && thirdItem.sub.length > 0));
                            const thirdChildrenArray =
                              typeof thirdItem === "object"
                                ? thirdItem.children || thirdItem.sub || []
                                : [];

                            if (!thirdName) return null;

                            return (
                              <div
                                key={
                                  thirdItem._id || thirdItem.id || thirdIndex
                                }
                                className="my-1"
                              >
                                <div className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded">
                                  <span
                                    onClick={() => {
                                      setSidebarOpen(false);
                                      setMobileMenuOpen(false);
                                      navigate({
                                        pathname: "/products",
                                        search: `?category=${encodeURIComponent(
                                          cat.name.toLowerCase()
                                        )}&sub=${encodeURIComponent(
                                          thirdName
                                        )}`,
                                      });
                                    }}
                                    className="text-xs text-gray-600 hover:text-pink-600 cursor-pointer block"
                                  >
                                    {thirdName}
                                  </span>

                                  {thirdHasChildren && (
                                    <button
                                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                                      onClick={() =>
                                        setExpandedThirdLevel(
                                          expandedThirdLevel === thirdName
                                            ? null
                                            : thirdName
                                        )
                                      }
                                    >
                                      <div
                                        className={`transform transition-transform duration-300 ${
                                          expandedThirdLevel === thirdName
                                            ? "rotate-45"
                                            : ""
                                        }`}
                                      >
                                        <FaPlus className="text-xs text-gray-400" />
                                      </div>
                                    </button>
                                  )}
                                </div>

                                {/* Fourth Level Categories */}
                                {expandedThirdLevel === thirdName &&
                                  thirdHasChildren && (
                                    <div className="ml-4 border-l border-gray-100 pl-4">
                                      {thirdChildrenArray.map(
                                        (fourthItem, fourthIndex) => {
                                          const fourthName =
                                            typeof fourthItem === "string"
                                              ? fourthItem
                                              : fourthItem?.name;

                                          if (!fourthName) return null;

                                          return (
                                            <span
                                              key={
                                                fourthItem._id ||
                                                fourthItem.id ||
                                                fourthIndex
                                              }
                                              onClick={() => {
                                                setSidebarOpen(false);
                                                setMobileMenuOpen(false);
                                                navigate({
                                                  pathname: "/products",
                                                  search: `?category=${encodeURIComponent(
                                                    cat.name.toLowerCase()
                                                  )}&sub=${encodeURIComponent(
                                                    fourthName
                                                  )}`,
                                                });
                                              }}
                                              className="block py-1 px-2 text-xs text-gray-500 hover:text-pink-500 cursor-pointer hover:bg-gray-50 rounded"
                                            >
                                              {fourthName}
                                            </span>
                                          );
                                        }
                                      )}
                                    </div>
                                  )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })
      .filter(Boolean); // Remove any null entries
  };

  if (isMobile && onProductPage) {
    return null; // Hide navbar
  }

  return (
    <div className="relative">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Overlay */}
      {(sidebarOpen || mobileMenuOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[100] transition-opacity duration-300"
          onClick={() => {
            setSidebarOpen(false);
            setMobileMenuOpen(false);
          }}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-[110] transform transition-all duration-500 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50">
          <img src={logo} alt="Logo" className="h-12 object-contain" />
          <button
            className="text-gray-500 hover:text-red-500 text-2xl p-2 rounded-full hover:bg-red-50 transition-all duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <IoCloseSharp />
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Shop By Categories
          </h2>
        </div>

        <div className="overflow-y-auto h-[calc(100%-140px)] px-2">
          {categoriesLoading ? (
            <div className="flex justify-center items-center py-12">
              <CircularProgress size={24} className="text-purple-600" />
              <span className="ml-3 text-gray-500">Loading categories...</span>
            </div>
          ) : (
            renderCategoryNavigation(categoriesToUse)
          )}
        </div>
      </div>

      {/* Sticky Wrapper */}
      <div
        className={`w-full z-[60] ${
          isSticky
            ? "fixed top-0 left-0 shadow-lg bg-white/95 backdrop-blur-md"
            : "relative bg-white"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Mobile Header (357px) */}
        <div className="block md:hidden">
          {/* Top Row - Menu, Logo, Icons */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            {/* Left - Menu Icon */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <RiMenu2Fill className="text-xl text-gray-700" />
            </button>

            {/* Center - Logo */}
            <Link to="/" className="flex-shrink-0">
              {logoLoading ? (
                <div className="h-8 w-16 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">...</span>
                </div>
              ) : (
                <img
                  src={currentLogo}
                  alt="Pickora Logo"
                  className="h-8 w-auto object-contain transition-transform duration-200 hover:scale-105"
                  onError={handleLogoError}
                />
              )}
            </Link>

            {/* Right - Icons */}
            <div className="flex items-center gap-1">
              {/* Notification Icon */}
              <button
                onClick={() => setIsMobileNotificationOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoNotifications className="text-xl text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center font-semibold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Wishlist Icon */}
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `relative p-2 rounded-full transition-colors ${
                    isActive
                      ? "text-red-500"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <FaRegHeart className="text-lg" />
                {isAuthenticated && wishlistCount > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex justify-center items-center font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>

              {/* Cart Icon */}
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `relative p-2 rounded-full transition-colors ${
                    isActive
                      ? "text-red-500"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <FiShoppingCart className="text-lg" />
                {cartCount > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-3 py-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
              />
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-1.5 rounded-lg hover:shadow-lg transition-all duration-200">
                  <IoSearch className="h-3 w-3" />
                </div>
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Navigation - Removed Home */}
          <div className="overflow-x-auto scrollbar-hide">
            <div
              className="flex items-center gap-6 px-3 py-2 whitespace-nowrap"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <NavLink
                to="/fashion?category=fashion"
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent hover:text-pink-600"
                  }`
                }
              >
                Fashion
              </NavLink>
              <NavLink
                to="/electronics?category=electronics"
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent hover:text-pink-600"
                  }`
                }
              >
                Electronics
              </NavLink>
              <NavLink
                to="/bags?category=bags"
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent hover:text-pink-600"
                  }`
                }
              >
                Bags
              </NavLink>
              <NavLink
                to="/footwear?category=footwear"
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent hover:text-pink-600"
                  }`
                }
              >
                Footwear
              </NavLink>
              <NavLink
                to="/groceries?category=groceries"
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent hover:text-pink-600"
                  }`
                }
              >
                Groceries
              </NavLink>
              <NavLink
                to="/beauty?category=beauty"
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent hover:text-pink-600"
                  }`
                }
              >
                Beauty & Health
              </NavLink>
              <NavLink
                to="/service"
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent hover:text-pink-600"
                  }`
                }
              >
                Service
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 border-b-2 transition ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent hover:text-pink-600"
                  }`
                }
              >
                Contact Us
              </NavLink>

              <div className="flex items-center gap-2 text-gray-700 text-sm font-medium pb-1 transition hover:text-pink-600">
                <IoRocketOutline className="text-base" />
                <span className="">Free International Delivery</span>
              </div>
            </div>
          </div>

          {/* Bottom Navigation - Mobile Menu - Fixed Sticky with Higher Z-Index */}
          <MobileBottomNav
            SidebarFilterComponent={null}
            filterProps={{}}
            onFilterClick={onFilterClick}
            shouldShowFilter={shouldShowFilter}
            setSidebarOpen={setSidebarOpen}
            user={user}
          />
        </div>

        {/* Desktop Header (Hidden on Mobile) */}
        <div className="hidden md:block">
          {/* Top Navbar */}
          <header className="w-full border-gray-100">
            <div className="max-w-7xl mx-auto px-4 pt-1 flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <Link to="/" className="flex-shrink-0">
                  {logoLoading ? (
                    <div className="h-12 w-24 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <img
                      src={currentLogo}
                      alt="Pickora Logo"
                      className="h-12 w-auto object-contain transition-transform duration-200 hover:scale-105"
                      onError={handleLogoError}
                    />
                  )}
                </Link>
              </div>

              {/* Search - Hidden on mobile */}
              <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IoSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for products, brands and more"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <button className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-xl hover:shadow-lg transition-all duration-200">
                      <IoSearch className="h-4 w-4" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Desktop User Section */}
                <div className="hidden md:flex items-center gap-3">
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
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 2,
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              fontSize: "1rem",
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Box sx={{ minWidth: 0, maxWidth: 160 }}>
                            <div className="flex flex-col items-start">
                              <span
                                className="block font-semibold text-gray-700 truncate max-w-[150px] text-sm"
                                title={user.name}
                              >
                                {user.name}
                              </span>
                              <span
                                className="block text-gray-500 truncate max-w-[150px] text-xs"
                                title={user.email}
                              >
                                {user.email}
                              </span>
                            </div>
                          </Box>
                        </ButtonBase>
                      </Tooltip>
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
                  {isAuthenticated && wishlistCount > 0 && (
                    <span
                      className="absolute -top-[0.5px] -right-[0.5px] bg-red-500 text-white rounded-full text-[10px] w-4 h-4 flex justify-center items-center font-semibold"
                      aria-label={`${wishlistCount} items in wishlist`}
                    >
                      {wishlistCount}
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
                  {cartCount > 0 && (
                    <span className="absolute -top-[0.5px] -right-[0.5px] bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold select-none pointer-events-none">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </div>
            </div>
          </header>

          <div
            className="navbarLinks flex items-center gap-6 pt-2 overflow-x-auto scrollbar-hide md:overflow-visible md:scrollbar-default"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* Categories Bar */}
            <div className="border-t border-b w-full">
              <div className="py-1 px-4 flex max-w-7xl items-center justify-between gap-6 text-sm font-medium text-gray-700">
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
        </div>
      </div>

      {/* Spacer */}
      {isSticky && <div className="h-[112px] w-full"></div>}

      {/* Mobile Notification Panel - Add this in your Navbar component */}
      <AnimatePresence>
        {isMobileNotificationOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNotificationOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-[120] md:hidden"
            />

            {/* Notification Panel - Slides from right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white z-[130] shadow-xl md:hidden flex flex-col"
            >
              {/* Header - Fixed */}
              <div className="bg-blue-600 text-white p-4 flex items-center justify-between flex-shrink-0">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsMobileNotificationOpen(false)}
                    className="p-1 hover:bg-blue-700 rounded"
                  >
                    <IoCloseSharp className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Notifications List - Scrollable with bottom padding */}
              <div className="flex-1 overflow-y-auto pb-16">
                {" "}
                {/* pb-16 accounts for bottom nav */}
                {notificationLoading ? (
                  <div className="p-8 text-center text-gray-500">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <IoNotifications className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.isRead ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification._id);
                            }}
                            className="ml-2 p-2 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <IoTrashOutline className="text-gray-500 hover:text-red-500" />
                          </button>
                        </div>
                        {notification.link && (
                          <span className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                            View details →
                          </span>
                        )}
                      </motion.div>
                    ))}

                    {/* Extra padding at the bottom to ensure last item is visible */}
                    <div className="h-4"></div>
                  </div>
                )}
              </div>

              {/* Optional: Bottom fade effect */}
              <div className="absolute bottom-14 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
