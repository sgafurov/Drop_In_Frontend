import React, { useState } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import "../../styles/Login.css";

import { useDispatch } from "react-redux";
import { setAddress } from "../../store/userSlice";

const placesLibrary = ["places"];
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

export default function SearchBar() {
  let dispatch = useDispatch();

  const [searchResult, setSearchResult] = useState("");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: placesLibrary,
  });

  function onLoad(autocomplete) {
    setSearchResult(autocomplete);
  }

  async function onPlaceChanged() {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      const { formatted_address } = place; //destructuring
      localStorage.setItem("address", formatted_address);
      dispatch(setAddress(formatted_address));
    } else {
      alert("Please enter an address");
    }
  }

  return isLoaded ? (
    <div className="autocomplete">
      <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
        <input
          className="login-input"
          type="text"
          placeholder="Enter your address"
        />
      </Autocomplete>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
