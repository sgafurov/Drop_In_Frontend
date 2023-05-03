import React, { useEffect } from "react";
import { useState } from "react";
import UserReviews from "./UserReviews";
import "../../styles/UserDashboard.css";

import { useSelector } from "react-redux";

export default function UserDashboard() {
  const userSlice = useSelector((state) => state.userSlice);

  console.log("user slice, ", userSlice)

  const [clickedMyReviews, setClickedMyReviews] = useState(false);

  // let username = location.state.username
  // let usernameArray = username.split('')
  // username = usernameArray[0].toUpperCase() + username.substring(1).toLowerCase()

  return (
    <div className="user-dashboard">
      {/* <h1>Hi, {usernameLocalStorage}</h1> */}
      <h1>Hi, {userSlice.username}</h1>
      <div className="content-div">
        <button onClick={() => setClickedMyReviews(true)}>My Reviews</button>
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
