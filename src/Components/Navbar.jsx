import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/PickoraLogo2.jpg";
import { IoSearch, IoNotifications, IoHomeSharp } from "react-icons/io5";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaRegHeart, FaPlus, FaRegUser } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import { IoRocketOutline } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { categories } from "../data/categories.js";
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
import SearchModal from "./SearchModal";
import DesktopSearchDropdown from "./DesktopSearchDropdown";
import { debounce } from "lodash";
import Skeleton from "@mui/material/Skeleton";
import { CategorySidebarSkeleton } from "../Skeletons/CategorySidebarSkeleton.jsx";
import ReactDOM from "react-dom";
import { useSearchParams } from "react-router-dom";
import {
  FaShoppingBag,
  FaExchangeAlt,
  FaShippingFast,
  FaBoxOpen,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaBox,
  FaInfoCircle,
} from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Navbar = ({ onFilterClick }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [expandedThirdLevel, setExpandedThirdLevel] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLogo, setCurrentLogo] = useState("");
  const [logoLoading, setLogoLoading] = useState(true);
  const [backendCategories, setBackendCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const { cartCount } = useContext(Context);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchParams] = useSearchParams();
  const currentSearchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setDesktopSearchQuery(searchFromUrl);
  }, [searchParams]);

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

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [desktopSearchQuery, setDesktopSearchQuery] = useState("");
  const [desktopSearchResults, setDesktopSearchResults] = useState([]);
  const [desktopSearchLoading, setDesktopSearchLoading] = useState(false);
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const desktopSearchRef = useRef(null);

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
      localStorage.removeItem("client_token");
      localStorage.removeItem("client_user");
      toast.success("Logged out successfully.");
      navigate("/");
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
      setShowLogoutConfirm(false);
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

  // Get notification icon based on type
  const getNotificationIcon = (notification) => {
    const type = notification.type;

    // Define icon colors based on notification type
    const iconColors = {
      new_order: "text-green-500",
      order_shipped: "text-blue-500",
      order_delivered: "text-purple-500",
      order_cancelled: "text-red-500",
      payment_received: "text-emerald-500",
      new_return: "text-amber-500",
      return_updated: "text-indigo-500",
      return_cancelled: "text-rose-500",
      status_update: "text-cyan-500",
      default: "text-gray-500",
    };

    // Get the appropriate color
    const colorClass = iconColors[type] || iconColors.default;

    // Return the appropriate icon with color
    switch (type) {
      case "new_order":
        return <FaShoppingBag className={`${colorClass} text-xl`} />;
      case "order_shipped":
        return <FaShippingFast className={`${colorClass} text-xl`} />;
      case "order_delivered":
        return <FaBoxOpen className={`${colorClass} text-xl`} />;
      case "order_cancelled":
        return <FaTimes className={`${colorClass} text-xl`} />;
      case "payment_received":
        return <FaMoneyBillWave className={`${colorClass} text-xl`} />;
      case "new_return":
        return <FaExchangeAlt className={`${colorClass} text-xl`} />;
      case "return_updated":
        return <FaBox className={`${colorClass} text-xl`} />;
      case "return_cancelled":
        return <FaTimes className={`${colorClass} text-xl`} />;
      case "status_update":
        return <FaCheck className={`${colorClass} text-xl`} />;
      default:
        return <FaInfoCircle className={`${colorClass} text-xl`} />;
    }
  };

  // Get background color based on notification type
  const getNotificationBgColor = (notification) => {
    const type = notification.type;

    if (!notification.isRead) {
      return "bg-blue-50";
    }

    switch (type) {
      case "new_order":
        return "hover:bg-green-50";
      case "order_cancelled":
        return "hover:bg-red-50";
      case "payment_received":
        return "hover:bg-emerald-50";
      case "new_return":
        return "hover:bg-amber-50";
      case "return_updated":
        return "hover:bg-indigo-50";
      case "return_cancelled":
        return "hover:bg-rose-50";
      default:
        return "hover:bg-gray-50";
    }
  };

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

  const performDesktopSearch = async (query) => {
    if (!query.trim()) {
      setDesktopSearchResults([]);
      setShowDesktopDropdown(false);
      return;
    }

    setDesktopSearchLoading(true);
    setShowDesktopDropdown(true);

    try {
      // Use getAllProducts with search parameter
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/product/getAllProductsForClient?search=${query}&page=1&perPage=10`
      );

      if (response.data.success) {
        setDesktopSearchResults(response.data.products || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      // If search fails, try without search parameter
      try {
        const fallbackResponse = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/product/getAllProducts?page=1&perPage=10`
        );

        if (fallbackResponse.data.success) {
          // Filter products client-side
          const filtered = fallbackResponse.data.products.filter((product) => {
            const searchLower = query.toLowerCase();
            return (
              product.name?.toLowerCase().includes(searchLower) ||
              product.brand?.toLowerCase().includes(searchLower) ||
              product.categoryName?.toLowerCase().includes(searchLower)
            );
          });
          setDesktopSearchResults(filtered);
        }
      } catch (fallbackError) {
        console.error("Fallback search error:", fallbackError);
        setDesktopSearchResults([]);
      }
    } finally {
      setDesktopSearchLoading(false);
    }
  };

  // Debounced desktop search
  const debouncedDesktopSearch = useRef(
    debounce((query) => performDesktopSearch(query), 300)
  ).current;

  // Handle desktop search input change
  const handleDesktopSearchChange = (e) => {
    const query = e.target.value;
    setDesktopSearchQuery(query);
    debouncedDesktopSearch(query);
  };

  // Handle desktop search submit
  const handleDesktopSearchSubmit = (e) => {
    e.preventDefault();
    if (desktopSearchQuery.trim()) {
      // Save to recent searches
      const saved = localStorage.getItem("recentSearches");
      const recentSearches = saved ? JSON.parse(saved) : [];
      const updated = [
        desktopSearchQuery,
        ...recentSearches.filter((item) => item !== desktopSearchQuery),
      ].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));

      navigate(`/products?search=${encodeURIComponent(desktopSearchQuery)}`);
      setShowDesktopDropdown(false);
      setDesktopSearchQuery("");
    }
  };

  // Handle clicking outside desktop search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target)
      ) {
        setShowDesktopDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
            <CategorySidebarSkeleton count={6} />
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
                <div className="relative w-16 h-8 lg:w-20 lg:h-10 rounded-lg overflow-hidden">
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="wave"
                    sx={{
                      bgcolor: "#C7CCD8", // very light background
                      "&::after": {
                        background:
                          "linear-gradient(90deg, transparent, #DEE2EB, transparent)", // soft shimmer
                      },
                      borderRadius: 8,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-[#A1A7B5] animate-pulse">
                      Logo
                    </span>
                  </div>
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
            <div
              className="relative w-full"
              onClick={() => setMobileSearchOpen(true)}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                readOnly
                style={{ cursor: "pointer" }}
              />
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-1.5 rounded-lg hover:shadow-lg transition-all duration-200">
                  <IoSearch className="h-3 w-3" />
                </div>
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Navigation - Removed Home */}
          <div
            className="overflow-x-auto scrollbar-hide w-full"
            style={{
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <div className="flex items-center gap-5 px-4 py-2 whitespace-nowrap min-w-max">
              <NavLink
                to="/fashion?category=fashion"
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 border-b-2 transition flex-shrink-0 ${
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
                  `text-sm font-medium pb-1 border-b-2 transition flex-shrink-0 ${
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
                  `text-sm font-medium pb-1 border-b-2 transition flex-shrink-0 ${
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
                  `text-sm font-medium pb-1 border-b-2 transition flex-shrink-0 ${
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
                  `text-sm font-medium pb-1 border-b-2 transition flex-shrink-0 ${
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
                  `text-sm font-medium pb-1 border-b-2 transition flex-shrink-0 ${
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
                  `text-sm font-medium pb-1 border-b-2 transition flex-shrink-0 ${
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
                  `text-sm font-medium pb-1 border-b-2 transition flex-shrink-0 ${
                    isActive
                      ? "text-pink-600 border-pink-600"
                      : "text-gray-700 border-transparent hover:text-pink-600"
                  }`
                }
              >
                Contact Us
              </NavLink>

              <div className="flex items-center gap-2 text-gray-700 text-sm font-medium pb-1 transition hover:text-pink-600 flex-shrink-0">
                <IoRocketOutline className="text-base" />
                <span>Free International Delivery</span>
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
                    <Skeleton
                      variant="rectangular"
                      width={96} // 24 * 4 px = 96px (Tailwind w-24)
                      height={48} // 12 * 4 px = 48px (Tailwind h-12)
                      animation="wave"
                      sx={{
                        bgcolor: "#C7CCD8",
                        "&::after": {
                          background:
                            "linear-gradient(90deg, transparent, #DEE2EB, transparent)",
                        },
                        borderRadius: 2, // rounded-lg equivalent
                      }}
                    />
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
              <div
                className="hidden md:flex flex-1 max-w-2xl mx-8"
                ref={desktopSearchRef}
              >
                <form
                  onSubmit={handleDesktopSearchSubmit}
                  className="relative w-full"
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IoSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={desktopSearchQuery}
                    onChange={handleDesktopSearchChange}
                    onFocus={() =>
                      desktopSearchQuery && setShowDesktopDropdown(true)
                    }
                    placeholder="Search for products, brands and more"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-xl hover:shadow-lg transition-all duration-200">
                      <IoSearch className="h-4 w-4" />
                    </div>
                  </button>

                  {/* Desktop Search Dropdown */}
                  <DesktopSearchDropdown
                    isOpen={showDesktopDropdown}
                    searchResults={desktopSearchResults}
                    loading={desktopSearchLoading}
                    searchQuery={desktopSearchQuery}
                    onClose={() => setShowDesktopDropdown(false)}
                    onResultClick={(product) => {
                      const saved = localStorage.getItem("recentSearches");
                      const recentSearches = saved ? JSON.parse(saved) : [];
                      const updated = [
                        product.name,
                        ...recentSearches.filter(
                          (item) => item !== product.name
                        ),
                      ].slice(0, 5);
                      localStorage.setItem(
                        "recentSearches",
                        JSON.stringify(updated)
                      );
                      setDesktopSearchQuery("");
                    }}
                  />
                </form>
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
                        handleClose(); // Close the menu
                        setShowLogoutConfirm(true); // Show logout confirmation
                      }}
                      className="flex items-center gap-2 text-[15px] cursor-pointer"
                    >
                      <IoPowerSharp /> Logout
                    </MenuItem>
                  </Menu>

                  {showLogoutConfirm &&
                    ReactDOM.createPortal(
                      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
                        {/* Overlay */}
                        <div
                          className="fixed inset-0 bg-black bg-opacity-40"
                          onClick={() => setShowLogoutConfirm(false)}
                        />

                        {/* Modal */}
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[320px] text-center relative z-[99999]">
                          <h3 className="text-lg font-semibold mb-4">
                            Confirm Logout
                          </h3>
                          <p className="mb-6 text-gray-600">
                            Are you sure you want to logout?
                          </p>
                          <div className="flex gap-4 justify-center">
                            <button
                              onClick={() => setShowLogoutConfirm(false)}
                              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                              disabled={loading}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleLogout}
                              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-2"
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <CircularProgress size={16} color="inherit" />
                                  <span>Logging out...</span>
                                </>
                              ) : (
                                <span>Logout</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>,
                      document.body
                    )}

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

          <div className="w-full min-w-[1200px] border-t border-b bg-white">
            <div className="max-w-[1200px] mx-auto px-4">
              <div className="flex items-center justify-between h-[50px]">
                {/* Categories Button */}
                <div
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#EFF6FF] rounded-md p-2 transition duration-200 min-w-[200px]"
                >
                  <RiMenu2Fill className="text-md" />
                  <button className="text-sm font-medium">
                    SHOP BY CATEGORIES
                  </button>
                  <FaChevronDown className="text-xs" />
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-6 min-w-[700px]">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `hover:text-pink-600 pb-2 border-b-2 transition text-sm font-medium ${
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
                      `hover:text-pink-600 pb-2 border-b-2 transition text-sm font-medium ${
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
                      `hover:text-pink-600 pb-2 border-b-2 transition text-sm font-medium ${
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
                      `hover:text-pink-600 pb-2 border-b-2 transition text-sm font-medium ${
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
                      `hover:text-pink-600 pb-2 border-b-2 transition text-sm font-medium ${
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
                      `hover:text-pink-600 pb-2 border-b-2 transition text-sm font-medium ${
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
                      `hover:text-pink-600 pb-2 border-b-2 transition text-sm font-medium ${
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
                      `hover:text-pink-600 pb-2 border-b-2 transition text-sm font-medium ${
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
                      `hover:text-pink-600 pb-2 border-b-2 transition text-sm font-medium ${
                        isActive
                          ? "text-pink-600 border-pink-600"
                          : "text-gray-700 border-transparent"
                      }`
                    }
                  >
                    Contact Us
                  </NavLink>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center gap-2 text-gray-700 min-w-[200px] justify-end">
                  <IoRocketOutline className="text-base" />
                  <span className="text-sm font-medium">
                    Free International Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      {isSticky && <div className="h-[112px] w-full"></div>}

      {/* Mobile Notification Panel */}
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

            {/* Notification Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white z-[130] shadow-xl md:hidden flex flex-col"
            >
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <IoNotifications className="text-xl" />
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                      }}
                      className="text-sm hover:underline flex items-center gap-1"
                    >
                      <FaCheck className="text-xs" />
                      Mark all
                    </button>
                  )}
                  <button
                    onClick={() => setIsMobileNotificationOpen(false)}
                    className="p-1 hover:bg-blue-700 rounded-full"
                  >
                    <IoCloseSharp className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto pb-16 scrollbar-hide">
                {notificationLoading ? (
                  // Skeleton Loader for Notifications
                  [...Array(6)].map((_, idx) => (
                    <div
                      key={idx}
                      className="p-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex gap-3">
                        <Skeleton
                          variant="circular"
                          width={40}
                          height={40}
                          animation="wave"
                          sx={{
                            bgcolor: "#C7CCD8",
                          }}
                        />
                        <div className="flex-1">
                          <Skeleton
                            variant="text"
                            width="60%"
                            height={20}
                            animation="wave"
                            sx={{
                              bgcolor: "#C7CCD8",
                            }}
                          />
                          <Skeleton
                            variant="text"
                            width="90%"
                            height={14}
                            animation="wave"
                            sx={{
                              bgcolor: "#C7CCD8",
                              mt: 1,
                            }}
                          />
                          <Skeleton
                            variant="text"
                            width="40%"
                            height={12}
                            animation="wave"
                            sx={{
                              bgcolor: "#C7CCD8",
                              mt: 1,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <IoNotifications className="text-3xl text-gray-400" />
                    </div>
                    <p className="font-medium">No notifications yet</p>
                    <p className="text-sm mt-1">
                      We'll notify you when something arrives
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 transition-colors cursor-pointer ${
                          !notification.isRead
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : getNotificationBgColor(notification)
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3">
                          {/* Icon Circle */}
                          <div
                            className={`w-10 h-10 rounded-full ${
                              !notification.isRead
                                ? "bg-blue-100"
                                : "bg-gray-100"
                            } flex items-center justify-center flex-shrink-0`}
                          >
                            {getNotificationIcon(notification)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-gray-900 truncate pr-8">
                                {notification.title}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification._id);
                                }}
                                className="ml-2 p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                              >
                                <IoTrashOutline className="text-gray-500 hover:text-red-500" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>

                            {/* Footer with time and link */}
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-400">
                                {formatDistanceToNow(
                                  new Date(notification.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </p>
                              {notification.link && (
                                <span className="text-blue-600 text-xs font-medium hover:underline">
                                  View details →
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                  <button
                    onClick={() => {
                      window.location.href = "/account/notifications";
                      setIsMobileNotificationOpen(false);
                    }}
                    className="text-sm text-blue-600 font-medium hover:text-blue-800"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchModal
        isOpen={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </div>
  );
};

export default Navbar;
