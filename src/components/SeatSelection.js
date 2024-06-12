import React, { useEffect, useState } from 'react';
import '../BookingFlight.css';
import { useNavigate } from 'react-router-dom';

const SeatSelection = ({ setSeat, seatSelected }) => {
    useEffect(() => {
        generateSeatMap();
    }, []);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    const onConfirm = (event) => {
        event.preventDefault();
        if (seatSelected === null) {
            setMessage("Please Select Seat to Confirm Your booking !");
        } else {
            console.log(seatSelected);
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
                <div className='heading'>
                    <h2>Select Your Seat</h2>
                </div>
                <div id="seatMap" className="seat-map">
                    {generateSeatMap().map((seatNumber) => (
                        <div
                            key={seatNumber}
                            className={`seat ${seatSelected === seatNumber ? 'selected' : ''}`}
                            onClick={() => setSeat(seatNumber)}
                        >
                            {seatNumber}
                        </div>
                    ))}
                </div>
                <div className='bookingConfirm'>
                    <button onClick={onConfirm} className='button2'>Confirm Booking</button>
                </div>
                <div className='outerMessage'><div className='message'>{message}</div></div>
            </div>
        </section>
    );
};

export default SeatSelection;
