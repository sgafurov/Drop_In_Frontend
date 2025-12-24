import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../constants";
import Stars from "../review/Stars";
import "../../styles/UserReviews.css";

export default function UserReviews() {
  const [username, setUsername] = useState("");
  const [_id, set_id] = useState("");
  const [newestReviewBtn, setNewestReviewBtn] = useState(false);
  
  //array of objects to store all of our reviews
  const [userReviews, setUserReviews] = useState([
    {
      body: "",
      author: "",
      timestamp: "",
      address: "",
      _id: "",
      rating: ""
    },
  ]);

  useEffect(() => {
    const userFromStorage = localStorage.getItem("userInfo");
    if (userFromStorage) {
      setUsername(JSON.parse(userFromStorage).username);
      set_id(JSON.parse(userFromStorage)._id);
    }
  }, []);

  useEffect(() => {
    if (username) {
      getReviewsFromBackend();
    }
  }, [username]);

  const sortReviewByNewest = []
    .concat(userReviews)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  const handleSortByNewest = (event) => {
    event.preventDefault();
    setNewestReviewBtn(true);
  };

  const getReviewsFromBackend = async () => {
    try {
      const res = await fetch(`${BASE_URL}/review/getUserReviews`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      });

      const resObject = await res.json();

      console.log("Backend response for getUserReviews:", resObject);
      if (resObject.length > 0) {
        console.log("Sample review object from backend:", resObject[0]);
        console.log("Available fields in review:", Object.keys(resObject[0]));
      }

      if (resObject.status == 400) {
        throw resObject;
      }

      //set the reviews to be the response of array of addresses received from the backend
      // Check for timestamp in various possible field names
      const formattedReviews = resObject.map((review) => {
        const timestamp = review.timestamp || 
                         review.createdAt || 
                         review.created_at || 
                         review.date || 
                         review.created || 
                         review.time || "";
        
        if (!timestamp && review) {
          console.warn("No timestamp found in review:", review);
        }
        
        return {
          body: review.review_body || review.body || "",
          author: review.username || review.author || "",
          timestamp: timestamp,
          address: review.address || "",
          rating: review.rating || "",
          _id: review._id || review.id || "",
        };
      });

      setUserReviews(formattedReviews);
      console.log("Formatted reviews with timestamps:", formattedReviews);
    } catch (err) {
      console.log("error : line 66 of rendering user reviews", err);
      if (err.status == 400) {
        alert(err.message);
      }
    }
  };

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

  const reviewsToDisplay = newestReviewBtn ? sortReviewByNewest : userReviews;
  const filteredReviews = reviewsToDisplay.filter(item => item.body && item.body.trim() !== '');

  return (
    <div className="user-reviews-container">
      {filteredReviews.length > 0 && (
        <div className="sort-controls">
          <button 
            className={`sort-button ${newestReviewBtn ? 'active' : ''}`}
            onClick={handleSortByNewest}
          >
            {newestReviewBtn ? '✓ Sorted by Newest' : 'Sort by Newest'}
          </button>
        </div>
      )}

      {filteredReviews.length === 0 ? (
        <div className="no-reviews">
          <p className="no-reviews-icon">📝</p>
          <p className="no-reviews-text">You haven't written any reviews yet.</p>
          <p className="no-reviews-subtext">Start reviewing apartments to see them here!</p>
        </div>
      ) : (
        <div className="user-reviews-list">
          {filteredReviews.map((item, index) => {
            const formattedDate = formatTimestamp(item.timestamp);
            return (
              <div className="user-review-card" key={item._id || index}>
                <div className="review-header">
                  <div className="review-address">
                    <span className="address-icon">📍</span>
                    {item.address}
                  </div>
                  <div className="review-header-right">
                    {formattedDate && (
                      <div className="review-timestamp">
                        <span className="timestamp-icon">🕒</span>
                        {formattedDate}
                      </div>
                    )}
                    <div className="review-rating">
                      <Stars rating={item.rating} />
                    </div>
                  </div>
                </div>
                <div className="review-body">{item.body}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
