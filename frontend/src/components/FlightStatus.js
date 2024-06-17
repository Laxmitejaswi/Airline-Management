import React, { useState } from 'react';
import '../CheckIn.css';
import { useNavigate } from 'react-router-dom';

const FlightStatus = () => {
  const [bookingId, setBookingId] = useState('');
  const [message, setMessage] = useState('');
  const [flightStatus, setFlightStatus] = useState('');
  const navigate = useNavigate();

  const handleBookFlights = () => {
    navigate(-1);
  };

  const handleGetFlightStatus = () => {
    if (!bookingId) {
      setMessage('Please enter Flight Number');
      return;
    }
    fetch(`https://airline-management-2.onrender.com/api/flights/${bookingId}`)
      .then(response => {
        if (!response.ok) {
          return response.text().then(errorMessage => {
            throw new Error(errorMessage);
          });
        }
        return response.json();
      })
      .then(data => {
        setFlightStatus(data.status);
        setMessage('');
      })
      .catch(error => {
        console.error('Error fetching flight status:', error);
        setMessage(error.message);
      });
  };

  return (
    <div>
      <div className='header_1'>
        <h1>Flight Status</h1>
      </div>
      <div className="check-in">
        <label htmlFor="bookingId">Flight Number :</label>
        <input 
          type="text" 
          id="bookingId" 
          name="bookingId"
          value={bookingId}
          placeholder='Eg :-  AA001'
          onChange={(e) => setBookingId(e.target.value)} 
          required
        /><br />
        {message && <p className="message_1">{message}</p>}
        {flightStatus && <p className="message_1">Flight Status : {flightStatus}</p>}
        <div className='gap_4'>
          <button onClick={handleGetFlightStatus}>Get Flight Status</button>
          <button onClick={handleBookFlights}>Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default FlightStatus;
