import React, { useEffect, useState } from "react";
import "./App.css";
import "./Flightselect.css";
import { useNavigate } from 'react-router-dom';

export default function Flightselect({isLoggedIn}) {
  const [info, setInfo] = useState([]);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const flightSearchResults = localStorage.getItem("flightSearchResults");
    if (flightSearchResults) {
      const parsedInfo = JSON.parse(flightSearchResults).map(flight => ({
        ...flight,
        showReviews: false
      }));
      setInfo(parsedInfo);
    }
  }, []);

  const handleFlightClick = (index) => {
    setInfo((prevInfo) => {
      const updatedInfo = prevInfo.map((flight, i) => {
        if (i === index) {
          return { ...flight, showReviews: true };
        }else{
          return { ...flight, showReviews: false };
        }
      });
      return updatedInfo;
    });
  };  

  const handleRatings = () => {
    if(isLoggedIn){
      navigate('/Reviews_Ratings');
    }else{
      setShowLoginMessage(true);
    }
  }

  const handleBookingFlight = (flight) => {
    if(isLoggedIn){
      localStorage.setItem('ClickedFlightDetails' , JSON.stringify(flight));
      navigate('/FlightDetails');
    }else{
      setShowLoginMessage(true);
    }
  }

  return (
    <div className="flightselect">
      {info.length > 0 ? (
        info.map((flight, index) => {
          const departureDateObject = new Date(flight.departure.scheduledTime);
          const arrivalDateObject = new Date(flight.arrival.scheduledTime);

          const formattedDateDeparture = `${departureDateObject.getUTCDate() < 10 ? '0' : ''}${departureDateObject.getUTCDate()}-${departureDateObject.getUTCMonth() + 1 < 10 ? '0' : ''}${departureDateObject.getUTCMonth() + 1}-${departureDateObject.getUTCFullYear()}`;
          const formattedDateArrival = `${arrivalDateObject.getUTCDate() < 10 ? '0' : ''}${arrivalDateObject.getUTCDate()}-${arrivalDateObject.getUTCMonth() + 1 < 10 ? '0' : ''}${arrivalDateObject.getUTCMonth() + 1}-${arrivalDateObject.getUTCFullYear()}`;

          return (
            <div
              className="flightdeatils_review"
              key={index}
              id="flight"
              onClick={() => handleFlightClick(index)}
            >
              <div className="flight_details_1">
                <div className="flight_details_left_1">
                  <div className="from_details_1">
                    <div className="time_1">
                      <span>
                        {new Date(flight.departure.scheduledTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="airport-name">{flight.departure.airportCity}</div>
                  </div>
                  <div className="flight_duration_symbol_1">
                    <div className="dot_1" />
                    <div className="line_1" />
                    <div className="plane_1">✈</div>
                    <div className="flight_duration_1">{flight.duration} minutes</div>
                  </div>
                  <div className="to_details_1">
                    <div className="time_1">
                      <span>
                        {new Date(flight.arrival.scheduledTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="airport-name">{flight.arrival.airportCity}</div>
                  </div>
                </div>
                <div className="flight_number">{flight.flightNumber}</div>
                <div className="flight_details_middle">Non-stop</div>
                <div className="flight_details_right_1">₹{flight.price.economy}</div>
              </div>
              {flight.showReviews && (
                <div className="reviews">
                  <p className='review-text'>Departure Date : {formattedDateDeparture}</p>
                  <p className="review-text">Arrival Date : {formattedDateArrival}</p>
                  <div className="luggage">
                    <p className="review-text">Cabin Baggage : 7Kgs</p>
                    <p className="review-text">Checkin Baggage : 15kgs</p>
                  </div>
                  <div> 
                  <button className="book_now" onClick={() => {handleBookingFlight(flight)}}>
                    Book Now
                  </button>
                  <button className="book_now" id="left" onClick={() => {handleRatings()}}>
                    Ratings & Reviews
                  </button>
                  </div>
                  {showLoginMessage && (
                    <p className="login-message">Please Login to book a flight !</p>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="no-flights">No flights available !!</p>
      )}
    </div>
  );
}
