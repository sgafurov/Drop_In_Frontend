import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  StreetViewPanorama,
} from "@react-google-maps/api";
import "../styles/OneView.css";

const placesLibrary = ["places"];
const containerStyle = {
  width: "400px",
  height: "400px",
};

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

export default function Streetview() {
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
    console.log("Streetview.js useEffect activated");
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
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
  ) : (
    <div>
      <h1>Streetview not loading</h1>
    </div>
  );
}

// export default React.memo(Streetview);
