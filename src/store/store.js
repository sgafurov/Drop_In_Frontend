import { configureStore } from "@reduxjs/toolkit";
import addressSlice from "./addressSlice";
import userSlice from "./userSlice";
import reviewSlice from "./reviewSlice";

export const store = configureStore({
  reducer: {
    addressSlice,
    userSlice,
    reviewSlice,
  },
});
