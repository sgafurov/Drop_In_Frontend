import React, { useEffect } from "react";
import { withScriptjs, withGoogleMap } from "react-google-maps";
import Map from "./Map";
import Streetview from "./Streetview";
import Reviews from "../review/Reviews";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, setCoords } from "../../store/addressSlice";
import Loading from "../Loading";
import "../../styles/ApartmentView.css";

export default function ApartmentView() {
  let dispatch = useDispatch();
  const addressSlice = useSelector((state) => state.addressSlice); // state refers to store.js

  // useEffect(() => {
  //   if (localStorage.getItem("lat")) {
  //     dispatch(
  //       setCoords({
  //         lat: localStorage.getItem("lat"),
  //         lng: localStorage.getItem("lng"),
  //       })
  //     );
  //     dispatch(setAddress(localStorage.getItem("address")));
  //   }
  // }, []);

  return (
    <>
      <div className="apt-view-div">
        <div className="apt-address">
          <h1>{addressSlice.address}</h1>
        </div>

        {addressSlice.lat ? (
          <div className="apt-visuals">
            <div className="streetview-div">
              <Streetview />
            </div>

            <div className="map-div">
              <Map />
            </div>
          </div>
        ) : (
          <Loading />
        )}

        <Reviews address={addressSlice.address}/>
      </div>
    </>
  );
}
