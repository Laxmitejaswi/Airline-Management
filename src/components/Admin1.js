import React, { useState, useEffect } from 'react';
import '../admin.css';

const Admin1 = () => {
    const [viewFlightsSection, setViewFlightsSection] = useState(true);
    const [manageFlightsSection, setManageFlightsSection] = useState(false);
    const [flights, setFlights] = useState([]);
    const [editingFlightNumber, setEditingFlightNumber] = useState(null);
    const [viewDate, setViewDate] = useState('');

    useEffect(() => {
        const storedFlights = JSON.parse(localStorage.getItem('flights')) || [];
        setFlights(storedFlights);
    }, []);

    const handleViewFlights = () => {
        const flightsOnSelectedDate = flights.filter(
            flight => flight.dep_sched_time.split('T')[0] === viewDate
        );
        return flightsOnSelectedDate.map(flight => (
            <tr key={flight.flightNumber}>
                <td>{flight.flightNumber}</td>
                <td>{flight.dep_airport}</td>
                <td>{flight.arr_airport}</td>
                <td>{flight.dep_sched_time}</td>
                <td>{flight.dep_actual_time}</td>
                <td>{flight.arr_sched_time}</td>
                <td>{flight.arr_actual_time}</td>
                <td>{flight.cost}</td>
                <td>
                    <button className="edit-btn" onClick={() => handleEditFlight(flight.flightNumber)}>
                        Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteFlight(flight.flightNumber)}>
                        Delete
                    </button>
                </td>
            </tr>
        ));
    };

    const handleEditFlight = flightNumber => {
        const flight = flights.find(flight => flight.flightNumber === flightNumber);
        if (flight) {
            setEditingFlightNumber(flight.flightNumber);
        }
        setViewFlightsSection(false);
        setManageFlightsSection(true);
    };

    const handleDeleteFlight = flightNumber => {
        const updatedFlights = flights.filter(flight => flight.flightNumber !== flightNumber);
        setFlights(updatedFlights);
        localStorage.setItem('flights', JSON.stringify(updatedFlights));
    };

    const toggleViewFlightsSection = () => {
        setViewFlightsSection(true);
        setManageFlightsSection(false);
    };

    const toggleManageFlightsSection = () => {
        setManageFlightsSection(true);
        setViewFlightsSection(false);
    };

    const handleViewDateChange = e => {
        setViewDate(e.target.value);
    };

    return (
        <div className="main_4">
            <nav className="nav_4">
                <button onClick={toggleViewFlightsSection}>View Flights</button>
                <button onClick={toggleManageFlightsSection}>Manage Flights</button>
            </nav>
            <div id="view-flights-section" className={viewFlightsSection ? '' : 'hidden_4'}>
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
                            <th>Departure Airport</th>
                            <th>Arrival Airport</th>
                            <th>Departure Scheduled time</th>
                            <th>Departure Actual time</th>
                            <th>Arrival Scheduled time</th>
                            <th>Arrival Actual time</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{handleViewFlights()}</tbody>
                </table>
            </div>
            <div id="manage-flights-section" className={manageFlightsSection ? '' : 'hidden_4'}>
                <h2>Manage Flights</h2>
                <button id="add-flight-btn" onClick={() => setEditingFlightNumber(null)}>Add Flight</button>
                <button id="delete-flight-btn" onClick={() => setEditingFlightNumber(null)}>Delete Flight</button>
                <form id="flight-form" className={manageFlightsSection ? '' : 'hidden_4'}>
                    <label htmlFor="flight-number">Flight Number:</label>
                    <input type="text" id="flight-number" name="flight-number" required />

                    <label htmlFor="departure">Departure Airport:</label>
                    <input type="text" id="dep_airport" name="departure" required />

                    <label htmlFor="arrival">Arrival Airport:</label>
                    <input type="text" id="arr_airport" name="arrival" required />

                    <label htmlFor="time">Departure Scheduled time:</label>
                    <input type="datetime-local" id="dep_sched_time" name="time" required />

                    <label htmlFor="time">Departure Actual time:</label>
                    <input type="datetime-local" id="dep_actual_time" name="time" required />

                    <label htmlFor="time">Arrival Scheduled time:</label>
                    <input type="datetime-local" id="arr_sched_time" name="time" required />

                    <label htmlFor="time">Arrival Actual time:</label>
                    <input type="datetime-local" id="arr_actual_time" name="time" required />

                    <label htmlFor="seats">Capacity:</label>
                    <input type="number" id="capacity" name="seats" required />

                    <label htmlFor="seats">Available seats:</label>
                    <input type="number" id="available_seats" name="seats" required />

                    <label htmlFor="cost">Cost:</label>
                    <input type="money" id="cost" name="cost" required />

                    <button type="submit" id="submit-flight-btn">
                        {editingFlightNumber ? 'Update Flight' : 'Add Flight'}
                    </button>
                </form>

                <form id="delete-form" className={manageFlightsSection ? '' : 'hidden_4'}>
                    <label htmlFor="delete-flight-number">Flight Number:</label>
                    <input type="text" id="delete-flight-number" name="delete-flight-number" required />
                    <button type="submit" id="submit-delete-btn">
                        Delete Flight
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Admin1;

