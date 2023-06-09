import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  useLoadScript,
  useJsApiLoader,
  GoogleMap,
} from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import Loading from "./Loading";

import { useDispatch } from "react-redux";
import { setAddress, setCoords } from "../store/addressSlice";

const placesLibrary = ["places"];
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

export default function AutoSearch() {
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const [map, setMap] = useState(null);

  const [searchResult, setSearchResult] = useState("");

  const [isLoading, setIsLoading] = useState(false); // add a state variable to keep track of loading

  // const [center, setCenter] = useState({
  //   lat: JSON.parse(localStorage.getItem("lat")),
  //   lng: JSON.parse(localStorage.getItem("lng")),
  // });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: placesLibrary,
  });

  // useEffect(() => {
  //   setCenter({
  //     lat: JSON.parse(localStorage.getItem("lat")),
  //     lng: JSON.parse(localStorage.getItem("lng")),
  //   });
  //   console.log("AutoSearch useEffect activated");
  // }, []);

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
          // setCenter({
          //   lat: JSON.parse(latLng.lat),
          //   lng: JSON.parse(latLng.lng),
          // });
        })
        .catch((error) => console.error("Error", error));

      localStorage.setItem("address", formatted_address);

      dispatch(setAddress(formatted_address));

      // setSearchResult(formatted_address);

      console.log(`Name: ${name}`);
      console.log(`Formatted Address: ${formatted_address}`);
    } else {
      alert("Please enter an address");
    }
    setIsLoading(true); // show the loading screen
    // setTimeout(() => {
    //   navigate("/apartment-view");
    // }, 3000);
    navigate("/apartment-view");
  }

  // if (isLoading) {
  //   return (
  //     <div>
  //       <Loading />
  //     </div>
  //   );
  // } else {
  return isLoaded ? (
    <div className="autocomplete">
      <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
        <input
          type="text"
          placeholder="123 Main St..."
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        />
      </Autocomplete>
    </div>
  ) : (
    <div>Loading...</div>
  );
  // }
}
