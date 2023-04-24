import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "../../styles/Login.css";
import { BASE_URL } from "../../constants"

export default function SignUp(props) {
  let navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    firstname: "",
    lastname: "",
    address: "",
    user_type: "",
    // favorites: ""
  });
  const [redirect, setRedirect] = useState(false);

  const google_logo =
    "https://p1.hiclipart.com/preview/209/923/667/google-logo-background-g-suite-google-pay-google-doodle-text-circle-line-area-png-clipart.jpg";

  console.log(userData);

  // function updateUserData(loginData) {
  // 	props.updateUserData(loginData) //sending it up to App.js
  // }

  const handleChange = (event) => {
    setUserData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/users/register`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        if (res.status == 400) {
          throw res.message;
        }
        const resObject = await res.json();
        console.log("res.json() = ", resObject);
        alert("Account created");
        navigate("/login");

      // var data = JSON.stringify(userData);

      // var config = {
      //   method: "post",
      //   url:
      //     "https://us-east-1.aws.data.mongodb-api.com/app/data-wiwke/endpoint/data/v1/action/insertOne",
      //   withCredentials: false,
      //   headers: {
      //     "Content-Type": "application/json",
      //     "api-key":
      //       "RMe3BFadvAm91puSpQREVs10YAAeNyMONplZNisIqRcZi6pB51rmpm8ehFPnK2Fl",
      //   },
      //   data: data,
      // };

      // axios(config)
      //   .then(function(response) {
      //     console.log(JSON.stringify(response.data));
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });
    } catch (err) {
      console.log("SignUp register error = ", err);
      if (err.status == 400) {
        alert(err.message);
      }
    }
    setRedirect(true);
    // updateUserData(loginData)
  };

  return (
    <div>
      <Navbar />
      <div className="login-box">
        {/* <img src={logo} className="logo"/> */}

        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="login-title">DROP-IN</h1>

          <h1 className="login-msg">Create an account</h1>
          <label>
            <input
              className="login-input"
              placeholder="Email"
              type="text"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            <input
              className="login-input"
              placeholder="Username"
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />
          </label>
          <label>
            <input
              className="login-input"
              placeholder="Password"
              type="text"
              name="password"
              value={userData.password}
              onChange={handleChange}
            />
          </label>
          <label>
            <input
              className="login-input"
              placeholder="First Name"
              type="text"
              name="firstname"
              value={userData.firstname}
              onChange={handleChange}
            />
          </label>
          <label>
            <input
              className="login-input"
              placeholder="Last Name"
              type="text"
              name="lastname"
              value={userData.lastname}
              onChange={handleChange}
            />
          </label>
          <label>
            <input
              className="login-input"
              placeholder="Address"
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
            />
          </label>

          <h3>I am a</h3>
          <div className="login-input-radios">
            <label className="login-input-radio-tenant">
              Tenant
              <input
                type="radio"
                name="user_type"
                value="tenant"
                onChange={handleChange}
              />
            </label>
            <label className="login-input-radio-landlord">
              Landlord
              <input
                type="radio"
                name="user_type"
                value="landlord"
                onChange={handleChange}
              />
            </label>
          </div>
          <input
            type="submit"
            value="Sign Up"
            className="login-btns login-submit-btn"
          />

          {/* <p className="login-OR"> or</p>
					<button className="login-btns login-google-btn">
						<img src={google_logo} className="google-logo" />
						<p className="google-text">Continue with Google</p>
					</button> */}

          <p className="sign-up-msg">
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <hr className="login-footer-line" />
          <p className="login-footer-msg">
            By continuing in you agree to Drop-In's Terms of Service and Privacy
            Policy
          </p>
        </form>
      </div>
    </div>
  );
}
