import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  review_id: "",
  address: "",
  comment_body: "",
  star_rating: null,
  timestamp: "",
};

export const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {
    setReview: (state, action) => {
      state.review_id = action.payload.review_id;
      state.address = action.payload.address;
      state.comment_body = action.payload.comment_body;
      state.star_rating = action.payload.star_rating;
      state.timestamp = action.payload.timestamp;
    },
  },
});

export const { setReview } = reviewSlice.actions;
export default reviewSlice.reducer;
