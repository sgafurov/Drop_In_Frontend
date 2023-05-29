import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constants";
import { useDispatch } from "react-redux";
import { setUserInfo, setIsLoggedIn } from "../../store/userSlice";
import Loading from "../Loading";
import "../../styles/Login.css";

export default function Login() {
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const google_logo =
    "https://p1.hiclipart.com/preview/209/923/667/google-logo-background-g-suite-google-pay-google-doodle-text-circle-line-area-png-clipart.jpg";

  const handleChange = (event) => {
    setLoginData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData), // login data is currently a JS object. so you have to send it as JSON object
      });
      console.log("line 45 of Login.js", res);
      if (res.status == 400 || res.status == 500) {
        setIsLoading(false);
        throw res;
      }
      const resObject = await res.json();
      setIsLoading(false);
      dispatch(setIsLoggedIn(true));
      dispatch(
        setUserInfo({
          _id: resObject._id,
          username: resObject.username,
          email: resObject.email,
          firstname: resObject.firstname,
          lastname: resObject.lastname,
          address: resObject.address,
          user_type: resObject.user_type,
        })
      );
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          isLoggedIn: true,
          username: resObject.username,
          _id: resObject._id,
        })
      );
      localStorage.setItem("token", resObject.token);
      navigate("/user-dashboard");
    } catch (err) {
      console.log("line 68 of Login.js error", err);
      if (err.status == 400) {
        const error = await err.json()
        alert(error.message);
      } else {
        alert("Something went wrong")
      }
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else {
    return (
      <div>
        <div className="login-box">
          <form onSubmit={handleSubmit} className="login-form">
            <h1 className="login-title">DROP-IN</h1>

            <h1 className="login-msg">Login to your account</h1>

            <label>
              <input
                className="login-input"
                placeholder="Username"
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleChange}
              />
            </label>
            <label>
              <input
                className="login-input"
                placeholder="Password"
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
              />
            </label>
            <input
              type="submit"
              value="Login"
              className="login-btns login-submit-btn"
            />

            {/* <p className="login-OR"> or</p>
					<button className="login-btns login-google-btn">
						<img src={google_logo} className="google-logo" />
						<p className="google-text">Continue with Google</p>
					</button> */}

            <p className="sign-up-msg">
              Dont have an account? <Link to="/signup"> Sign Up </Link>
            </p>
            <hr className="login-footer-line" />
            <p className="login-footer-msg">
              By continuing in you agree to Drop-In's Terms of Service, Privacy
              Policy
            </p>
          </form>
        </div>
      </div>
    );
  }
}
