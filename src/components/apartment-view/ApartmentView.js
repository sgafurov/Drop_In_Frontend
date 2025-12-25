import React, { useEffect, useState } from "react";
import { withScriptjs, withGoogleMap } from "react-google-maps";
import Map from "./Map";
import Streetview from "./Streetview";
import Reviews from "../review/Reviews";
import Stars from "../review/Stars";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, setCoords } from "../../store/addressSlice";
import Loading from "../Loading";
import "../../styles/ApartmentView.css";

export default function ApartmentView() {
  let dispatch = useDispatch();
  const addressSlice = useSelector((state) => state.addressSlice); // state refers to store.js
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);

  useEffect(() => {
    console.log("ApartmentView - Address from Redux:", addressSlice.address);
    console.log("ApartmentView - Address from localStorage:", localStorage.getItem("address"));
  }, [addressSlice.address]);

  const handleAverageRatingChange = (rating, count) => {
    setAverageRating(rating);
    setReviewCount(count);
    setReviewsLoaded(true);
  };

  useEffect(() => {
    // Reset reviews loaded when address changes
    if (addressSlice.address) {
      setReviewsLoaded(false);
    }
  }, [addressSlice.address]);

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
          {reviewsLoaded && reviewCount > 0 ? (
            <div className="apt-rating-container">
              <div className="apt-rating-stars">
                <Stars rating={Math.round(averageRating * 2) / 2} />
              </div>
              <div className="apt-rating-text">
                <span className="apt-rating-value">{averageRating.toFixed(1)}</span>
                <span className="apt-rating-count">
                  {reviewCount === 1 ? '(1)' : `(${reviewCount})`}
                </span>
              </div>
            </div>
          ) : reviewsLoaded && reviewCount === 0 ? (
            <div className="apt-rating-container">
              <div className="no-reviews-message-header">
                <p>No Reviews Yet</p>
              </div>
            </div>
          ) : null}
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

        <Reviews address={addressSlice.address} onAverageRatingChange={handleAverageRatingChange}/>
      </div>
    </>
  );
}
