import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../styles/SignUp.css";
import { BASE_URL } from "../../constants";
import SearchBar from "./SearchBar.js";

import { useDispatch } from "react-redux";
import { setUserInfo } from "../../store/userSlice";
import { useSelector } from "react-redux";

export default function SignUp() {
  const userSlice = useSelector((state) => state.userSlice);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstname: "",
    lastname: "",
    address: "",
    user_type: "",
  });

  const google_logo =
    "https://p1.hiclipart.com/preview/209/923/667/google-logo-background-g-suite-google-pay-google-doodle-text-circle-line-area-png-clipart.jpg";

  console.log(formData);

  const handleChange = (event) => {
    let updatedFormData = {
      ...formData,
      address: userSlice.address,
    };
    setFormData(updatedFormData);
    setFormData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.status == 400) {
        throw res.message;
      }
      const resObject = await res.json();
      console.log("res.json() = ", resObject);
      alert("Account created");
      dispatch(
        setUserInfo({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          firstname: formData.firstname,
          lastname: formData.lastname,
          address: userSlice.address, //getting updated with a redux state
          user_type: formData.user_type,
        })
      );
      navigate("/login");
    } catch (err) {
      console.log("SignUp error = ", err);
      alert(err);
      if (err.status == 400) {
        alert(err.message);
      }
    }
  };

  return (
    <div>
      <div className="signup-box">
        {/* <img src={logo} className="logo"/> */}

        <form onSubmit={handleSubmit} className="signup-form">
          <h1 className="signup-title">DROP-IN</h1>

          <h1 className="signup-msg">Create an account</h1>

          <label>
            <input
              className="signup-input"
              placeholder="Email"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            <input
              className="signup-input"
              placeholder="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </label>
          <label>
            <input
              className="signup-input"
              placeholder="Create a Password"
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <label>
            <input
              className="signup-input"
              placeholder="First Name"
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
            />
          </label>
          <label>
            <input
              className="signup-input"
              placeholder="Last Name"
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
          </label>
          <label>
            {/* <input
              className="login-input"
              placeholder="Address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            /> */}
            <SearchBar />
          </label>

          <h3>I am a</h3>
          <div className="signup-input-radios">
            <label className="signup-input-radio-tenant">
              Tenant
              <input
                type="radio"
                name="user_type"
                value="tenant"
                onChange={handleChange}
              />
            </label>
            <label className="signup-input-radio-landlord">
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

          <p className="signup-msg">
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <hr className="signup-footer-line" />
          <p className="signup-footer-msg">
            By continuing in you agree to Drop-In's Terms of Service and Privacy
            Policy
          </p>
        </form>
      </div>
    </div>
  );
}
