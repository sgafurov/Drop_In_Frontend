import React, { useEffect, useState } from "react";
import image1 from "../images/row-buildings.jpg";
import buildings from "../images/row-buildings-modified.png";
import person from "../images/person-computer.png";

import "../styles/Landing.css";

export default function Landing() {
  return (
    <div className="landing-page">
      <div className="content-card">
        <div>
          <h1>Find your next apartment</h1>
          <h1>on Drop In</h1>
          <p>
            Search for hundreds of apartment buildings all across the country.
          </p>
          <p>Add your review to help fellow renters find an apartment.</p>
        </div>
        <div>
          <img src={buildings} width={300} height={300} />
        </div>
      </div>

      <div className="content-card">
        <div>
          <img src={person} width={300} height={300} />
        </div>
        <div>
          <h1>Rate your landlord.</h1>
          <h1>(anonymously)</h1>
          <p>Read and anonymously share your rental experiences.</p>
          <p>
            Write about the pet policy, bed bug issues, and building management.
          </p>
        </div>
      </div>
    </div>
  );
}
