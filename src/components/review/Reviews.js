import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../constants";
import ReviewForm from "./ReviewForm";
import Stars from "./Stars";
import Loading from "../Loading";
import "../../styles/Reviews.css";

export default function Reviews({ address }) {
  const [isLoading, setIsLoading] = useState(false);
  const [sortByNewest, setSortByNewest] = useState(false);
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    setSortByNewest(false);
    if (address) {
      console.log("props.address", address);
      getReviewsFromBackend();
    }
  }, [address]);

  const sortReviewByNewest = []
    .concat(userReviews)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  async function getReviewsFromBackend() {
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

      console.log("resObject", resObject);

      setIsLoading(false);

      if (resObject.status == 400) {
        throw resObject;
      }

      setUserReviews(
        resObject.map((review) => ({
          rating: review.rating,
          body: review.review_body,
          author: review.username,
          createdAt: review.createdAt,
        }))
      );
    } catch (err) {
      if (err.status == 400) {
        alert(err.message);
      }
    }
  }

  function renderReviews(reviews) {
    return reviews.map((item) => (
      <div key={item.timestamp} className="review-card">
        {item.body && (
          <>
            <Stars rating={item.rating} />
            <div className="review-content">{item.body}</div>
            <div className="review-author">{item.author}</div>
          </>
        )}
      </div>
    ));
  }

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <h1 className="reviews-title">What residents have to say ...</h1>

          {userReviews.length > 0 && (
            <div>
              <button
                onClick={() => {
                  setSortByNewest(true);
                }}
              >
                SORT BY NEWEST
              </button>
            </div>
          )}

          <div className="reviews">
            {sortByNewest
              ? renderReviews(sortReviewByNewest)
              : renderReviews(userReviews)}
            <ReviewForm />
          </div>
        </>
      )}
    </div>
  );
}
