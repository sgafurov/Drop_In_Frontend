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

export default function ReviewForm(props) {
  let dispatch = useDispatch();
  if (localStorage.getItem("isLoggedIn") == true) {
    dispatch(setIsLoggedIn(true));
  }
  let isLoggedIn = false
  if (localStorage.getItem("isLoggedIn") == "true") {
    isLoggedIn = true
  }

  const userSlice = useSelector((state) => state.userSlice);

  const unique_id = uuid();
  const address = localStorage.getItem("address");

  const [currentReview, setCurrentReview] = useState({
    review_id: unique_id,
    address: address,
    comment_body: "",
    star_rating: 0,
    timestamp: Math.floor(Date.now() / 1000),
  });

  const handleChange = (event) => {
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

    // setCurrentReview(prev => ({
    //     ...prev,
    //     //username, comment_body are being set in the form via on change function
    //     //star_rating is being set through the Rating.js component
    //     review_id: unique_id,
    //     building_id: placeID,
    //     timestamp: (Math.floor(Date.now() / 1000))
    // }))

    if (currentReview.star_rating == 0) {
      alert("Provide a star rating");
      return;
    }

    //send this review up to its parent component (Reviews.js) so that all of the reviews can be rendered and mapped on the page
    props.setUserReviews((prev) => [
      ...prev,
      {
        body: currentReview.comment_body,
        author: currentReview.username,
        timestamp: currentReview.timestamp,
      },
    ]);

    //reset form to look empty
    setCurrentReview((prev) => ({
      ...prev,
      username: "",
      comment_body: "",
      star_rating: 0,
    }));

    try {
      const res = await fetch(`${BASE_URL}/review/postReview`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentReview),
      });

      const resObject = await res.json();
      console.log("line 77 of review form", resObject);

      if (resObject.status == 400) {
        throw resObject;
      }
      alert("Review added");

      dispatch(
        setReview({
          review_id: currentReview.review_id,
          address: currentReview.address,
          comment_body: currentReview.comment_body,
          star_rating: currentReview.star_rating,
          timestamp: currentReview.timestamp,
        })
      );
    } catch (err) {
      console.log("error : line 85 of review form", err);
      if (err.status == 400) {
        alert(err.message);
      }
    }
  };

  return isLoggedIn ? (
    <>
      <form onSubmit={handleSubmit} className="review-form">
        <input
          className="review-textbox"
          name="comment_body"
          placeholder="Leave a review"
          value={currentReview.comment_body}
          onChange={handleChange}
        />
        {/* <input
          className="author-textbox"
          name="username"
          placeholder="Add your name"
          value={currentReview.username}
          onChange={handleChange}
        /> */}
        <Rating
          currentReview={currentReview}
          setCurrentReview={setCurrentReview}
        />
        <h1>{currentReview.star_rating}</h1>
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
          name="comment_body"
          placeholder="Sign in to leave a review"
        />
        <h1 className="login-btn">
          <Link to="/login">LOGIN </Link>
        </h1>
        <button type="submit" className="review-submit-btn">
          SUBMIT
        </button>
      </form>
    </>
  );
}
