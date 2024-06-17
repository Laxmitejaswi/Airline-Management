import React, { useEffect, useState } from 'react';
import '../Reviews&Ratings.css';

const Reviews = () => {
  const [overallRating, setOverallRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('https://airline-management-2.onrender.com/api/reviews')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (Array.isArray(data) && data.length > 0) {
          const firstItem = data[0]; 
          if (firstItem && firstItem.ratings && firstItem.reviews) {
            setOverallRating(firstItem.ratings.average.toFixed(2));
            setReviewCount(firstItem.ratings.count);
            setReviews(firstItem.reviews);
          } else {
            throw new Error('Invalid data format received from server');
          }
        } else {
          throw new Error('Empty or invalid data received from server');
        }
      })
      .catch(error => console.error('Error fetching reviews:', error));
  }, []);

  return (
    <div className="reviews-container">
      <div className='header_2'>
        <h2>Ratings & Reviews</h2>
      </div>
      <div className="overall">
        <div className="overall-rating">
          Overall Rating : {overallRating}
        </div>
        <div className="overall-review-count">
          Overall number of Reviews : {reviewCount}
        </div>
      </div>
      <div className="flightReviews">
        {reviews.map((review, index) => (
          <div className="review" key={index}>
            <div className="flight-id">
              Flight ID : {review.flightNumber}
            </div>
            <div className="rating_1">
              Rating : {review.rating}
            </div>
            <div className="comment">
              Review : {review.comment}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
