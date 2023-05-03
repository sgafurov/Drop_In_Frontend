import { createSlice } from "@reduxjs/toolkit"; 

// initial state variables
const initialState = {
    address:"",
    lat: null,
    lng: null
}

export const addressSlice = createSlice({
    name: "addressSlice",
    initialState,
    reducers: { // the functions that change the state / the updaters
        // state is the object
        // action is an object with payload property
        setAddress: (state, action) => {
            state.address = action.payload // the payload the data we are sending to here
        },
        setCoords: (state, action) => {
            state.lat = action.payload.lat
            state.lng = action.payload.lng
        }
    }
})

export const {setAddress, setCoords} = addressSlice.actions // we will import actions in our components to use the actions
export default addressSlice.reducer // this entire file that we'll be adding to our store