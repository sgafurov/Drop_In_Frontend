import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username:"",
  address:"",
  review_id: "",
  review_body: "",
  rating: null,
};

export const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {
    setReview: (state, action) => {
      state.username = action.payload.username;
      state.address = action.payload.address;
      state.review_id = action.payload.review_id;
      state.review_body = action.payload.review_body;
      state.rating = action.payload.rating;
    },
    setRating: (state, action) => {
      state.rating = action.payload;
    },
    clearRating: (state) => {
      state.rating = null;
    },
  },
});

export const { setReview, setRating, clearRating } = reviewSlice.actions;
export default reviewSlice.reducer;
