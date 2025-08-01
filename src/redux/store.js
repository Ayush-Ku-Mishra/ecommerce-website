import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from "./loadingSlice";
import wishlistReducer from './wishlistSlice';
import cartReducer from "./cartSlice";
import addressReducer from "./addressSlice";

const dummyReducer = (state = {}, action) => state;

export const store = configureStore({
  reducer: {
    dummy: dummyReducer,
    loading: loadingReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    addresses: addressReducer,
  },
});

// Save wishlist to localStorage
store.subscribe(() => {
  const { wishlist } = store.getState();
  try {
    const serializedWishlist = JSON.stringify(wishlist.items);
    localStorage.setItem("wishlist", serializedWishlist);
  } catch (e) {
    console.error("Failed to save wishlist to localStorage", e);
  }
});

// Save cart to localStorage — ADD THIS!
store.subscribe(() => {
  const { cart } = store.getState();
  try {
    const serializedCart = JSON.stringify(cart.items);
    localStorage.setItem("cartItems", serializedCart);
  } catch (e) {
    console.error("Failed to save cart to localStorage", e);
  }
});
