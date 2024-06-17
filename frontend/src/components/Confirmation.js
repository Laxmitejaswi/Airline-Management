import React, { useEffect, useState } from "react";
import "../BookingFlight.css";
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const [info, setInfo] = useState({});
  const [booked, setBooked] = useState(false);
  const [seatBooked , setSeatBooked] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const seatSelected = localStorage.getItem('seatSelected');
  useEffect(() => {
    const ClickedFlightDetails = localStorage.getItem("ClickedFlightDetails");
    if (ClickedFlightDetails) {
      const parsedInfo = JSON.parse(ClickedFlightDetails);
      setInfo(parsedInfo);
    }
  }, []);

  const handleBack = (event) => {
    event.preventDefault();
    navigate("/");
  }

  const handleClick = async (event) => {
    event.preventDefault();
    if(info.flightNumber){
      try {
        const response = await fetch(`https://airline-management-2.onrender.com/api/bookings?flightId=${info.flightNumber}&username=${username}&seat=${seatSelected}&seatClass=economy&price=${info.price.economy}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            flightId: info.flightNumber,
            username: username,
            seat: seatSelected,
            seatClass: "economy",
            price: info.price.economy,
          }),
        });
  
        if (response.ok) {
          setBooked(true);
        } else {
          setSeatBooked(true);
          console.error("Booking failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error booking seat:", error);
      }
    }
  };

  const dateString = info.departure ? info.departure.scheduledTime : "";
  const dateObject = new Date(dateString);
  const day = dateObject.getUTCDate();
  const month = dateObject.getUTCMonth() + 1;
  const year = dateObject.getUTCFullYear();
  const formattedDateDeparture = `${day < 10 ? "0" + day : day}-${
    month < 10 ? "0" + month : month
  }-${year}`;

  const dateStringArrival = info.arrival ? info.arrival.scheduledTime : "";
  const dateObjectArrival = new Date(dateStringArrival);
  const dayArrival = dateObjectArrival.getUTCDate();
  const monthArrival = dateObjectArrival.getUTCMonth() + 1;
  const yearArrival = dateObjectArrival.getUTCFullYear();
  const formattedDateArrival = `${dayArrival < 10 ? "0" + dayArrival : dayArrival}-${
    monthArrival < 10 ? "0" + monthArrival : monthArrival
  }-${yearArrival}`;

  return (
    <section id="confirmation">
      <div  className="confirm">
      {booked ? (
        <div>
            <p className="top">
            Booking Confirmed!
            </p>
            <p className="confirmationMessage">
            Your seat has been successfully reserved.
            </p>
            <p className="confirmationMessage">
            You will receive an Email to your registered Email address regarding your booking details.
            </p>
            <p className="confirmationMessage">
            Thank you for choosing our service.
            </p>
            <button className="button2" id="details" onClick={handleBack}>Search Flights</button>
        </div>
      ) : (
        <div>
          <h2>Booking Confirmation</h2>
          <h3>Flight Details</h3>
          <p className="flightNumber">Flight Number : {info.flightNumber}</p>
          <p className="Date">Departure Date : {formattedDateDeparture}</p>
          <p className="Date">Arrival Date : {formattedDateArrival}</p>
          <div className="flight_details">
            <div className="flight_details_left">
              <div className="from_details">
                <div className="time">
                  {info.departure ? (
                    <span>
                      {" "}
                      {new Date(
                        info.departure.scheduledTime
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="airport-name">
                  {info.departure ? info.departure.airportCity : ""}
                </div>
              </div>
              <div className="flight_duration_symbol">
                <div className="dot"></div>
                <div className="line"></div>
                <div className="plane">&#9992;</div>
                <div className="flight_duration">{info.duration} minutes</div>
              </div>
              <div className="to_details">
                <div className="time">
                  {info.arrival ? (
                    <span>
                      {" "}
                      {new Date(info.arrival.scheduledTime).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}{" "}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="airport-name">
                  {info.arrival ? info.arrival.airportCity : ""}
                </div>
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
          <p className='Date Date_3'>Price : {info.price ? info.price.economy : ""}</p>
          <p className="passengerDetails">Seat Selected : {seatSelected}</p>
          <div id="confirmationDetails">
            <div className="confirmButtonWrapper">
              <p className="passengerDetails" id="details">
                Click here to Confirm Your Booking :{" "}
              </p>
              <button
                onClick={handleClick}
                className="button2"
                id="confirmBooking"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
};

export default Confirmation;
