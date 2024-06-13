import React, { useState } from 'react';
import '../profile.css';
import leftArrow from './Left arrow.png';
import rightArrow from './Right arrow.png';
import { useNavigate } from 'react-router-dom';

const Trips = () => {
  const [activeTab, setActiveTab] = useState('current-bookings');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/Profile');
  }

  const handleDetails = () => {
    navigate('/itinerary');
  }

  return (
    <div className='outerDiv'>
      <div className='container_1'>
        <div className="trips-section" id="trips-section">
          <div className="trips-header">
            <button id="back-to-main-btn-t" className="back" onClick={handleBack}>
              <img src={leftArrow} alt="Left Arrow" />
            </button>
            <h1>Trips</h1>
          </div>
          <div className="top-bar">
            <button 
              className={`tab-btn ${activeTab === 'current-bookings' ? 'active' : ''}`} 
              onClick={() => setActiveTab('current-bookings')}
            >
              Current Bookings
            </button>
            <button 
              className={`tab-btn ${activeTab === 'completed-bookings' ? 'active' : ''}`} 
              onClick={() => setActiveTab('completed-bookings')}
            >
              Completed Bookings
            </button>
            <button 
              className={`tab-btn ${activeTab === 'cancelled-bookings' ? 'active' : ''}`} 
              onClick={() => setActiveTab('cancelled-bookings')}
            >
              Cancelled Bookings
            </button>
          </div>
          <div id="current-bookings" className={`tab-content ${activeTab === 'current-bookings' ? 'active' : ''}`}>
            <div className="trip-details">
              <div className="date">Date</div>
              <div className="flight-details_2">
                <div className="airport-details">
                  <div className="dep-airport">Dep_airport</div>
                  <i className="fa-solid fa-arrow-right"></i>
                  <div className="arr-airport">Arr_airport</div>
                </div>
                <div className="booking-id"></div>
                <div className="itinerary" onClick={handleDetails}>
                  <button className='button2' id="view">View Itinerary</button>
                </div>
              </div>
            </div>
          </div>
          <div id="completed-bookings" className={`tab-content ${activeTab === 'completed-bookings' ? 'active' : ''}`}>
            <p>No completed bookings available.</p>
          </div>
          <div id="cancelled-bookings" className={`tab-content ${activeTab === 'cancelled-bookings' ? 'active' : ''}`}>
            <p>No cancelled bookings available.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trips;
