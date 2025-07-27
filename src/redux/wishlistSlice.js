// src/redux/wishlistSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Helper to load wishlist items from localStorage
const loadWishlistFromStorage = () => {
  try {
    const serializedState = localStorage.getItem("wishlist");
    if (!serializedState) return [];
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Failed to load wishlist from localStorage", e);
    return [];
  }
};

const initialState = {
  items: loadWishlistFromStorage(), // load persisted wishlist or empty array
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const isAlreadyPresent = state.items.find(item => item.id === action.payload.id);
      if (!isAlreadyPresent) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
