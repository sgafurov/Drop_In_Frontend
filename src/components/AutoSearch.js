// import React, { useEffect } from "react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import PlacesAutocomplete, {
//   geocodeByPlaceId,
//   getLatLng,
// } from "react-places-autocomplete";
// import scriptLoader from "react-async-script-loader";

// function AutoSearch(props, isScriptLoaded, isScriptLoadSucceed) {
//   console.log("AutoSearch Props: ", props);

//   let navigate = useNavigate();

//   const [address, setAddress] = useState("");

//   const [userInput, setUserInput] = useState("");

//   const [coordinates, setCoordinates] = useState({
//     lat: null,
//     lng: null,
//   });

//   useEffect(() => {
//     props.updateAddress(address);
//     props.updateCoordinates(coordinates);
//   }, [address]);

//   const handleChange = (value) => {
//     setUserInput(value);
//   };

//   const handleSelect = async (value, valuePlaceID) => {
//     console.log("valuePlaceID ", valuePlaceID);
//     console.log("in handleSelect ", address);
//     console.log("in handleSelect ", coordinates);

//     const results = await geocodeByPlaceId(valuePlaceID);
//     console.log(results);

//     const latLng = await getLatLng(results[0]);
//     console.log("latLng", latLng);
//     console.log("lat", results[0].geometry.location.lat());

//     setCoordinates((prevCoords) => ({
//       ...prevCoords,
//       lat: latLng.lat,
//       lng: latLng.lng,
//     }));

//     setUserInput(value);
//     setAddress(...address, (address) => value);

//     props.updateAddress(address);
//     props.updateCoordinates(coordinates);

//     const placeID = valuePlaceID;
//     localStorage.setItem("address", value);
//     localStorage.setItem("lat", JSON.stringify(latLng.lat).substr(0, 12));
//     localStorage.setItem("lng", JSON.stringify(latLng.lng).substr(0, 12));
//     localStorage.setItem("placeID", placeID);
//     navigate("/apartment-view");
//   };

//   if (props.isScriptLoaded && props.isScriptLoadSucceed) {
//     return (
//       <div>
//         <PlacesAutocomplete
//           value={userInput}
//           valuePlaceID
//           onChange={handleChange}
//           onSelect={handleSelect}
//         >
//           {({
//             getInputProps,
//             suggestions,
//             getSuggestionItemProps,
//             loading,
//           }) => (
//             <div>
//               <input
//                 {...getInputProps({
//                   placeholder: "Enter Address ...",
//                   className: "location-search-input",
//                 })}
//               />

//               <div className="autocomplete-dropdown-container">
//                 {loading && <div>Loading...</div>}

//                 {suggestions.map((suggestion) => {
//                   const style = suggestion.active
//                     ? { backgroundColor: "#4287f5", cursor: "pointer" }
//                     : { backgroundColor: "#ffffff", cursor: "pointer" };

//                   return (
//                     <div
//                       key={suggestion.description}
//                       {...getSuggestionItemProps(suggestion, { style })}
//                     >
//                       <span>{suggestion.description}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </PlacesAutocomplete>
//       </div>
//     );
//   } else {
//     return <div>NOT loaded</div>;
//   }
// }

// const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
// export default scriptLoader([
//   `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`,
// ])(AutoSearch);


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, useLoadScript, useJsApiLoader } from "@react-google-maps/api";
const placesLibrary = ["places"];

function AutoSearch() {
  let navigate = useNavigate();

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const [searchResult, setSearchResult] = useState("");

  const { isLoaded } = useLoadScript({
    //   id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: placesLibrary,
  });

  function onLoad(autocomplete) {
    setSearchResult(autocomplete);
  }

  async function onPlaceChanged() {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      const name = place.name;
      const formattedAddress = place.formatted_address;
      setSearchResult(formattedAddress)
      getGeocode()
      localStorage.setItem("formattedAddress", formattedAddress);
      console.log(`Name: ${name}`);
      console.log(`Formatted Address: ${formattedAddress}`);
    } else {
      alert("Please enter an address");
    }
  }

  async function getGeocode(){
    await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${localStorage.getItem("formattedAddress")}&key=${apiKey}`
    )
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        let LATLNG = jsonData.results[0].geometry.location;
        console.log(`LATLNG for ${localStorage.getItem("formattedAddress")} is ` + LATLNG); // example {lat: 45.425152, lng: -75.6998028}
        localStorage.setItem(
          "address",
          LATLNG
        );
        localStorage.setItem("lat", LATLNG.lat);
        localStorage.setItem("lng", LATLNG.lng);
        navigate("/apartment-view");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return isLoaded ? (
    <div className="App">
      <div id="searchColumn">
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
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default AutoSearch;
