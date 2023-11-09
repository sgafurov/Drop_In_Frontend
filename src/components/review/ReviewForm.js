//CHILD ELEMENT. MAKES POST REQUES TO BACKEND WITH NEW REVIEW DATA

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Rating from "./Rating";
import { useSelector } from "react-redux";
import "../../styles/ReviewForm.css";
import { BASE_URL } from "../../constants";

import { useDispatch } from "react-redux";
import { setReview } from "../../store/reviewSlice";
import { setIsLoggedIn } from "../../store/userSlice";

export default function ReviewForm() {
  const { isLoggedIn, username, _id } = useSelector((state) => state.userSlice);
  const { address } = useSelector((state) => state.addressSlice);
  let dispatch = useDispatch();

  const unique_id = uuid();

  const [currentReview, setCurrentReview] = useState({
    // _id: _id,
    username: username,
    address: address,
    review_id: unique_id,
    review_body: "",
    rating: 0,
  });

  const handleChange = (event) => {
    let localRating = localStorage.getItem("rating");
    console.log("localRating ", localRating);
    let updatedRating = {
      ...currentReview,
      rating: localRating,
    };
    setCurrentReview(updatedRating);
    setCurrentReview((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSubmit = async (event) => {
    console.log("current review", currentReview);
    event.preventDefault();

    if (currentReview.star_rating == 0) {
      alert("Provide a star rating");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/review/postReview`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(currentReview),
      });

      const resObject = await res.json();
      console.log("line 68 of review form", resObject);

      if (resObject.status == 400) {
        throw resObject;
      }

      if (resObject.status == 403) {
        throw resObject;
      }
      alert("Review added");

      dispatch(
        setReview({
          username: username,
          address: address,
          review_id: currentReview.review_id,
          review_body: currentReview.review_body,
          star_rating: currentReview.rating,
        })
      );
    } catch (err) {
      console.log("error line 89 of review form", err);
      if (err.status == 400 || err.status == 403) {
        alert(err.message);
      }
    }

    //reset form to look empty
    setCurrentReview((prev) => ({
      ...prev,
      username: "",
      address: "",
      review_body: "",
      rating: 0,
    }));

    localStorage.setItem("rating", 0);
    window.location.reload();
  };

  return isLoggedIn ? (
    <>
      <form onSubmit={handleSubmit} className="review-form">
        <Rating />
        <input
          className="review-textbox"
          name="review_body"
          placeholder="Leave a review"
          value={currentReview.review_body}
          onChange={handleChange}
        />
        <button type="submit" className="review-submit-btn">
          SUBMIT
        </button>
      </form>
    </>
  ) : (
    <>
      <form onSubmit={handleSubmit} className="review-form">
        <input
          readOnly
          className="logged-out-review-textbox"
          name="review_body"
          placeholder="Sign in to leave a review"
        />
        <h1 className="login-btn">
          <Link to="/login">LOGIN </Link>
        </h1>
      </form>
    </>
  );
}
