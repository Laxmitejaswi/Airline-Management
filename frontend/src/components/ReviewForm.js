import React, { useState, useEffect } from 'react';
import '../review.css'; 

const ReviewForm = () => {
  const [rating, setRating] = useState(0); 
  const [reviewText, setReviewText] = useState(''); 
  const [flightNumber, setFlightNumber] = useState(''); 
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    highlightStars(rating);
  }, [rating]);

  useEffect(() => {
    if (message === 'Review submitted successfully!') {
      const timer = setTimeout(() => {
        setMessage('');
      }, 2000); 

      return () => clearTimeout(timer); 
    }
  }, [message]);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const username = localStorage.getItem('username');
    const reviewData = {
      username: username,
      flightNumber,
      rating: rating.toString(),
      comment: reviewText
    };
    console.log('https://airline-management-2.onrender.com/api/addreviews/newairline');
    fetch('https://airline-management-2.onrender.com/api/addreviews/newairline', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    })
    .then((response) => {
      if (!response.ok) {
        return response.text().then(errorMessage => {
          throw new Error(errorMessage);
        });
      }
      return response.json();
    })
    .then(data => {
      setMessage('Review submitted successfully!');
      setRating(0);
      setReviewText('');
      setFlightNumber('');
    })
    .catch(error => {
      console.error('Error submitting review:', error);
      setMessage(`Failed to submit review: ${error.message}`);
    });
  };

  const highlightStars = (rating) => {
    const stars = document.querySelectorAll('.rating input');
    stars.forEach(star => {
      star.nextElementSibling.style.transition = 'color 0.3s ease-in-out';
      if (parseInt(star.value) <= rating) {
        star.nextElementSibling.style.color = '#ffd700';
      } else {
        star.nextElementSibling.style.color = '#ddd';
      }
    });
  };

  return (
    <div className="outer">
      <div className="container_3">
        <h1>Feedback Submission</h1>
        <form id="reviewForm" onSubmit={handleFormSubmit}>
          <div id="flightNum">
            <label htmlFor="flight_id" id="rating_1">Flight Number : </label>
            <input
              type="text"
              id="flight_id"
              name="flight_id"
              placeholder='Eg :-  AA001'
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              required
            />
          </div>
          <div className="rating">
            <p id="rating">Rating : </p>
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
          {message && <div className='out'><p className='message_1'>{message}</p></div>}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
