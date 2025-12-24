import React, { useEffect } from "react";
import { useState } from "react";
import UserReviews from "./UserReviews";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/UserDashboard.css";

export default function UserDashboard() {
  let navigate = useNavigate();

  const userSlice = useSelector((state) => state.userSlice);

  console.log("user slice, ", userSlice);

  const [clickedMyReviews, setClickedMyReviews] = useState(false);

  useEffect(() => {
    if (!userSlice.isLoggedIn) {
      navigate("/");
    }
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome back, {userSlice.username}!</h1>
          <p className="welcome-subtitle">Here's your account overview</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="account-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">👤</span>
              Account Details
            </h2>
          </div>
          <div className="card-body">
            <div className="info-row">
              <span className="info-label">First Name</span>
              <span className="info-value">{userSlice.firstname}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Last Name</span>
              <span className="info-value">{userSlice.lastname}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Username</span>
              <span className="info-value">{userSlice.username}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Address</span>
              <span className="info-value">{userSlice.address || "Not provided"}</span>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="card-icon">⭐</span>
              My Reviews
            </h2>
          </div>
          <div className="reviews-content">
            <UserReviews />
          </div>
        </div>
      </div>
    </div>
  );
}
