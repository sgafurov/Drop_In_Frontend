import {configureStore} from "@reduxjs/toolkit"
import addressSlice from "./addressSlice"

export const store = configureStore({
    reducer: {
        addressSlice,
    }
})