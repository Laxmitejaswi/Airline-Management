import React, { useState, useEffect } from 'react';
import '../profile.css';
import leftArrow from './Left arrow.png';
import { useNavigate } from 'react-router-dom';

const Trips = () => {
  const [activeTab, setActiveTab] = useState('current-bookings');
  const [bookings, setBookings] = useState({
    current: [],
    completed: [],
    cancelled: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const UserName = localStorage.getItem('username');

  useEffect(() => {
    fetchBookingsData();
  }, [UserName]);

  const fetchBookingsData = () => {
    const endpoints = [
      `https://airline-management-2.onrender.com/api/bookings/confirmed/${UserName}`,
      `https://airline-management-2.onrender.com/api/bookings/completed/${UserName}`,
      `https://airline-management-2.onrender.com/api/bookings/cancelled/${UserName}`
    ];

    Promise.all(endpoints.map(endpoint => fetch(endpoint).then(response => response.json())))
      .then(([confirmedBookings, completedBookings, cancelledBookings]) => {
        setBookings({
          current: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      });
  };

  const handleBack = () => {
    navigate('/Profile');
  };

  const handleCheckIn = () => {
    navigate(`/CheckIn`);
  };

  const handleFeedback = () => {
    navigate(`/RR`);
  };

  const handleStatus = () => {
    navigate(`/FlightStatus`);
  }

  const handleDetails = (bookingId) => {
    fetch(`https://airline-management-2.onrender.com/api/bookings/${bookingId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log('Booking Cancelled successfully.');
    })
    .catch(error => {
      console.error('Error cancelling booking:', error);
    });
  }
  

  if (loading) {
    return <div></div>;
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
            {bookings.current.length > 0 ? (
              bookings.current.map(booking => {
                const dateString = booking.departure ? booking.departure.scheduledTime : ''; 
                const dateObject = new Date(dateString);
                const day = dateObject.getUTCDate();
                const month = dateObject.getUTCMonth() + 1; 
                const year = dateObject.getUTCFullYear();
                const formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;

                const dateStringArrival = booking.arrival ? booking.arrival.scheduledTime : "";
                const dateObjectArrival = new Date(dateStringArrival);
                const dayArrival = dateObjectArrival.getUTCDate();
                const monthArrival = dateObjectArrival.getUTCMonth() + 1;
                const yearArrival = dateObjectArrival.getUTCFullYear();
                const formattedDateArrival = `${dayArrival < 10 ? "0" + dayArrival : dayArrival}-${
                  monthArrival < 10 ? "0" + monthArrival : monthArrival
                }-${yearArrival}`;

                return (
                  <div className="trip-details" key={booking.bookingId || booking._id}>
                    <section id="flightdetails">
                      <div className="flightdetailsWithid_2">
                        <h1 className='BookingDetails'>Booking Details</h1>
                        <p className='flightNumber'>Flight Number : {booking.flightNumber}</p>
                        <p className='Date'>Departure Date : {formattedDate}</p>
                        <p className='Date'>Arrival Date : {formattedDateArrival}</p>
                        <div className="flight_details">
                          <div className="flight_details_left">
                            <div className="from_details">
                                <div className="time">
                                    {booking.departure ? <span> {new Date(booking.departure.scheduledTime).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                    })} </span> : ''}
                                </div>
                                <div className="airport-name">{booking.departure ? booking.departure.airportCity : ''}</div>
                            </div>
                            <div className="flight_duration_symbol">
                              <div className="dot"></div>
                              <div className="line"></div>
                              <div className="plane">&#9992;</div>
                              <div className="flight_duration">{booking.duration} minutes</div>
                            </div>
                            <div className="to_details">
                              <div className="time">
                                {booking.arrival ? <span> {new Date(booking.arrival.scheduledTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                })} </span> : ''}
                              </div>
                            <div className="airport-name">{booking.arrival ? booking.arrival.airportCity : ''}</div>
                            </div>
                          </div>
                          <div className="flight_details_right">
                            <div className="Baggage">
                              <div className="gap-1">Baggage</div>
                              <div>Per Traveller</div>
                            </div>
                            <div className="Baggage">
                              <div className="gap-2">Cabin</div>
                              <div>7kgs</div>
                            </div>
                            <div className="Baggage">
                              <div>Check-in</div>
                              <div>15kgs</div>
                            </div>
                          </div>
                        </div>
                        <p className='Date Date_3'>Seat Number : {booking.seat}</p>
                        <p className='Date'>Price : {booking.price}</p>
                        <div id="gap_2">
                          <button className='button2' id="view" onClick={handleStatus}>Flight Status</button>
                          <button className='button2' id="view" onClick={handleCheckIn}>Check-in</button>
                          <button className='button2' id="view" onClick={() => {handleDetails(booking._id)}}>Cancel Booking</button>
                        </div>
                      </div>
                    </section>
                  </div>
                );
              })
            ) : (
              <p>No current bookings available.</p>
            )}
          </div>

          <div id="completed-bookings" className={`tab-content ${activeTab === 'completed-bookings' ? 'active' : ''}`}>
            {bookings.completed.length > 0 ? (
              bookings.completed.map(booking => {
                const dateString = booking.departure ? booking.departure.scheduledTime : ''; 
                const dateObject = new Date(dateString);
                const day = dateObject.getUTCDate();
                const month = dateObject.getUTCMonth() + 1; 
                const year = dateObject.getUTCFullYear();
                const formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;

                const dateStringArrival = booking.arrival ? booking.arrival.scheduledTime : "";
                const dateObjectArrival = new Date(dateStringArrival);
                const dayArrival = dateObjectArrival.getUTCDate();
                const monthArrival = dateObjectArrival.getUTCMonth() + 1;
                const yearArrival = dateObjectArrival.getUTCFullYear();
                const formattedDateArrival = `${dayArrival < 10 ? "0" + dayArrival : dayArrival}-${
                  monthArrival < 10 ? "0" + monthArrival : monthArrival
                }-${yearArrival}`;
                
                return (
                  <div className="trip-details" key={booking.bookingId || booking._id}>
                    <section id="flightdetails">
                      <div className="flightdetailsWithid_1">
                        <h1 className='BookingDetails'>Booking Details</h1>
                        <p className='flightNumber'>Flight Number : {booking.flightNumber}</p>
                        <p className='Date'>Departure Date : {formattedDate}</p>
                        <p className='Date'>Arrival Date : {formattedDateArrival}</p>
                        <p className='Date'>Seat Number : {booking.seat}</p>
                        <p className='Date'>Price : {booking.price}</p>
                        <div className="flight_details">
                          <div className="flight_details_left">
                            <div className="from_details">
                                <div className="time">
                                    {booking.departure ? <span> {new Date(booking.departure.scheduledTime).toLocaleTimeString([], {
                                            timeZone: 'Asia/Kolkata',
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                    })} </span> : ''}
                                </div>
                                <div className="airport-name">{booking.departure ? booking.departure.airportCity : ''}</div>
                            </div>
                            <div className="flight_duration_symbol">
                              <div className="dot"></div>
                              <div className="line"></div>
                              <div className="plane">&#9992;</div>
                              <div className="flight_duration">{booking.duration} minutes</div>
                            </div>
                            <div className="to_details">
                              <div className="time">
                                {booking.arrival ? <span> {new Date(booking.arrival.scheduledTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                })} </span> : ''}
                              </div>
                            <div className="airport-name">{booking.arrival ? booking.arrival.airportCity : ''}</div>
                            </div>
                          </div>
                          <div className="flight_details_right">
                            <div className="Baggage">
                              <div className="gap-1">Baggage</div>
                              <div>Per Traveller</div>
                            </div>
                            <div className="Baggage">
                              <div className="gap-2">Cabin</div>
                              <div>7kgs</div>
                            </div>
                            <div className="Baggage">
                              <div>Check-in</div>
                              <div>15kgs</div>
                            </div>
                          </div>
                        </div>
                        <div id="gap_2">
                          <button className='button2' id="view" onClick={handleFeedback}>Submit Feedback</button>
                        </div>
                      </div>
                    </section>
                  </div>
                );
              })
            ) : (
              <p>No completed bookings available.</p>
            )}
          </div>
          <div id="cancelled-bookings" className={`tab-content ${activeTab === 'cancelled-bookings' ? 'active' : ''}`}>
            {bookings.cancelled.length > 0 ? (
              bookings.cancelled.map(booking => {
                const dateString = booking.departure ? booking.departure.scheduledTime : ''; 
                const dateObject = new Date(dateString);
                const day = dateObject.getUTCDate();
                const month = dateObject.getUTCMonth() + 1; 
                const year = dateObject.getUTCFullYear();
                const formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;

                const dateStringArrival = booking.arrival ? booking.arrival.scheduledTime : "";
                const dateObjectArrival = new Date(dateStringArrival);
                const dayArrival = dateObjectArrival.getUTCDate();
                const monthArrival = dateObjectArrival.getUTCMonth() + 1;
                const yearArrival = dateObjectArrival.getUTCFullYear();
                const formattedDateArrival = `${dayArrival < 10 ? "0" + dayArrival : dayArrival}-${
                  monthArrival < 10 ? "0" + monthArrival : monthArrival
                }-${yearArrival}`;

                return (
                  <div className="trip-details" key={booking.bookingId || booking._id}>
                    <section id="flightdetails">
                      <div className="flightdetailsWithid_4">
                        <h1 className='BookingDetails'>Booking Details</h1>
                        <p className='flightNumber'>Flight Number : {booking.flightNumber}</p>
                        <p className='Date'>Departure Date : {formattedDate}</p>
                        <p className='Date'>Arrival Date : {formattedDateArrival}</p>
                        <p className='Date'>Seat Number : {booking.seat}</p>
                        <p className='Date'>Price : {booking.price}</p>
                        <div className="flight_details">
                          <div className="flight_details_left">
                            <div className="from_details">
                                <div className="time">
                                    {booking.departure ? <span> {new Date(booking.departure.scheduledTime).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                    })} </span> : ''}
                                </div>
                                <div className="airport-name">{booking.departure ? booking.departure.airportCity : ''}</div>
                            </div>
                            <div className="flight_duration_symbol">
                              <div className="dot"></div>
                              <div className="line"></div>
                              <div className="plane">&#9992;</div>
                              <div className="flight_duration">{booking.duration} minutes</div>
                            </div>
                            <div className="to_details">
                              <div className="time">
                                {booking.arrival ? <span> {new Date(booking.arrival.scheduledTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                })} </span> : ''}
                              </div>
                            <div className="airport-name">{booking.arrival ? booking.arrival.airportCity : ''}</div>
                            </div>
                          </div>
                          <div className="flight_details_right">
                            <div className="Baggage">
                              <div className="gap-1">Baggage</div>
                              <div>Per Traveller</div>
                            </div>
                            <div className="Baggage">
                              <div className="gap-2">Cabin</div>
                              <div>7kgs</div>
                            </div>
                            <div className="Baggage">
                              <div>Check-in</div>
                              <div>15kgs</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                );
              })
            ) : (
              <p>No cancelled bookings available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trips;
