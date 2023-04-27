import React from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  StreetViewPanorama,
} from "@react-google-maps/api";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const center = {
  lat: JSON.parse(localStorage.getItem("lat")),
  lng: JSON.parse(localStorage.getItem("lng")),
};

const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

function Streetview() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <div>
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

export default Streetview;