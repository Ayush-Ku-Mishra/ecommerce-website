import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const Context = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
  cartCount: 0,
  updateCartCount: () => {},
  wishlistCount: 0,
  updateWishlistCount: () => {},
});

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Function to fetch cart count
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

  // Function to update cart count
  const updateCartCount = () => {
    fetchCartCount();
  };

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,
          { withCredentials: true }
        );

        // ✅ Role check: only allow "user" in client app
        if (res.data.user.role === "user") {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          // If admin/seller/moderator tries to login to client app → logout immediately
          await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
            { withCredentials: true }
          );
          setUser(null);
          setIsAuthenticated(false);
          toast.error("Unauthorized access. Please login with a user account.");
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        if (error.response?.status === 401) {
          toast.info("Your session has expired. Please login again.");
        }
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch cart & wishlist count when auth changes
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
