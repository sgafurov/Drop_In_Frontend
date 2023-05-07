import React, { useEffect, useState } from "react";
import "../../styles/Rating.css";

export default function Stars(props) {
  let numStars = props.rating;
  return (
    <div className="star-rating">
      {[...Array(numStars)].map((star, index) => {
        return <span className="star">&#9733;</span>;
      })}
    </div>
  );
}
