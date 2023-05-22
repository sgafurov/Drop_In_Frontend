import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  StreetViewPanorama,
} from "@react-google-maps/api";
import { useSelector } from "react-redux";

const placesLibrary = ["places"];
const containerStyle = {
  width: "420px",
  height: "400px",
};

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

export default function Streetview() {
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

  console.log("center redux type: ", addressSlice.lat, typeof addressSlice.lat);

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
    console.log("Streetview.js useEffect activated");
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(centerRedux);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded && addressSlice.lat ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={centerRedux}
        zoom={0}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <StreetViewPanorama position={centerRedux} visible={true} />
      </GoogleMap>
    </div>
  ) : (
    <div>
      <h1>Streetview not loading</h1>
    </div>
  );
}
