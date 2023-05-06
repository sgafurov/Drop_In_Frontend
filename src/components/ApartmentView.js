import React from "react";
import { withScriptjs, withGoogleMap } from "react-google-maps";
import Map from "./Map";
import Streetview from "./Streetview";
import Reviews from "./review/Reviews";
import "../styles/ApartmentView.css";

import { useSelector } from "react-redux";

export default function ApartmentView() {
  const addressSlice = useSelector((state) => state.addressSlice); // state refers to store.js

  return (
    <>
      <div className="apt-view-div">
        <div className="apt-address">
          <h1>{addressSlice.address}</h1>
        </div>

        <div className="apt-visuals">
          <div className="streetview-div">
            <Streetview />
          </div>

          <div className="map-div">
            <Map />
          </div>
        </div>

        <Reviews />
      </div>
    </>
  );
}
