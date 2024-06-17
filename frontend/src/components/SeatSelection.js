import React, { useEffect, useState } from 'react';
import '../BookingFlight.css';
import { useNavigate } from 'react-router-dom';

const SeatSelection = () => {
    const [availableSeats, setAvailableSeats] = useState([]);
    const [info, setInfo] = useState({});
    const [message, setMessage] = useState("");
    const [seatSelected , setSeat] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const ClickedFlightDetails = localStorage.getItem("ClickedFlightDetails");
        if (ClickedFlightDetails) {
          const parsedInfo = JSON.parse(ClickedFlightDetails);
          setInfo(parsedInfo);
        }
    }, []);

    useEffect(() => {
        if (info.flightNumber) {
            fetchAvailableSeats();
        }
    }, [info]);

    const fetchAvailableSeats = () => {
        try {
            fetch(`https://airline-management-2.onrender.com/api/flights/${info.flightNumber}/seats`)
            .then((response) => response.json())
            .then((data) => {
                setAvailableSeats(data.economy);
            })
            .catch((error) => {
                console.error('Error fetching available seats :', error);
            });
        } catch (error) {
            console.error('Error fetching available seats:', error);
        }
    };

    const onConfirm = (event) => {
        event.preventDefault();
        if (seatSelected === null) {
            setMessage("Please Select Seat to Confirm Your booking !");
        } else {
            localStorage.setItem('seatSelected',seatSelected);
            navigate('/Confirmation');
        }
    };

    const generateSeatMap = () => {
        const rows = 30;
        const cols = 6;
        const seatMap = [];
        for (let row = 1; row <= rows; row++) {
            for (let col = 1; col <= cols; col++) {
                seatMap.push(`${row}${String.fromCharCode(64 + col)}`);
            }
        }
        return seatMap;
    };

    return (
        <section id="seatSelection">
            <div className="seats">
                <div className='heading_1'>
                    <h2>Select Your Seat</h2>
                </div>
                <div className="legend">
                    <div className="legend-item">
                        <div className="legend-box available"></div>
                        <span>Available Seats</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-box unavailable"></div>
                        <span>Unavailable Seats</span>
                    </div>
                </div>
                <div id="seatMap" className="seat-map">
                    {generateSeatMap().map((seatNumber) => (
                        <div
                            key={seatNumber}
                            className={`seat ${seatSelected === seatNumber ? 'selected' : ''} ${availableSeats.includes(seatNumber) ? 'available' : 'unavailable'}`}
                            onClick={() => {availableSeats.includes(seatNumber) && setSeat(seatNumber);
                            }}
                        >
                            {seatNumber}
                        </div>
                    ))}
                </div>
                <div className='outerMessage'><div className='message'>{message}</div></div>
                <div className='bookingConfirm'>
                    <button onClick={onConfirm} className='button2'>Confirm Seat</button>
                </div>
            </div>
        </section>
    );
};

export default SeatSelection;
