//PARENT ELEMENT. RENDERS ARRAY OF REVIEWS FROM THE BACKEND AND DISPLAYS THE REVIEW FORM

import React, { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";
import "../../styles/Reviews.css";
import { BASE_URL } from "../../constants";
import Stars from "./Stars";
import Loading from "../Loading";

export default function Reviews() {
  const [address, setAddress] = useState(localStorage.getItem("address"));

  const [isLoading, setIsLoading] = useState(false); // add a state variable to keep track of loading

  let localUsername = localStorage.getItem("username");

  useEffect(() => {
    getReviewsFromBackend();
  }, []);

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

  const getReviewsFromBackend = async () => {
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
      setIsLoading(true);
      const resObject = await res.json();
      setIsLoading(false);
      console.log("line 50 of rendering reviews", resObject);
      if (resObject.status == 400) {
        throw resObject;
      }
      //set the reviews to be the response of array of addresses received from the backend
      for (let i = 0; i < resObject.length; i++) {
        setUserReviews((prev) => [
          ...prev,
          {
            rating: resObject[i].rating,
            body: resObject[i].review_body,
            author: resObject[i].username,
            timestamp: resObject[i].timestamp,
          },
        ]);
      }
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
        <div>
          <button onClick={handleSortByNewest}>SORT BY NEWEST</button>
        </div>

        <h1 className="reviews-title">What residents have to say ...</h1>

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
