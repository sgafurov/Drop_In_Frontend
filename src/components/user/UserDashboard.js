import React, { useEffect } from "react";
import { useState } from "react";
import UserReviews from "./UserReviews";
import "../../styles/UserDashboard.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  let navigate = useNavigate()

  const userSlice = useSelector((state) => state.userSlice);

  console.log("user slice, ", userSlice);

  const [clickedMyReviews, setClickedMyReviews] = useState(false);

  useEffect(()=>{
    if (!userSlice.isLoggedIn) {
      navigate("/")
    }
  })

  return (
    <div className="user-dashboard">
      <h1>Hi, {userSlice.username}</h1>
      <div className="content-div">
        <button onClick={() => setClickedMyReviews(!clickedMyReviews)}>{clickedMyReviews ? "Hide reviews" : "Show my reviews"}</button>
      </div>

      {clickedMyReviews ? <UserReviews /> : <></>}

      <div>
        <h3>My account details</h3>
        <p>Firstname {userSlice.firstname}</p>
        <p>Lastname {userSlice.lastname}</p>
        <p>Username {userSlice.username}</p>
        <p>Address {userSlice.address}</p>
      </div>
    </div>
  );
}
