import "./styles/App.css";
import ApartmentView from "./components/ApartmentView";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/login-signup/Login";
import SignUp from "./components/login-signup/SignUp";
import UserDashboard from "./components/user/UserDashboard";
import Navbar from "./components/Navbar";
import { BASE_URL } from "./constants";
import { useDispatch } from "react-redux";
import { setAddress, setCoords } from "../src/store/addressSlice.js";
import { setUserInfo, setIsLoggedIn } from "../src/store/userSlice";

export default function App() {
  const dispatch = useDispatch();

   useEffect(async () => {
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

    //NEWWW
    const userFromStorage = localStorage.getItem("username")
    console.log("userFromStorage", userFromStorage)
    try {
      const res = await fetch(`${BASE_URL}/user/userInfo`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userFromStorage), //login data is currently a JS object. so you have to send it as JSON object
      });
      const resObject = await res.json();
      console.log("line 48 of app.js getting userInfo", resObject);
      if (resObject.status == 400) {
        throw resObject;
      }
      dispatch(setIsLoggedIn(true));
      dispatch(
        setUserInfo({
          username: resObject.username,
          password: resObject.password,
          email: resObject.email,
          firstname: resObject.firstname,
          lastname: resObject.lastname,
          address: resObject.address,
          user_type: resObject.user_type,
        })
      );
    } catch (err) {
      console.log("line 65 of app.js getting userInfo error", err);
      if (err.status == 400) {
        alert(err.message);
      }
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
