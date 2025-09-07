import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setAddresses(state, action) {
      // ✅ FIXED: Properly map addresses with consistent default handling
      console.log("Setting addresses in Redux:", action.payload); // Debug log
      state.addresses = action.payload.map(addr => {
        const isDefault = addr.default || addr.isDefault || false;
        return {
          ...addr,
          isDefault: isDefault,
          default: isDefault, // Keep both fields for consistency
        };
      });
      state.error = null;
    },
    addAddress(state, action) {
      console.log("Adding address to Redux:", action.payload); // Debug log
      const isDefault = action.payload.default || action.payload.isDefault || false;
      
      const newAddress = {
        ...action.payload,
        isDefault: isDefault,
        default: isDefault, // Keep both fields
      };
      
      // If the new address is default, unset all other addresses as default
      if (isDefault) {
        state.addresses.forEach((addr) => {
          addr.default = false;
          addr.isDefault = false;
        });
      }
      
      state.addresses.unshift(newAddress);
      state.error = null;
    },
    editAddress(state, action) {
      console.log("Editing address in Redux:", action.payload); // Debug log
      const idx = state.addresses.findIndex((addr) => addr._id === action.payload._id);
      if (idx !== -1) {
        const isDefault = action.payload.default || action.payload.isDefault || false;
        
        const updatedAddress = {
          ...action.payload,
          isDefault: isDefault,
          default: isDefault, // Keep both fields
        };
        
        // ✅ FIXED: If the edited address is being set as default, unset all other addresses as default
        if (isDefault) {
          state.addresses.forEach((addr, index) => {
            if (index !== idx) { // Don't modify the address we're updating
              addr.default = false;
              addr.isDefault = false;
            }
          });
        }
        
        state.addresses[idx] = updatedAddress;
        state.error = null;
      }
    },
    deleteAddress(state, action) {
      state.addresses = state.addresses.filter((addr) => addr._id !== action.payload);
      state.error = null;
    },
    setDefaultAddress(state, action) {
      console.log("Setting default address in Redux:", action.payload); // Debug log
      // First, set all addresses to non-default
      state.addresses.forEach((addr) => {
        addr.default = false;
        addr.isDefault = false;
      });
      
      // Then set the specified address as default
      const defaultAddr = state.addresses.find((addr) => addr._id === action.payload);
      if (defaultAddr) {
        defaultAddr.default = true;
        defaultAddr.isDefault = true;
      }
      state.error = null;
    },
    clearAddresses(state) {
      state.addresses = [];
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setAddresses,
  addAddress,
  editAddress,
  deleteAddress,
  setDefaultAddress,
  clearAddresses,
} = addressSlice.actions;

export default addressSlice.reducer;