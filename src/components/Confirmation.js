import React, { useEffect, useState } from "react";
import "../BookingFlight.css";

const Confirmation = ({ seatSelected, passengerDetails }) => {
  const [info, setInfo] = useState({});
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const ClickedFlightDetails = localStorage.getItem("ClickedFlightDetails");
    if (ClickedFlightDetails) {
      const parsedInfo = JSON.parse(ClickedFlightDetails);
      setInfo(parsedInfo);
    }
  }, []);

  const handleClick = (event) => {
    event.preventDefault();
    setBooked(true);
  };

  const dateString = info.departure ? info.departure.scheduledTime : "";
  const dateObject = new Date(dateString);
  const day = dateObject.getUTCDate();
  const month = dateObject.getUTCMonth() + 1;
  const year = dateObject.getUTCFullYear();
  const formattedDate = `${day < 10 ? "0" + day : day}-${
    month < 10 ? "0" + month : month
  }-${year}`;
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
        </div>
      ) : (
        <div>
          <h2>Booking Confirmation</h2>
          <h3>Flight Details</h3>
          <p className="flightNumber">Flight Number : {info.flightNumber}</p>
          <p className="Date">Date : {formattedDate}</p>
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
          <h3 className="travellerDetails">Traveller Details</h3>
          {passengerDetails && passengerDetails.title ? (
            <div id="confirmationDetails">
              <p className="passengerDetails">
                Name :{" "}
                {`${passengerDetails.title} ${passengerDetails.firstName} ${passengerDetails.lastName}`}
              </p>
              <p className="passengerDetails">
                Email : {passengerDetails.emailId}
              </p>
              <p className="passengerDetails">
                Contact : {passengerDetails.phoneNum}
              </p>
              <p className="passengerDetails">Seat : {seatSelected}</p>
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
          ) : (
            <p className="passengerDetails">No passenger details available.</p>
          )}
        </div>
      )}
      </div>
    </section>
  );
};

export default Confirmation;
