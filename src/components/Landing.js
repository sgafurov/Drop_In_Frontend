import React, { useEffect, useState } from "react";
import image1 from "../images/row-buildings.jpg";
import "../styles/Landing.css";

export default function Landing() {
  return (
    <div className="landing-page">
      <div className="row">
        <div>
          <h1>Find your next apartment</h1>
          <h1>on Drop In</h1>
          <p>Search for hundreds of apartment buildings all across the country.</p>
          <p>Add your review to help fellow renters find an apartment.</p>
        </div>
        <div>
          <img src={image1} width={300} height={300} />
        </div>
      </div>
    </div>
  );
}
