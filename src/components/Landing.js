import React, { useEffect, useState } from "react";
import AutoSearch from "./AutoSearch";
import "../styles/Landing.css";
import OneView from "./OneView";

export default function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const localStorageItem = localStorage.getItem("isLoggedIn");

  useEffect(() => {
    if (localStorageItem === "yes") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="landing-page">
      <div className="landing-search">
        <h1 className="landing-title">DROP-IN</h1>

        <AutoSearch />
        {/* <OneView/> */}
      </div>
    </div>
  );
}
