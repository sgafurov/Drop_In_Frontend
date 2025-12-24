import React, { useEffect, useState } from "react";
import image1 from "../images/row-buildings.jpg";
import buildings from "../images/row-buildings-modified.png";
import person from "../images/person-computer.png";

import "../styles/Landing.css";

export default function Landing() {
  return (
    <div className="landing-outer-container">
    <div className="landing-page">
        <div className="landing-hero">
          <h1 className="landing-hero-title">Find your next apartment</h1>
          <h1 className="landing-hero-subtitle">on Drop In</h1>
          <p className="landing-hero-description">
            Search for hundreds of apartment buildings all across the country.
            Add your review to help fellow renters find an apartment.
          </p>
        </div>

        <div className="landing-content">
          <div className="landing-card">
            <div className="landing-card-content">
              <div className="landing-card-text">
                <h2 className="landing-card-title">Find Your Perfect Home</h2>
                <p className="landing-card-description">
                  Search for hundreds of apartment buildings all across the country.
                </p>
                <p className="landing-card-description">
                  Add your review to help fellow renters find an apartment.
                </p>
              </div>
              <div className="landing-card-image">
                <img src={buildings} alt="Apartment buildings" />
              </div>
        </div>
      </div>

          <div className="landing-card">
            <div className="landing-card-content reverse">
              <div className="landing-card-image">
                <img src={person} alt="Person using computer" />
        </div>
              <div className="landing-card-text">
                <h2 className="landing-card-title">Rate Your Landlord</h2>
                <h3 className="landing-card-subtitle">(anonymously)</h3>
                <p className="landing-card-description">
                  Read and anonymously share your rental experiences.
                </p>
                <p className="landing-card-description">
            Write about the pet policy, bed bug issues, and building management.
          </p>
              </div>
            </div>
        </div>
      </div>
    </div>
    </div>
  );
}
