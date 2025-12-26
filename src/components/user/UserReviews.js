import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRating, clearRating } from "../../store/reviewSlice";
import { BASE_URL } from "../../constants";
import Stars from "../review/Stars";
import Rating from "../review/Rating";
import "../../styles/UserReviews.css";

export default function UserReviews() {
  const dispatch = useDispatch();
  const rating = useSelector((state) => state.reviewSlice.rating);
  const [username, setUsername] = useState("");
  const [_id, set_id] = useState("");
  const [newestReviewBtn, setNewestReviewBtn] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    body: "",
    rating: 0
  });
  
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
      // Check for timestamp - prioritize updated timestamp over created timestamp
      // MongoDB schema has explicit createdAt and updatedAt fields
      // Backend returns these as Date objects or ISO strings
      const formattedReviews = resObject.map((review) => {
        // Extract timestamps - backend schema explicitly defines these fields
        const createdAt = review.createdAt || null;
        const updatedAt = review.updatedAt || null;
        
        // Convert to strings if they're Date objects, or use as-is if strings
        const createdAtStr = createdAt ? (createdAt instanceof Date ? createdAt.toISOString() : String(createdAt)) : null;
        const updatedAtStr = updatedAt ? (updatedAt instanceof Date ? updatedAt.toISOString() : String(updatedAt)) : null;
        
        // Prioritize updatedAt if it exists and is different from createdAt (review was modified)
        // Otherwise use createdAt (review hasn't been modified)
        const timestamp = (updatedAtStr && updatedAtStr !== createdAtStr) ? updatedAtStr : createdAtStr || "";
        
        // Log which timestamp is being used for debugging
        if (updatedAtStr && updatedAtStr !== createdAtStr) {
          console.log(`Review ${review.review_id || review._id}: Using updatedAt (${updatedAtStr}) - review was modified`);
        } else if (createdAtStr) {
          console.log(`Review ${review.review_id || review._id}: Using createdAt (${createdAtStr}) - review not modified yet`);
        }
        
        if (!timestamp && review) {
          console.warn("No timestamp found in review:", review);
        }
        
        return {
          body: review.review_body || review.body || "",
          author: review.username || review.author || "",
          timestamp: timestamp, // Display timestamp (prioritizes updatedAt)
          createdAt: createdAtStr, // Store original creation time as string
          updatedAt: updatedAtStr, // Store last update time as string
          address: review.address || "",
          rating: review.rating || "",
          _id: review._id || review.id || "",
          review_id: review.review_id || review._id || review.id || "",
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

  const handleEditClick = (review) => {
    // Use review_id as the identifier for editing
    const reviewId = review.review_id || review._id;
    setEditingReviewId(reviewId);
    const reviewRating = review.rating || 0;
    setEditFormData({
      body: review.body,
      rating: reviewRating
    });
    dispatch(setRating(reviewRating));
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditFormData({
      body: "",
      rating: 0
    });
    dispatch(clearRating());
  };

  const handleEditChange = (event) => {
    setEditFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
      rating: rating !== null ? parseInt(rating) : prevData.rating
    }));
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      const currentRating = rating !== null ? parseInt(rating) : editFormData.rating;

      if (!currentRating || currentRating === 0) {
        alert("Please provide a star rating");
        return;
      }

      if (!editFormData.body.trim()) {
        alert("Review body cannot be empty");
        return;
      }

      // Find the review to get the review_id
      const reviewToUpdate = userReviews.find(r => r._id === reviewId || r.review_id === reviewId);
      
      // Backend expects review_id, not _id
      const actualReviewId = reviewToUpdate ? (reviewToUpdate.review_id || reviewToUpdate._id) : reviewId;
      
      if (!actualReviewId) {
        alert("Error: Review ID not found. Please try again.");
        return;
      }
      
      const updatePayload = {
        review_id: actualReviewId,
        review_body: editFormData.body,
        rating: currentRating,
      };

      console.log("Updating review with payload:", updatePayload);

      const res = await fetch(`${BASE_URL}/review/updateReview`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatePayload),
      });

      const resObject = await res.json();
      console.log("Update review response:", resObject);
      console.log("Updated review has updatedAt:", resObject.updatedAt);
      console.log("Updated review has createdAt:", resObject.createdAt);

      if (res.status === 400 || res.status === 403 || res.status === 404) {
        throw resObject;
      }

      if (resObject.status == 400 || resObject.status == 403 || resObject.status == 404) {
        throw resObject;
      }

      alert("Review updated successfully");
      
      // Refresh reviews to get the latest data with updatedAt
      await getReviewsFromBackend();
      
      // Reset edit state
      setEditingReviewId(null);
      setEditFormData({
        body: "",
        rating: 0
      });
      dispatch(clearRating());
    } catch (err) {
      console.log("Error updating review:", err);
      const errorMessage = err.message || err.error || "Failed to update review. Please try again.";
      alert(errorMessage);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm("Are you sure you want to delete this review? This action cannot be undone.");
    
    if (!confirmed) {
      return;
    }

    try {
      const reviewToDelete = userReviews.find(r => r._id === reviewId || r.review_id === reviewId);
      const actualReviewId = reviewToDelete ? (reviewToDelete.review_id || reviewToDelete._id) : reviewId;
      
      if (!actualReviewId) {
        alert("Error: Review ID not found. Please try again.");
        return;
      }

      const res = await fetch(`${BASE_URL}/review/deleteReview`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          review_id: actualReviewId,
        }),
      });

      let resObject;
      try {
        const text = await res.text();
        resObject = text ? JSON.parse(text) : {};
      } catch (parseError) {
        // Handle non-JSON responses (e.g., HTML error pages)
        if (res.status === 404) {
          throw { message: "Review not found", status: 404 };
        }
        throw { message: "Server error occurred", status: res.status || 500 };
      }

      if (res.status === 400 || res.status === 403 || res.status === 404) {
        throw resObject;
      }

      if (resObject.status == 400 || resObject.status == 403 || resObject.status == 404) {
        throw resObject;
      }

      alert("Review deleted successfully");
      
      await getReviewsFromBackend();
      
      if (editingReviewId === actualReviewId || editingReviewId === reviewId) {
        setEditingReviewId(null);
        setEditFormData({
          body: "",
          rating: 0
        });
        dispatch(clearRating());
      }
    } catch (err) {
      console.log("Error deleting review:", err);
      const errorMessage = err.message || err.error || "Failed to delete review. Please try again.";
      alert(errorMessage);
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
            const itemId = item.review_id || item._id;
            const isEditing = editingReviewId === itemId;
            
            return (
              <div className="user-review-card" key={item._id || index}>
                <div className="review-header">
                  <div className="review-address">
                    <span className="address-icon">📍</span>
                    {item.address}
                  </div>
                  <div className="review-header-right">
                    {!isEditing && (
                      <>
                        <div className="review-header-right-top">
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
                        <div className="review-actions">
                          <button
                            className="edit-review-btn"
                            onClick={() => handleEditClick(item)}
                            title="Edit review"
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-review-btn"
                            onClick={() => handleDeleteReview(item.review_id || item._id)}
                            title="Delete review"
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {isEditing ? (
                  <div className="edit-review-form">
                    <div className="edit-rating-section">
                      <label>Rating:</label>
                      <Rating initialRating={editFormData.rating} />
                    </div>
                    <textarea
                      className="edit-review-textarea"
                      name="body"
                      value={editFormData.body}
                      onChange={handleEditChange}
                      placeholder="Edit your review..."
                      rows="4"
                    />
                    <div className="edit-review-actions">
                      <button
                        className="save-review-btn"
                        onClick={() => handleUpdateReview(item.review_id || item._id)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-review-btn"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="review-body">{item.body}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
