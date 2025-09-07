// src/redux/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Note: In Claude.ai artifacts, localStorage is not available
// In your actual project, you can keep the localStorage functionality
const loadWishlistFromStorage = () => {
  try {
    // For local development, uncomment the next 3 lines:
    // const serializedState = localStorage.getItem("wishlist");
    // if (!serializedState) return [];
    // return JSON.parse(serializedState);
    return []; // Fallback for environments without localStorage
  } catch (e) {
    console.error("Failed to load wishlist from localStorage", e);
    return [];
  }
};

const saveWishlistToStorage = (items) => {
  try {
    // For local development, uncomment the next line:
    // localStorage.setItem("wishlist", JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save wishlist to localStorage", e);
  }
};

const initialState = {
  items: loadWishlistFromStorage(),
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    addToWishlist: (state, action) => {
      const isAlreadyPresent = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!isAlreadyPresent) {
        // Add new item at the beginning of the wishlist array
        state.items.unshift(action.payload);
        saveWishlistToStorage(state.items);
      }
      state.error = null;
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlistToStorage(state.items);
      state.error = null;
    },

    // Replace entire wishlist array (e.g., from backend)
    setWishlist: (state, action) => {
      state.items = action.payload || [];
      saveWishlistToStorage(state.items);
      state.loading = false;
      state.error = null;
    },

    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage([]);
      state.error = null;
    },
  },
});

export const { 
  addToWishlist, 
  removeFromWishlist, 
  setWishlist, 
  clearWishlist, 
  setLoading, 
  setError 
} = wishlistSlice.actions;

export default wishlistSlice.reducer;