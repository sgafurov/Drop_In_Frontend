import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { useDispatch } from "react-redux";
import { setAddress, setCoords } from "../store/addressSlice";
import "../styles/AutoSearch.css";

const placesLibrary = ["places"];
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

export default function AutoSearch() {
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const inputRef = useRef(null);

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
      const { name, formatted_address } = place; //destructuring

      geocodeByAddress(formatted_address)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          console.log("Success from geocodeByAddress", latLng);
          localStorage.setItem("lat", latLng.lat);
          localStorage.setItem("lng", latLng.lng);

          dispatch(setCoords({ lat: latLng.lat, lng: latLng.lng })); //what we pass into setCoords is the "payload"

          console.log("Lat from localStorage ", localStorage.getItem("lat"));
          console.log("Lng from localStorage ", localStorage.getItem("lng"));
        })
        .catch((error) => console.error("Error", error));

      localStorage.setItem("address", formatted_address);

      dispatch(setAddress(formatted_address));

      console.log(`Name: ${name}`);
      console.log(`Formatted Address: ${formatted_address}`);
    } else {
      alert("Please enter an address");
    }
    inputRef.current.value = "";
    navigate(`/apartment-view`);
  }

  return isLoaded ? (
    <div className="autocomplete">
      <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
        <input
          ref={inputRef}
          className="autocomplete-input"
          type="text"
          placeholder="Search for an address"
        />
      </Autocomplete>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
