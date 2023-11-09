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

      console.log("line 48 of rendering user reviews", resObject);

      if (resObject.status == 400) {
        throw resObject;
      }

      //set the reviews to be the response of array of addresses received from the backend
      for (let i = 0; i < resObject.length; i++) {
        setUserReviews((prev) => [
          ...prev,
          {
            body: resObject[i].review_body,
            author: resObject[i].username,
            timestamp: resObject[i].timestamp,
            address: resObject[i].address,
            rating: resObject[i].rating,
            // _id: resObject[i]._id,
          },
        ]);
      }
      console.log("userReviews ", userReviews);
    } catch (err) {
      console.log("error : line 66 of rendering user reviews", err);
      if (err.status == 400) {
        alert(err.message);
      }
    }
  };

  return (
    <>
      <div>
        <button onClick={handleSortByNewest}>SORT BY NEWEST</button>
      </div>

      <div className="user-reviews">
        {newestReviewBtn
          ? sortReviewByNewest.map((item) => {
              return (
                <>
                  {item.body ? (
                    <div className="user-review-card" key={item._id}>
                      <div className="user-review-content">
                        ({item.address})
                      </div>
                      <div className="user-review-content">{item.body}</div>
                      <Stars rating={item.rating} />
                    </div>
                  ) : (
                    <p key={item._id}></p>
                  )}
                </>
              );
            })
          : //If user sorts by new, then render the reviews by newest AKA sort by shortest timestamp. Else, show the reviews normally as they are added.
            userReviews.map((item) => {
              return (
                <>
                  {item.body ? (
                    <div className="user-review-card" key={item._id}>
                      <div className="user-review-content">
                        ({item.address})
                      </div>
                      <div className="user-review-content">{item.body}</div>
                      <Stars rating={item.rating} />
                    </div>
                  ) : (
                    <p key={item._id}></p>
                  )}
                </>
              );
            })}
      </div>
    </>
  );
}
