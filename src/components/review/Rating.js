import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setRating as setRatingAction } from "../../store/reviewSlice";
import "../../styles/Rating.css";

export default function Rating({ initialRating = 0 }) {
  const dispatch = useDispatch();
  const reduxRating = useSelector((state) => state.reviewSlice.rating);
  
  // Initialize: prefer initialRating prop, then Redux state, default to 0
  const initialValue = initialRating > 0 ? initialRating : (reduxRating !== null ? reduxRating : 0);
  const [rating, setRating] = useState(initialValue);
  const [hover, setHover] = useState(initialValue);

  // Update Redux when rating changes
  useEffect(() => {
    if (rating > 0) {
      dispatch(setRatingAction(rating));
    }
  }, [rating, dispatch]);

  // Update hover state when initialRating prop changes
  useEffect(() => {
    if (initialRating > 0) {
      setRating(initialRating);
      setHover(initialRating);
      dispatch(setRatingAction(initialRating));
    }
  }, [initialRating, dispatch]);

  // Sync local state with Redux state when it changes externally
  useEffect(() => {
    if (reduxRating !== null && reduxRating !== rating && initialRating === 0) {
      setRating(reduxRating);
      setHover(reduxRating);
    }
  }, [reduxRating, initialRating]);

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= hover ? "on" : "off"}
            id="star-rating-btn"
            onClick={() => {
              setRating(index);
              console.log("index is: ", index);
              console.log("rating is: ", rating);
              console.log("hover is: ", hover);
            }}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
}
