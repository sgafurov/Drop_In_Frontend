// testing a way to just render all the map components on one page

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  StreetViewPanorama,
  Autocomplete,
} from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import "../styles/OneView.css";

const placesLibrary = ["places"];
const containerStyle = {
  width: "400px",
  height: "400px",
};

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

export default function OneView() {
  const [searchResult, setSearchResult] = useState("");

  const [map, setMap] = useState(null);

  const [center, setCenter] = useState({
    lat: JSON.parse(localStorage.getItem("lat")),
    lng: JSON.parse(localStorage.getItem("lng")),
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: placesLibrary,
  });

  useEffect(() => {
    setCenter({
      lat: JSON.parse(localStorage.getItem("lat")),
      lng: JSON.parse(localStorage.getItem("lng")),
    });
    console.log("OneView.js useEffect activated");
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  function autocompleteOnload(autocomplete) {
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
          console.log("Lat from localStorage ", localStorage.getItem("lat"));
          console.log("Lng from localStorage ", localStorage.getItem("lng"));
          setCenter({
            lat: JSON.parse(latLng.lat),
            lng: JSON.parse(latLng.lng),
          });
        })
        .catch((error) => console.error("Error", error));

      localStorage.setItem("formattedAddress", formatted_address);
      setSearchResult(formatted_address);
      // setCenter({
      //   lat: JSON.parse(localStorage.getItem("lat")),
      //   lng: JSON.parse(localStorage.getItem("lng")),
      // });
      console.log(`Name: ${name}`);
      console.log(`Formatted Address: ${formatted_address}`);
    } else {
      alert("Please enter an address");
    }
  }

  return isLoaded ? (
    <div className="map-components">
      <div className="autocomplete">
        <Autocomplete
          onPlaceChanged={onPlaceChanged}
          onLoad={autocompleteOnload}
        >
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

      <div className="map-and-streetview">
        <div className="map">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={0}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Child components, such as markers, info windows, etc. */}
            <MarkerF position={center}></MarkerF>
          </GoogleMap>
        </div>

        <div className="streetview">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={0}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Child components, such as markers, info windows, etc. */}
            <StreetViewPanorama position={center} visible={true} />
          </GoogleMap>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <h1>Map not loading</h1>
    </div>
  );
}
