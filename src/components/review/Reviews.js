//PARENT ELEMENT. RENDERS ARRAY OF REVIEWS FROM THE BACKEND AND DISPLAYS THE REVIEW FORM

import React, { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";
import "../../styles/Reviews.css";
import { BASE_URL } from "../../constants";
import Stars from "./Stars";
import Loading from "../Loading";
import { useDispatch, useSelector } from "react-redux";

export default function Reviews({ address }) {
  // const [address, setAddress] = useState(localStorage.getItem("address"));
  const [isLoading, setIsLoading] = useState(false); // add a state variable to keep track of loading

  const addressSlice = useSelector((state) => state.addressSlice); // state refers to store.js

  useEffect(() => {
    if (address) {
      console.log("props.address", address);
      getReviewsFromBackend();
    }
  }, [address]);

  //array of objects to store all of our reviews
  const [userReviews, setUserReviews] = useState([
    {
      rating: "",
      body: "",
      author: "",
      timestamp: "",
    },
  ]);

  const [newestReviewBtn, setNewestReviewBtn] = useState(false);

  const sortReviewByNewest = []
    .concat(userReviews)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  const handleSortByNewest = (event) => {
    event.preventDefault();
    setNewestReviewBtn(true);
  };

  const getReviewsFromBackend = async (addy) => {
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/review/getReviews`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address,
        }),
      });
      const resObject = await res.json();
      setIsLoading(false);
      console.log("line 61 of rendering reviews", resObject);
      if (resObject.status == 400) {
        throw resObject;
      }

       // Clear userReviews before adding the new reviews (so we dont append to reviews fetched from previous address)
      setUserReviews([]);

       // Add the new reviews received from the backend to the userReviews state
       setUserReviews(resObject.map((review) => ({
        rating: review.rating,
        body: review.review_body,
        author: review.username,
        timestamp: review.timestamp,
      })));
      
    } catch (err) {
      console.log("error : line 68 of rendering reviews", err);
      if (err.status == 400) {
        alert(err.message);
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
      <>
        <h1 className="reviews-title">What residents have to say ...</h1>

        <div>
          <button onClick={handleSortByNewest}>SORT BY NEWEST</button>
        </div>

        <div className="reviews">
          {newestReviewBtn
            ? sortReviewByNewest.map((item) => {
                return (
                  <>
                    {item.body ? (
                      <div className="review-card">
                        <Stars rating={item.rating} />
                        <div className="review-content">{item.body}</div>
                        <div className="review-author">{item.author}</div>
                      </div>
                    ) : (
                      <p></p>
                    )}
                  </>
                );
              })
            : //If user sorts by new, then render the reviews by newest AKA sort by shortest timestamp. Else, show the reviews normally as they are added.
              userReviews.map((item) => {
                return (
                  <>
                    {item.body ? (
                      <div className="review-card">
                        <Stars rating={item.rating} />
                        <div className="review-content">{item.body}</div>
                        <div className="review-author">{item.author}</div>
                      </div>
                    ) : (
                      <p></p>
                    )}
                  </>
                );
              })}

          <ReviewForm />
        </div>
      </>
    );
  }
}
