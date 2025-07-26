import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from "./loadingSlice";

// Create a dummy reducer for now to avoid empty reducer error
const dummyReducer = (state = {}, action) => state;

export const store = configureStore({
  reducer: {
    dummy: dummyReducer,
    loading: loadingReducer,
  },
});
