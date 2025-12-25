import React from "react";
import "../../styles/Rating.css";

export default function Stars(props) {
  let numStars = props.rating || 0;
  const roundedRating = Math.round(numStars * 2) / 2; // Round to nearest 0.5
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((star, index) => {
        return <span key={`full-${index}`} className="star filled-star">&#9733;</span>;
      })}
      {hasHalfStar && (
        <span className="star half-star" title={`${roundedRating} stars`}>&#9733;</span>
      )}
      {[...Array(emptyStars)].map((star, index) => {
        return <span key={`empty-${index}`} className="star empty-star">&#9734;</span>;
      })}
    </div>
  );
}
