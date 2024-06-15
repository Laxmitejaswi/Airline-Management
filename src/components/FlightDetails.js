import React, { useEffect, useState } from "react";
import Header from './Header';
import '../BookingFlight.css';
import { useNavigate } from 'react-router-dom';

const FlightDetails = () => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const ClickedFlightDetails = localStorage.getItem("ClickedFlightDetails");
    if (ClickedFlightDetails) {
      const parsedInfo = JSON.parse(ClickedFlightDetails);
      setInfo(parsedInfo);
    }
  }, []);
  const navigate = useNavigate();
  const handleSubmit = (event) => {
      event.preventDefault();
      navigate('/SeatSelection');
  };

  const dateString = info.departure ? info.departure.scheduledTime : ''; 
  const dateObject = new Date(dateString);
  const day = dateObject.getUTCDate();
  const month = dateObject.getUTCMonth() + 1; 
  const year = dateObject.getUTCFullYear();
  const formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;

  const dateStringArrival = info.arrival ? info.arrival.scheduledTime : "";
  const dateObjectArrival = new Date(dateStringArrival);
  const dayArrival = dateObjectArrival.getUTCDate();
  const monthArrival = dateObjectArrival.getUTCMonth() + 1;
  const yearArrival = dateObjectArrival.getUTCFullYear();
  const formattedDateArrival = `${dayArrival < 10 ? "0" + dayArrival : dayArrival}-${
    monthArrival < 10 ? "0" + monthArrival : monthArrival
  }-${yearArrival}`;

  return (
    <section id="flightdetails">
      <Header heading='Complete Your Booking'/>
      <div className="flightdetailsWithid">
        <h2 className="down_3">Review Your Flight Details</h2>
        <p className='flightNumber'>Flight Number : {info.flightNumber}</p>
        <p className='Date'>Departure Date : {formattedDate}</p>
        <p className="Date">Arrival Date : {formattedDateArrival}</p>
        <p className='Date'>Price : {info.price ? info.price.economy : ""}</p>
        <div className="flight_details">
          <div className="flight_details_left">
            <div className="from_details">
                <div className="time">
                    {info.departure ? <span> {new Date(info.departure.scheduledTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                    })} </span> : ''}
                </div>
                <div className="airport-name">{info.departure ? info.departure.airportCity : ''}</div>
            </div>
            <div className="flight_duration_symbol">
              <div className="dot"></div>
              <div className="line"></div>
              <div className="plane">&#9992;</div>
              <div className="flight_duration">{info.duration} minutes</div>
            </div>
            <div className="to_details">
              <div className="time">
                {info.arrival ? <span> {new Date(info.arrival.scheduledTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                })} </span> : ''}
              </div>
            <div className="airport-name">{info.arrival ? info.arrival.airportCity : ''}</div>
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
        <button type="submit" className='button2' id="details" onClick={handleSubmit}>Select Seat</button>
      </div>
    </section>
  );
};

export default FlightDetails;
