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

  const [address, setLocalAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [loginData, setLoginData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    user_type: "",
    favorites: "",
  });

  useEffect(() => {
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

  function updateAddress(newAddress) {
    //console.log('getting child address data in app.js:', newAddress)
    setLocalAddress(...address, (address) => newAddress);
  }

  function updateCoordinates(newCoord) {
    //console.log('getting child coordinates data in app.js:', newCoord)
    setCoordinates((coordinates) => newCoord);
  }

  function updateUserData(newData) {
    console.log("getting child coordinates data in app.js:", newData);
    setLoginData((prevData) => newData);
  }

  // just adding comment here to trigger automatic deployment on Cloudflare pages

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes className="routes">
          <Route
            exact
            path="/"
            element={
              <Landing
                updateAddress={updateAddress}
                updateCoordinates={updateCoordinates}
              />
            }
          />
          <Route
            exact
            path="/apartment-view"
            element={
              <ApartmentView address={address} coordinates={coordinates} />
            }
          />
          <Route
            exact
            path="/login"
            element={<Login updateUserData={updateUserData} />}
          />
          <Route
            exact
            path="/signup"
            element={<SignUp updateUserData={updateUserData} />}
          />
          <Route
            exact
            path="/user-dashboard"
            element={<UserDashboard loginData={loginData} />}
          />
        </Routes>
      </Router>
    </div>
  );
}
// const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
// // ${process.env.GOOGLE_MAPS_API_KEY}
//  export default scriptLoader([`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`])(App);
//  //export default App
