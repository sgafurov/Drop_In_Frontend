import "./styles/App.css";
import ApartmentView from "./components/ApartmentView";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/login-signup/Login";
import SignUp from "./components/login-signup/SignUp";
import UserDashboard from "./components/user/UserDashboard";
import Navbar from "./components/Navbar";
// import scriptLoader from 'react-async-script-loader'

import { useDispatch } from "react-redux";
import { setAddress, setCoords } from "../src/store/addressSlice.js";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // when user refreshes the page, this will add data to our redux states again
    const addressFromStorage = localStorage.getItem("address");
    const coordsFromStorage = {
      lat: localStorage.getItem("lat"),
      lng: localStorage.getItem("lng"),
    };
    if (addressFromStorage) {
      dispatch(setAddress(addressFromStorage));
      dispatch(
        setCoords({
          lat: JSON.parse(coordsFromStorage.lat),
          lng: JSON.parse(coordsFromStorage.lng),
        })
      );
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes className="routes">
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/apartment-view" element={<ApartmentView />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}
// const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
// // ${process.env.GOOGLE_MAPS_API_KEY}
//  export default scriptLoader([`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`])(App);
//  //export default App
