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
    <>
      <div className="user-dashboard">
        <h1>Hi, {userSlice.username}</h1>

        <div>
          <h3>My account details</h3>
          <p>Firstname {userSlice.firstname}</p>
          <p>Lastname {userSlice.lastname}</p>
          <p>Username {userSlice.username}</p>
          <p>Address {userSlice.address}</p>
        </div>
      </div>

      <div className="user-reviews">
        <h3>My Reviews</h3>
        <div>
          <UserReviews />
        </div>
      </div>
    </>
  );
}
