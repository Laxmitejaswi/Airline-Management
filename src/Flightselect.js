import React, { useEffect, useState } from "react";
import "./App.css";
import "./Flightselect.css";

export default function Flightselect() {
  const [info, setInfo] = useState([]);
  const [infoFrom, setFrom] = useState("");
  const [infoTo, setTo] = useState("");

  useEffect(() => {
    const flightSearchResults = localStorage.getItem("flightSearchResults");
    const from = localStorage.getItem("from");
    const to = localStorage.getItem("to");
    if (flightSearchResults) {
      const fromInfo = from ? JSON.parse(from) : "";
      const toInfo = to ? JSON.parse(to) : "";
      const parsedInfo = JSON.parse(flightSearchResults).map(flight => ({
        ...flight,
        showReviews: false
      }));
      console.log('Loaded flight info:', parsedInfo);
      setInfo(parsedInfo);
      setFrom(fromInfo);
      setTo(toInfo);
    }
  }, []);

  const handleFlightClick = (index) => {
    console.log(`Toggling reviews for flight at index: ${index}`);
    setInfo((prevInfo) => {
      const updatedInfo = prevInfo.map((flight, i) => {
        if (i === index) {
          return { ...flight, showReviews: true };
        }else{
          return { ...flight, showReviews: false }; // Ensure to return the unchanged flight for other indices
        }
      });
      console.log('Updated flight info:', updatedInfo);
      return updatedInfo;
    });
  };  

  return (
    <div>
      <div className="navbar">
        <div className="nav-left">
          <div className="nav-name">
            <p>App Name</p>
          </div>
          <i className="fa-solid fa-plane" />
        </div>
        <div className="nav-right">
        <a href="">Book Flights</a>
          <a href="">Check-in</a>
          <a href="">Login</a>
        </div>
      </div>
      {info.length > 0 ? (
        info.map((flight, index) => (
          <div
            className="flightdeatils_review"
            key={index}
            id="flight"
            onClick={() => handleFlightClick(index)}
          >
            <div className="flight_details">
              <div className="flight_details_left">
                <div className="from_details">
                  <div className="time">
                    <span>
                      {new Date(flight.departure.scheduledTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="airport-name">{infoFrom}</div>
                </div>
                <div className="flight_duration_symbol">
                  <div className="dot" />
                  <div className="line" />
                  <div className="plane">✈</div>
                  <div className="flight_duration">{flight.duration} minutes</div>
                </div>
                <div className="to_details">
                  <div className="time">
                    <span>
                      {new Date(flight.arrival.scheduledTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="airport-name">{infoTo}</div>
                </div>
              </div>
              <div className="flight_number">{flight.flightNumber}</div>
              <div className="flight_details_middle">Non-stop</div>
              <div className="flight_details_right">₹{flight.price.economy}</div>
            </div>
            {flight.showReviews && (
              <div className="reviews">
                <div className="luggage">
                  <p className="review-text">Cabin Baggage: 7Kgs</p>
                  <p className="review-text">Checkin Baggage: 15kgs</p>
                </div>
                <button className="book_now">
                  Book Now
                </button>
                <h3 className="review-text">Customer Reviews for flight</h3>
                {flight.reviews.length > 0 ? (
                  flight.reviews.map((review, reviewIndex) => (
                    <p className="review-text" key={reviewIndex}>
                      {review}
                    </p>
                  ))
                ) : (
                  <p className="review-text">No reviews yet</p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No flight details available.</p>
      )}
    </div>
  );
}
