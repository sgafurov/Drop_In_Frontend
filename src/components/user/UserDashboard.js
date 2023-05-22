import React, { useEffect } from "react";
import { useState } from "react";
import UserReviews from "./UserReviews";
import "../../styles/UserDashboard.css";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../constants";
import { useDispatch } from "react-redux";
import { setUserInfo, setIsLoggedIn } from "../../store/userSlice";

export default function UserDashboard() {
  let dispatch = useDispatch()

  const userSlice = useSelector((state) => state.userSlice);

  console.log("user slice, ", userSlice);

  const [clickedMyReviews, setClickedMyReviews] = useState(false);

  // let username = location.state.username
  // let usernameArray = username.split('')
  // username = usernameArray[0].toUpperCase() + username.substring(1).toLowerCase()

  // useEffect(async () => {
  //   // when user refreshes the page, this will add data to our redux states again

  //   // NEWWW
  //   const userFromStorage = localStorage.getItem("username");
  //   console.log("userFromStorage", userFromStorage);
  //   try {
  //     const res = await fetch(`${BASE_URL}/user/userInfo`, {
  //       method: "POST",
  //       mode: "cors",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: "shaka", // json.strinify or no????
  //     });
  //     const resObject = await res.json();
  //     console.log("line 35 of userdashboard.js getting userInfo", resObject);
  //     if (resObject.status == 400) {
  //       throw resObject;
  //     }
  //     dispatch(setIsLoggedIn(true));
  //     dispatch(
  //       setUserInfo({
  //         username: resObject.username,
  //         password: resObject.password,
  //         email: resObject.email,
  //         firstname: resObject.firstname,
  //         lastname: resObject.lastname,
  //         address: resObject.address,
  //         user_type: resObject.user_type,
  //       })
  //     );
  //   } catch (err) {
  //     console.log("line 52 of userdashboard.js getting userInfo error", err);
  //     if (err.status == 400) {
  //       alert(err.message);
  //     }
  //   }
  // }, []);

  return (
    <div className="user-dashboard">
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
