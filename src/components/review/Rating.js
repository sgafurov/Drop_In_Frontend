import React, { useEffect, useState } from "react";
import "../../styles/Rating.css";

export default function Rating({ initialRating = 0 }) {
  // Initialize from prop, localStorage, or default to 0
  const getInitialRating = () => {
    if (initialRating > 0) {
      return initialRating;
    }
    const storedRating = localStorage.getItem("rating");
    return storedRating ? parseInt(storedRating) : 0;
  };

  const [rating, setRating] = useState(getInitialRating());
  const [hover, setHover] = useState(getInitialRating());

  // Update localStorage when rating changes
  useEffect(() => {
    if (rating > 0) {
      localStorage.setItem("rating", rating);
    }
  }, [rating]);

  // Update hover state when initialRating prop changes
  useEffect(() => {
    if (initialRating > 0) {
      setRating(initialRating);
      setHover(initialRating);
      localStorage.setItem("rating", initialRating);
    }
  }, [initialRating]);

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
