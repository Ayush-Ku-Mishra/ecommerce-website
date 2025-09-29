import { StrictMode, createContext, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import axios from "axios";
import toast from "react-hot-toast";

// Create global context
export const Context = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
  cartCount: 0,
  updateCartCount: () => {},
  wishlistCount: 0,
  updateWishlistCount: () => {},
  loadingAddresses: false,
  setLoadingAddresses: () => {},
});

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loadingAddresses, setLoadingAddresses] = useState(false); // NEW

  // Fetch cart count
  const fetchCartCount = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/cart/getCartItems`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const totalCount = res.data.data.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartCount(totalCount);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  const updateCartCount = () => {
    fetchCartCount();
  };

  // Fetch wishlist count
  const fetchWishlistCount = async () => {
    if (!isAuthenticated) {
      setWishlistCount(0);
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/wishlist/getWishlist`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setWishlistCount(res.data.data.length);
      }
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
      setWishlistCount(0);
    }
  };

  const updateWishlistCount = () => {
    fetchWishlistCount();
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,
          { withCredentials: true }
        );
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        if (error.response?.status === 401) {
          toast.error("Your session has expired. Please login again.");
        }
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch cart & wishlist when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
      fetchWishlistCount();
    } else {
      setCartCount(0);
      setWishlistCount(0);
    }
  }, [isAuthenticated]);

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        authLoading,
        cartCount,
        updateCartCount,
        wishlistCount,
        updateWishlistCount,
        loadingAddresses, // NEW
        setLoadingAddresses, // NEW
      }}
    >
      <App />
    </Context.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppWrapper />
  </Provider>
);
