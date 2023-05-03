import {configureStore} from "@reduxjs/toolkit"
import addressSlice from "./addressSlice"
import userSlice from "./userSlice"

export const store = configureStore({
    reducer: {
        addressSlice,
        userSlice: userSlice
    }
})