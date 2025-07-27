import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from "./loadingSlice";
import wishlistReducer from './wishlistSlice';

// Create a dummy reducer for now to avoid empty reducer error
const dummyReducer = (state = {}, action) => state;

export const store = configureStore({
  reducer: {
    dummy: dummyReducer,
    loading: loadingReducer,
    wishlist: wishlistReducer,
  },
});

// Subscribe to store changes and save wishlist to localStorage
store.subscribe(() => {
  const { wishlist } = store.getState();
  try {
    const serializedState = JSON.stringify(wishlist.items);
    localStorage.setItem("wishlist", serializedState);
  } catch (e) {
    console.error("Failed to save wishlist to localStorage", e);
  }
});
