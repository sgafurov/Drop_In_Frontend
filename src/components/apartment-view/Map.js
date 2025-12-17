import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";
import { setCoords } from "../../store/addressSlice";
import "../../styles/Map.css";

const placesLibrary = ["places"];
// const containerStyle = {
//   width: "500px",
//   height: "450px",
// };

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

export default function Map() {
  let dispatch = useDispatch();

  const addressSlice = useSelector((state) => state.addressSlice); // state refers to store.js

  const [map, setMap] = useState(null);

  const [center, setCenter] = useState({
    lat: JSON.parse(localStorage.getItem("lat")),
    lng: JSON.parse(localStorage.getItem("lng")),
  });

  const centerRedux = {
    lat: addressSlice.lat,
    lng: addressSlice.lng,
  };

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: placesLibrary,
  });

  useEffect(() => {
    if (localStorage.getItem("lat")) {
    }
    setCenter({
      lat: JSON.parse(localStorage.getItem("lat")),
      lng: JSON.parse(localStorage.getItem("lng")),
    });
    console.log("Map.js useEffect activated");
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(centerRedux);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div>
        <h1 style={{ color: "red" }}>Google Maps API Error</h1>
        <p>{loadError.message || "API key is missing or expired"}</p>
        <small>Please check your REACT_APP_GOOGLE_API_KEY in the .env file</small>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div>
        <h1 style={{ color: "red" }}>Google Maps API Key Missing</h1>
        <p>Please add REACT_APP_GOOGLE_API_KEY to your .env file</p>
      </div>
    );
  }

  return isLoaded && addressSlice.lat ? (
    <div>
      <GoogleMap
        // mapContainerStyle={containerStyle}
        center={centerRedux}
        zoom={0}
        onLoad={onLoad}
        onUnmount={onUnmount}
        mapContainerClassName="map"
      >
        {/* Child components, such as markers, info windows, etc. */}
        <MarkerF position={centerRedux}></MarkerF>
      </GoogleMap>
    </div>
  ) : (
    <div>
      <h1>Map not loading</h1>
    </div>
  );
}
