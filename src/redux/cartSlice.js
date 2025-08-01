import { createSlice } from "@reduxjs/toolkit";

// Utility function to load cart from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const serialized = localStorage.getItem("cartItems");
    if (!serialized) return { items: [] };
    return { items: JSON.parse(serialized) };
  } catch (e) {
    console.warn("Failed to load cart from localStorage", e);
    return { items: [] };
  }
};

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingIndex = state.items.findIndex(
        (item) =>
          item.id === newItem.id &&
          (newItem.selectedSize
            ? item.selectedSize === newItem.selectedSize
            : true)
      );

      if (existingIndex !== -1) {
        state.items[existingIndex].quantity += newItem.quantity || 1;
      } else {
        // Add new item at the beginning of the items array
        state.items.unshift({ ...newItem, quantity: newItem.quantity || 1 });
      }
    },

    removeFromCart: (state, action) => {
      const idToRemove = action.payload;
      state.items = state.items.filter((item) => item.id !== idToRemove);
    },

    updateQuantity: (state, action) => {
      const { id, quantity, selectedSize } = action.payload;
      if (quantity < 1) return;
      const index = state.items.findIndex(
        (item) =>
          item.id === id &&
          (!selectedSize || item.selectedSize === selectedSize)
      );
      if (index !== -1) {
        state.items[index].quantity = quantity;
      }
    },

    increaseQuantity: (state, action) => {
      const { id, selectedSize } = action.payload;
      const index = state.items.findIndex(
        (item) =>
          item.id === id &&
          (!selectedSize || item.selectedSize === selectedSize)
      );
      if (index !== -1) {
        state.items[index].quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const { id, selectedSize } = action.payload;
      const index = state.items.findIndex(
        (item) =>
          item.id === id &&
          (!selectedSize || item.selectedSize === selectedSize)
      );
      if (index !== -1 && state.items[index].quantity > 1) {
        state.items[index].quantity -= 1;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
