import React, { useState } from 'react';
import '../admin.css';

export default function Admin1_1() {
    const [viewDate, setViewDate] = useState('');
    const [flights, setFlights] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editFlightDetails, setEditFlightDetails] = useState({
        flightNumber: '',
        departureScheduledTime: '',
        departureAirportCity: '',
        arrivalScheduledTime: '',
        arrivalAirportCity: '',
        departureActualTime: '',
        arrivalActualTime: '',
        FlightStatus: ''
    });

    const formatDateTimeLocal = (dateTime) => {
        const date = new Date(dateTime);
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    const handleViewDateChange = (e) => {
        setViewDate(e.target.value);
    };

    const handleViewFlights = async () => {
        try {
            const response = await fetch(`https://airline-management-2.onrender.com/api/flightsbyDate?startDate=${viewDate}`);
            if (!response.ok) {
                throw new Error('Failed to fetch flights');
            }
            const flightsData = await response.json();
            setFlights(flightsData);
        } catch (error) {
            console.error('Error fetching flights:', error);
            setFlights([]);
        }
    };

    const handleEditFlight = (flight) => {
        setEditFlightDetails({
            flightNumber: flight.flightNumber,
            departureScheduledTime: flight.departure.scheduledTime,
            departureAirportCity: flight.departure.airportCity,
            arrivalScheduledTime: flight.arrival.scheduledTime,
            arrivalAirportCity: flight.arrival.airportCity,
            departureActualTime: flight.departure.actualTime,
            arrivalActualTime: flight.arrival.actualTime,
            FlightStatus: flight.status
        });
        setEditModalVisible(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFlightDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleUpdateFlight = async () => {
        const { flightNumber, departureScheduledTime, arrivalScheduledTime, FlightStatus } = editFlightDetails;
        const updatedFlight = {
            departure: {
                airportCity: editFlightDetails.departureAirportCity,
                scheduledTime: new Date(departureScheduledTime).toISOString(),
                actualTime: editFlightDetails.departureActualTime
            },
            arrival: {
                airportCity: editFlightDetails.arrivalAirportCity,
                scheduledTime: new Date(arrivalScheduledTime).toISOString(),
                actualTime: editFlightDetails.arrivalActualTime
            },
            status: FlightStatus
        };

        try {
            const response = await fetch(`https://airline-management-2.onrender.com/api/flights/${flightNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedFlight)
            });

            if (!response.ok) {
                throw new Error('Failed to update flight');
            }

            setFlights(prevFlights => prevFlights.map(flight =>
                flight.flightNumber === flightNumber
                    ? {
                        ...flight,
                        departure: {
                            ...flight.departure,
                            airportCity: editFlightDetails.departureAirportCity,
                            scheduledTime: new Date(departureScheduledTime).toISOString(),
                            actualTime: editFlightDetails.departureActualTime,
                        },
                        arrival: {
                            ...flight.arrival,
                            airportCity: editFlightDetails.arrivalAirportCity,
                            scheduledTime: new Date(arrivalScheduledTime).toISOString(),
                            actualTime: editFlightDetails.arrivalActualTime
                        },
                        status: FlightStatus
                    }
                    : flight
            ));

            setEditModalVisible(false);
        } catch (error) {
            console.error('Error updating flight:', error);
        }
    };

    const handleDeleteFlight = async (flightNumber) => {
        try {
            const response = await fetch(`https://airline-management-2.onrender.com/api/flights/cancel/${flightNumber}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete flight');
            }
            setFlights(flights.filter(flight => flight.flightNumber !== flightNumber));
        } catch (error) {
            console.error('Error deleting flight:', error);
        }
    };

    const renderFlights = () => {
        return flights.map(flight => (
            <tr key={flight.flightNumber}>
                <td>{flight.flightNumber}</td>
                <td>{flight.departure.airportCity}</td>
                <td>{flight.arrival.airportCity}</td>
                <td>{new Date(flight.departure.scheduledTime).toLocaleString()}</td>
                <td>{new Date(flight.departure.actualTime).toLocaleString()}</td>
                <td>{new Date(flight.arrival.scheduledTime).toLocaleString()}</td>
                <td>{new Date(flight.arrival.actualTime).toLocaleString()}</td>
                <td>{flight.price.economy}</td>
                <td>{flight.status}</td>
                <td>{flight.duration} mins</td>
                <td className='group_1'>
                    <button className="edit-btn" onClick={() => handleEditFlight(flight)}>
                        Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteFlight(flight.flightNumber)}>
                        Delete
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <div>
            <div id="view-flights-section" className="">
                <h2>Flights on a Particular Day</h2>
                <div className="setting">
                    <label htmlFor="view-date" className='label'>Select Date :</label>
                    <input
                        type="date"
                        id="view-date"
                        name="view-date"
                        value={viewDate}
                        onChange={handleViewDateChange}
                        required
                    />
                    <button id="view-flights-submit-btn" onClick={handleViewFlights}>
                        View Flights
                    </button>
                </div>
                <table id="flights-table">
                    <thead>
                        <tr>
                            <th>Flight Number</th>
                            <th className='group'><p>Departure</p> <p className='down'>Airport</p></th>
                            <th className='group'><p>Arrival</p> <p className='down'>Airport</p></th>
                            <th className='group'><p>Departure</p> <p className='down'>Scheduled time</p></th>
                            <th className='group'><p>Departure</p> <p className='down'>Actual time</p></th>
                            <th className='group'><p>Arrival</p> <p className='down'>Scheduled time</p></th>
                            <th className='group'><p>Arrival</p> <p className='down'>Actual time</p></th>
                            <th>Cost</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{renderFlights()}</tbody>
                </table>
            </div>

            {editModalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Flight</h2>
                        <label>
                            Departure Scheduled Time :
                            <input
                                type="datetime-local"
                                name="departureScheduledTime"
                                value={formatDateTimeLocal(editFlightDetails.departureScheduledTime)}
                                onChange={handleEditChange}
                                className='left_4'
                            />
                        </label>
                        <label>
                            Arrival Scheduled Time :
                            <input
                                type="datetime-local"
                                name="arrivalScheduledTime"
                                value={formatDateTimeLocal(editFlightDetails.arrivalScheduledTime)}
                                onChange={handleEditChange}
                                className='left_4'
                            />
                        </label>
                        <label>
                            Flight Status :
                            <input
                                type="text"
                                name="FlightStatus"
                                value={editFlightDetails.FlightStatus}
                                onChange={handleEditChange}
                                className='left_4'
                            />
                        </label>
                        <button onClick={handleUpdateFlight}>Update</button>
                        <button onClick={() => setEditModalVisible(false)}>Go Back</button>
                    </div>
                </div>
            )}
        </div>
    )
}
