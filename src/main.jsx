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
import  toast  from "react-hot-toast";

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
      const clientToken = localStorage.getItem("client_token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/cart/getCartItems`,
        { 
          headers: clientToken ? {
            'Authorization': `Bearer ${clientToken}`,
            'X-Client-Request': 'true'
          } : {},
          withCredentials: !clientToken // Use cookies only if no token
        }
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
      const clientToken = localStorage.getItem("client_token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/wishlist/getWishlist`,
        { 
          headers: clientToken ? {
            'Authorization': `Bearer ${clientToken}`,
            'X-Client-Request': 'true'
          } : {},
          withCredentials: !clientToken // Use cookies only if no token
        }
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
        // First check localStorage for client token
        const clientToken = localStorage.getItem("client_token");
        const clientUser = localStorage.getItem("client_user");

        if (clientToken && clientUser) {
          try {
            const parsedUser = JSON.parse(clientUser);
            
            // Verify token with backend using Authorization header
            const res = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,
              { 
                headers: {
                  'Authorization': `Bearer ${clientToken}`,
                  'X-Client-Request': 'true' // Flag for client request
                }
              }
            );

            // ✅ Role check: only allow "user" in client app
            if (res.data.user.role === "user") {
              setUser(res.data.user);
              setIsAuthenticated(true);
            } else {
              // Clear localStorage if role mismatch
              localStorage.removeItem("client_token");
              localStorage.removeItem("client_user");
              setUser(null);
              setIsAuthenticated(false);
              toast.error("Unauthorized access. Please login with a user account.");
            }
          } catch (tokenError) {
            // Token verification failed, clear localStorage
            localStorage.removeItem("client_token");
            localStorage.removeItem("client_user");
            setUser(null);
            setIsAuthenticated(false);
            
            if (tokenError.response?.status === 401) {
              toast.info("Your session has expired. Please login again.");
            }
          }
        } else {
          // Fallback: Try cookie-based authentication (for backward compatibility)
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,
              { 
                withCredentials: true,
                headers: {
                  'X-Client-Request': 'true'
                }
              }
            );

            // ✅ Role check: only allow "user" in client app
            if (res.data.user.role === "user") {
              setUser(res.data.user);
              setIsAuthenticated(true);
            } else {
              // If admin/seller/moderator tries to login to client app → logout immediately
              await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
                { 
                  withCredentials: true,
                  headers: {
                    'X-Client-Request': 'true'
                  }
                }
              );
              setUser(null);
              setIsAuthenticated(false);
              toast.error("Unauthorized access. Please login with a user account.");
            }
          } catch (cookieError) {
            setUser(null);
            setIsAuthenticated(false);
            if (cookieError.response?.status === 401) {
              toast.info("Your session has expired. Please login again.");
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
        setIsAuthenticated(false);
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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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