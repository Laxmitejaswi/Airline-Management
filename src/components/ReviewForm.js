import React, { useState } from 'react';
import '../review.css'; // Import CSS file for styling

const ReviewForm = () => {
  const [rating, setRating] = useState(0); // State to manage rating
  const [reviewText, setReviewText] = useState(''); // State to manage review text

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!rating) {
      alert('Please select a rating');
      return;
    }

    // Here you can handle form submission logic, e.g., sending data to server

    // Reset form after submission
    setRating(0);
    setReviewText('');
  };

  return (
    <div className="outer">
      <div className="container_3">
        <h1>Submit Your Review</h1>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="flight_id"> Flight ID:</label>
          <input type="text" id="flight_id" name="flight_id" required />
          <div className="rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <React.Fragment key={value}>
                <input
                  type="radio"
                  id={`star${value}`}
                  name="stars"
                  value={value}
                  checked={rating === value}
                  onChange={() => handleRatingChange(value)}
                />
                <label htmlFor={`star${value}`} title={`${value} stars`}>&#9733;</label>
              </React.Fragment>
            ))}
          </div>
          <textarea
            name="review"
            id="review"
            rows="4"
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
