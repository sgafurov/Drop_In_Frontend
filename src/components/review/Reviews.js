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
    .sort((a, b) => {
      const timestampA = a.updatedAt || a.createdAt;
      const timestampB = b.updatedAt || b.createdAt;
      return timestampA < timestampB ? 1 : -1;
    });

  // Normalize address by removing ", USA" suffix for consistent matching
  const normalizeAddress = (addr) => {
    if (!addr) return addr;
    const trimmed = addr.trim();
    // Remove ", USA" or ", USA." from the end (case insensitive)
    return trimmed.replace(/,\s*USA\.?$/i, "").trim();
  };

  async function getReviewsFromBackend() {
    setIsLoading(true);

    // Normalize address before searching to match stored addresses
    const normalizedAddress = normalizeAddress(address);

    try {
      const res = await fetch(`${BASE_URL}/review/getReviews`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: normalizedAddress,
        }),
      });

      const resObject = await res.json();

      console.log("=== REVIEW FETCH DEBUG ===");
      console.log("Original address:", address);
      console.log("Normalized address sent:", normalizedAddress);
      console.log("Backend response:", resObject);
      console.log("Response length:", Array.isArray(resObject) ? resObject.length : "Not an array");
      if (Array.isArray(resObject) && resObject.length > 0) {
        console.log("First review address from backend:", resObject[0].address);
      }
      console.log("=========================");

      setIsLoading(false);

      if (resObject.status == 400) {
        throw resObject;
      }

      // Check if response is an array
      if (!Array.isArray(resObject)) {
        console.error("Backend response is not an array:", resObject);
        setUserReviews([]);
        return;
      }

      // Helper function to extract date from MongoDB extended JSON format or regular format
      const extractDate = (dateValue) => {
        if (!dateValue) return null;
        // Handle MongoDB extended JSON format: {$date: "ISO_STRING"}
        if (typeof dateValue === 'object' && dateValue.$date) {
          return dateValue.$date;
        }
        // Handle regular ISO string or Date object
        return dateValue;
      };

      const mappedReviews = resObject.map((review) => {
        const createdAt = extractDate(review.createdAt);
        const updatedAt = extractDate(review.updatedAt);
        
        console.log("Review mapped:", {
          address: review.address,
          createdAt,
          updatedAt,
          body: review.review_body
        });
        
        return {
          rating: review.rating,
          body: review.review_body,
          author: review.username,
          createdAt: createdAt,
          updatedAt: updatedAt,
        };
      });

      console.log("Mapped reviews:", mappedReviews);
      setUserReviews(mappedReviews);
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
      const timestamp = item.updatedAt || item.createdAt;
      const formattedDate = formatTimestamp(timestamp);
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
