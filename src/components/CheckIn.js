import React, { useState } from 'react';
import '../CheckIn.css';
import CheckIn_Header from './CheckIn_Header';
import { useNavigate } from 'react-router-dom';

const CheckIn = () => {
  const [bookingId, setBookingId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleBookFlights = () => {
    navigate(-1);
  };

  const handleCheckIn = () => {
    if (!bookingId) {
      setMessage('Please enter your Booking ID');
      return;
    }
    console.log(`http://localhost:3000/api/checkin/${bookingId}`);
    fetch(`http://localhost:3000/api/checkin/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ checkinStatus: true })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setMessage('Web Check-In Successful');
    })
    .catch(error => {
      console.error('Error updating check-in status:', error);
      setMessage('Failed to check in. Please try again.');
    });
  };

  return (
    <div>
      <CheckIn_Header/>
      <div className="check-in">
        <label htmlFor="bookingId">Booking ID :</label>
        <input 
          type="text" 
          id="bookingId" 
          name="bookingId"
          value={bookingId}
          placeholder='Enter Your Booking ID'
          onChange={(e) => setBookingId(e.target.value)} 
          required
        /><br />
        {message && <p className="message_1">{message}</p>}
        <div>
          <button onClick={handleCheckIn}>Check-In</button>
          <button onClick={handleBookFlights}>Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
