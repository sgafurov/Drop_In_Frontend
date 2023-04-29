import React from "react";
import { withScriptjs, withGoogleMap } from "react-google-maps";
import Navbar from "./Navbar";
import Map from "./Map";
import Streetview from "./Streetview";
import Reviews from "./review/Reviews";
import "../styles/ApartmentView.css";

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default function ApartmentView(props) {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  return (
    <>
      <div className="apt-view-div">
        <div className="apt-address">
          <h1>{localStorage.getItem("address")}</h1>
          {/* <h1>address: {props.address}</h1> */}
        </div>

        <div className="apt-visuals">
          <div className="apt-pic">
            <div className="streetview">
              <Streetview />
            </div>
          </div>

          <div className="apt-map">
            <Map />
          </div>
        </div>

        {/* SHOW RATING OF ADDRESS */}
        <div className="star-rating">
          {/* Rating: (insert star pic here) */}
        </div>
        {/* SHOW REVIEWS OF ADDRESS */}
        <Reviews />
      </div>
    </>
  );
}
