import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../images/landing-background2.png";
import Logo from "../images/logo2.png";
import "../styles/Navbar.css";

export default function Navbar() {
  let navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // if (localStorage.getItem("isLoggedIn") === "true") {
    //   console.log("itemFromLocalStorage is true");
    //   setIsLoggedIn(true);
    // }
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, [isLoggedIn]);

  const logoutUser = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  const gotToHome = () => {
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="nav-buttons">
        <div className="nav-home-btn">
          <Link to="/">HOME </Link>
        </div>
        <div>
          <img
            className="nav-logo"
            src={Logo}
            alt="Building and map pin(https://www.flaticon.com/free-icon/houses_353354#)"
            onClick={gotToHome}
          />
        </div>
        {isLoggedIn ? (
          <div className="nav-buttons-logged-in">
            <div className="nav-profile-btn">
              <Link to="/user-dashboard">PROFILE</Link>
            </div>
            <div className="nav-logout-btn">
              <Link to="/" onClick={logoutUser}>
                LOGOUT
              </Link>
            </div>
          </div>
        ) : (
          <div className="nav-login-btn">
            <Link to="/login">LOGIN </Link>
          </div>
        )}
      </div>
    </div>
  );
}
