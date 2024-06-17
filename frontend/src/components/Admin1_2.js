import React, { useState } from 'react';
import '../admin.css';

export default function Admin1_2() {
    const [flightNumber, setFlightNumber] = useState('');
    const [depAirport, setDepAirport] = useState('');
    const [arrAirport, setArrAirport] = useState('');
    const [depScheduledTime, setDepScheduledTime] = useState('');
    const [depActualTime, setDepActualTime] = useState('');
    const [arrScheduledTime, setArrScheduledTime] = useState('');
    const [arrActualTime, setArrActualTime] = useState('');
    const [economySeats, setEconomySeats] = useState('');
    const [economySeatAvailability, setEconomySeatAvailability] = useState([]);
    const [economyPrice, setEconomyPrice] = useState('');
    const [flightStatus, setFlightStatus] = useState('');
    const [flightDuration, setFlightDuration] = useState('');

    const handleFlightNumberChange = (e) => {
        setFlightNumber(e.target.value);
    }
    
    const handleDepAirportChange = (e) => {
        setDepAirport(e.target.value);
    }
    
    const handleArrAirportChange = (e) => {
        setArrAirport(e.target.value);
    }
    
    const handleDepScheduledTimeChange = (e) => {
        setDepScheduledTime(e.target.value);
    }
    
    const handleDepActualTimeChange = (e) => {
        setDepActualTime(e.target.value);
    }
    
    const handleArrScheduledTimeChange = (e) => {
        setArrScheduledTime(e.target.value);
    }
    
    const handleArrActualTimeChange = (e) => {
        setArrActualTime(e.target.value);
    }
    
    const handleEconomySeatsChange = (e) => {
        setEconomySeats(e.target.value);
    }
    
    const handleEconomySeatAvailabilityChange = (e) => {
        setEconomySeatAvailability(e.target.value.split(',').map(item => item.trim()));
    }
    
    const handleEconomyPriceChange = (e) => {
        setEconomyPrice(e.target.value);
    }
    
    const handleFlightStatusChange = (e) => {
        setFlightStatus(e.target.value);
    }
    
    const handleFlightDurationChange = (e) => {
        setFlightDuration(e.target.value);
    }

    const handleAddFlight = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://airline-management-2.onrender.com/api/flights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    departure: {
                        airportCity: depAirport,
                        scheduledTime: depScheduledTime,
                        actualTime: depActualTime
                    },
                    arrival: {
                        airportCity: arrAirport,
                        scheduledTime: arrScheduledTime,
                        actualTime: arrActualTime
                    },
                    flightNumber: flightNumber,
                    capacity: {
                        economySeats: economySeats
                    },
                    seatAvailability: {
                        economy: economySeatAvailability
                    },
                    price: {
                        economy: economyPrice
                    },
                    status: flightStatus,
                    duration: flightDuration
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to add flight: ${errorData.message || response.statusText}`);
            }
            resetFormFields(); 
        } catch (error) {
            console.error('Error adding flight:', error);
            alert(`Error adding flight: ${error.message}`);
        }
    };
    const resetFormFields = () => {
        setFlightNumber('');
        setDepAirport('');
        setArrAirport('');
        setDepScheduledTime('');
        setDepActualTime('');
        setArrScheduledTime('');
        setArrActualTime('');
        setEconomySeats('');
        setEconomySeatAvailability([]);
        setEconomyPrice('');
        setFlightStatus('');
        setFlightDuration('');
    };
    return (
        <div id="manage-flights-section" className="">
            {true && (
                <form id="daily-flight-form" className="" onSubmit={handleAddFlight}>
                    <h3>Add Flight</h3>
                    <label htmlFor="flight-number-daily">Flight Number:</label>
                    <input
                        type="text"
                        id="flight-number-daily"
                        name="flight-number-daily"
                        value={flightNumber}
                        onChange={handleFlightNumberChange}
                        required
                    />

                    <label htmlFor="dep-airport-daily">Departure AirportCity:</label>
                    <input
                        type="text"
                        id="dep-airport-daily"
                        name="dep-airport-daily"
                        value={depAirport}
                        onChange={handleDepAirportChange}
                        required
                    />

                    <label htmlFor="arr-airport-daily">Arrival AirportCity:</label>
                    <input
                        type="text"
                        id="arr-airport-daily"
                        name="arr-airport-daily"
                        value={arrAirport}
                        onChange={handleArrAirportChange}
                        required
                    />

                    <label htmlFor="dep-scheduled-time-daily">Departure Scheduled time:</label>
                    <input
                        type="datetime-local"
                        id="dep-scheduled-time-daily"
                        name="dep-scheduled-time-daily"
                        value={depScheduledTime}
                        onChange={handleDepScheduledTimeChange}
                        required
                    />

                    <label htmlFor="dep-actual-time-daily">Departure Actual time:</label>
                    <input
                        type="datetime-local"
                        id="dep-actual-time-daily"
                        name="dep-actual-time-daily"
                        value={depActualTime}
                        onChange={handleDepActualTimeChange}
                        required
                    />

                    <label htmlFor="arr-scheduled-time-daily">Arrival Scheduled time:</label>
                    <input
                        type="datetime-local"
                        id="arr-scheduled-time-daily"
                        name="arr-scheduled-time-daily"
                        value={arrScheduledTime}
                        onChange={handleArrScheduledTimeChange}
                        required
                    />

                    <label htmlFor="arr-actual-time-daily">Arrival Actual time:</label>
                    <input
                        type="datetime-local"
                        id="arr-actual-time-daily"
                        name="arr-actual-time-daily"
                        value={arrActualTime}
                        onChange={handleArrActualTimeChange}
                        required
                    />

                    <label htmlFor="economy-seats-daily">Economy Seats:</label>
                    <input
                        type="number"
                        id="economy-seats-daily"
                        name="economy-seats-daily"
                        value={economySeats}
                        onChange={handleEconomySeatsChange}
                        required
                    />

                    <label htmlFor="economy-seat-availability-daily">Economy Seat Availability (comma separated):</label>
                    <input
                        type="text"
                        id="economy-seat-availability-daily"
                        name="economy-seat-availability-daily"
                        value={economySeatAvailability.join(', ')}
                        onChange={handleEconomySeatAvailabilityChange}
                        required
                    />

                    <label htmlFor="economy-price-daily">Economy Price:</label>
                    <input
                        type="number"
                        id="economy-price-daily"
                        name="economy-price-daily"
                        value={economyPrice}
                        onChange={handleEconomyPriceChange}
                        required
                    />

                    <label htmlFor="flight-status-daily">Flight Status:</label>
                    <input
                        type="text"
                        id="flight-status-daily"
                        name="flight-status-daily"
                        value={flightStatus}
                        onChange={handleFlightStatusChange}
                        required
                    />

                    <label htmlFor="flight-duration-daily">Flight Duration (in minutes):</label>
                    <input
                        type="number"
                        id="flight-duration-daily"
                        name="flight-duration-daily"
                        value={flightDuration}
                        onChange={handleFlightDurationChange}
                        required
                    />
                    <button type="submit" id="submit-daily-flight-btn">
                        Add Flight
                    </button>
                </form>
            )}
        </div>
    )
}
