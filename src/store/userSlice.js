import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  password: "",
  email: "",
  firstname: "",
  lastname: "",
  address: "",
  user_type: "",
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
      state.email = action.payload.email;
      state.firstname = action.payload.firstname;
      state.lastname = action.payload.lastname;
      state.address = action.payload.address;
      state.user_type = action.payload.user_type;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setFirstname: (state, action) => {
      state.firstname = action.payload;
    },
    setLastname: (state, action) => {
      state.lastname = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setUserType: (state, action) => {
      state.user_type = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const {
  setUserInfo,
  setUsername,
  setPassword,
  setEmail,
  setFirstname,
  setLastname,
  setAddress,
  setUserType,
  setIsLoggedIn,
} = userSlice.actions;
export default userSlice.reducer;
