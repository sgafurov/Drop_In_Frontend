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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return null;
      
      const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      return `${dateStr} at ${timeStr}`;
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return null;
    }
  };

  function renderReviews(reviews) {
    return reviews.map((item, index) => {
      const formattedDate = formatTimestamp(item.createdAt);
      return (
        <div key={item.createdAt || index} className="review-card">
        {item.body && (
          <>
              <div className="review-header-reviews">
                <div className="review-rating-reviews">
            <Stars rating={item.rating} />
                </div>
                {formattedDate && (
                  <div className="review-timestamp-reviews">
                    <span className="timestamp-icon">🕒</span>
                    {formattedDate}
                  </div>
                )}
              </div>
            <div className="review-content">{item.body}</div>
            <div className="review-author">{item.author}</div>
          </>
        )}
      </div>
      );
    });
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
                className="sort-btn"
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
