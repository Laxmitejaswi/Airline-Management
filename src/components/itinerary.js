import React from 'react';
import '../profile.css';
import leftArrow from './Left arrow.png';
import { useNavigate } from 'react-router-dom';

const Itinerary = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/Trips');
    };

    return (
        <div className='outerDiv'>
            <div className='container_1'>
                <div className="itinerary-section" id="itinerary-section">
                    <div className="trips-header">
                        <button id="back-to-main-btn-itenary" className="back" onClick={handleBack}>
                            <img src={leftArrow} alt="Left Arrow" />
                        </button>
                        <h1>Your Itinerary</h1>
                    </div>
                    <div className="details">
                        <div className="flight_details_2">
                            <div className="from_details_2">
                                <div className="time_2">
                                    Dep_time
                                </div>
                                <div className="airport-name_2">
                                    Dep_airport
                                </div>
                            </div>
                            <div className="flight_duration_symbol_2">
                                <div className="dot_2"></div>
                                <div className="line_2"></div>
                                <div className="plane_2">&#9992;</div>
                                <div className="flight_duration_2">
                                    duration
                                </div>
                            </div>
                            <div className="to_details_2">
                                <div className="time_2">
                                    arr_time
                                </div>
                                <div className="airport-name_2">
                                    arr_airport
                                </div>
                            </div>
                        </div>
                        <div className="baggage_details">
                            <h3>Baggage Per Traveller</h3>
                            <p>Cabin Baggage: 7kgs (1pc)</p>
                            <p>Check-in Baggage: 15kgs (1pc)</p>
                        </div>
                        <div className="traveller_details">
                            <p>Seat Number : </p>
                        </div>
                        <button className="cancel_btn">Cancel Booking</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Itinerary;
