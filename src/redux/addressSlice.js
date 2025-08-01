import { createSlice, nanoid } from "@reduxjs/toolkit";

// Helper to load addresses from localStorage
const loadAddressesFromStorage = () => {
  try {
    const serializedState = localStorage.getItem("addresses");
    if (!serializedState) return [];
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Failed to load addresses from localStorage", e);
    return [];
  }
};

// Helper to save addresses to localStorage
const saveAddressesToStorage = (addresses) => {
  try {
    const serializedState = JSON.stringify(addresses);
    localStorage.setItem("addresses", serializedState);
  } catch (e) {
    console.error("Failed to save addresses to localStorage", e);
  }
};

const initialState = {
  addresses: loadAddressesFromStorage(), // initialize from localStorage or empty
};

const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    addAddress: {
      reducer(state, action) {
        // Add new address at the beginning (top) of the list
        state.addresses.unshift(action.payload);
        saveAddressesToStorage(state.addresses);
      },
      prepare(address) {
        return { payload: { ...address, id: nanoid() } };
      },
    },

    editAddress(state, action) {
      const idx = state.addresses.findIndex(
        (addr) => addr.id === action.payload.id
      );
      if (idx !== -1) {
        state.addresses[idx] = action.payload;
        saveAddressesToStorage(state.addresses);
      }
    },
    deleteAddress(state, action) {
      state.addresses = state.addresses.filter(
        (addr) => addr.id !== action.payload
      );
      saveAddressesToStorage(state.addresses);
    },
    setDefaultAddress(state, action) {
      state.addresses.forEach((addr) => (addr.isDefault = false));
      const def = state.addresses.find((addr) => addr.id === action.payload);
      if (def) {
        def.isDefault = true;
        saveAddressesToStorage(state.addresses);
      }
    },
  },
});

export const { addAddress, editAddress, deleteAddress, setDefaultAddress } =
  addressSlice.actions;
export default addressSlice.reducer;
