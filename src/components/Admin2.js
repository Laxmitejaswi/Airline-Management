import React, { useState, useEffect } from 'react';
import '../admin.css';

const Admin2 = () => {
    const [viewAirportsSection, setViewAirportsSection] = useState(true);
    const [manageAirportsSection, setManageAirportsSection] = useState(false);
    const [airports, setAirports] = useState([]);
    const [editingAirportCode, setEditingAirportCode] = useState(null);

    const [viewCountry, setViewCountry] = useState('');

    useEffect(() => {
        const storedAirports = JSON.parse(localStorage.getItem('airports')) || [];
        setAirports(storedAirports);
    }, []);

    const handleViewAirports = () => {
        const airportsInSelectedCountry = airports.filter(
            airport => airport.country === viewCountry
        );
        return airportsInSelectedCountry.map(airport => (
            <tr key={airport.airport_code}>
                <td>{airport.airport_name}</td>
                <td>{airport.airport_code}</td>
                <td>{airport.city}</td>
                <td>{airport.country}</td>
                <td>
                    <button className="edit-btn" onClick={() => handleEditAirport(airport.airport_code)}>
                        Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteAirport(airport.airport_code)}>
                        Delete
                    </button>
                </td>
            </tr>
        ));
    };

    const handleEditAirport = airportCode => {
        const airport = airports.find(airport => airport.airport_code === airportCode);
        if (airport) {
            setEditingAirportCode(airport.airport_code);
        }
        setViewAirportsSection(false);
        setManageAirportsSection(true);
    };

    const handleDeleteAirport = airportCode => {
        const updatedAirports = airports.filter(airport => airport.airport_code !== airportCode);
        setAirports(updatedAirports);
        localStorage.setItem('airports', JSON.stringify(updatedAirports));
    };

    const toggleViewAirportsSection = () => {
        setViewAirportsSection(true);
        setManageAirportsSection(false);
    };

    const toggleManageAirportsSection = () => {
        setManageAirportsSection(true);
        setViewAirportsSection(false);
    };

    const handleViewCountryChange = e => {
        setViewCountry(e.target.value);
    };

    return (
        <div className="main_4">
            <nav className="nav_4">
                <button onClick={toggleViewAirportsSection}>View Airports</button>
                <button onClick={toggleManageAirportsSection}>Manage Airports</button>
            </nav>
            <div id="view-airports-section" className={viewAirportsSection ? '' : 'hidden_4'}>
                <h2>Available Airports</h2>
                <div className="setting">
                <label htmlFor="view-country" className='label'>Select Country :</label>
                <input
                    type="text"
                    id="view-country"
                    name="view-country"
                    value={viewCountry}
                    onChange={handleViewCountryChange}
                    required
                />
                <button id="view-airports-submit-btn" onClick={handleViewAirports}>
                    View Airports
                </button>
                </div>
                <table id="airports-table">
                    <thead>
                        <tr>
                            <th>Airport Name</th>
                            <th>Airport Code</th>
                            <th>City</th>
                            <th>Country</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{handleViewAirports()}</tbody>
                </table>
            </div>

            <div id="manage-airports-section" className={manageAirportsSection ? '' : 'hidden_4'}>
                <h2>Manage Airports</h2>
                <button id="add-airport-btn" onClick={() => setEditingAirportCode(null)}>Add Airport</button>
                <button id="delete-airport-btn" onClick={() => setEditingAirportCode(null)}>Delete Airport</button>

                <form id="airport-form" className={manageAirportsSection ? '' : 'hidden_4'}>
                    <label htmlFor="airport-name">Airport Name:</label>
                    <input type="text" id="airport-name" name="airport-name" required />

                    <label htmlFor="airport-code">Airport Code:</label>
                    <input type="text" id="airport-code" name="airport-code" required />

                    <label htmlFor="city">City:</label>
                    <input type="text" id="city" name="city" required />

                    <label htmlFor="country">Country:</label>
                    <input type="text" id="country" name="country" required />

                    <button type="submit" id="submit-airport-btn">
                        {editingAirportCode ? 'Update Airport' : 'Add Airport'}
                    </button>
                </form>

                <form id="delete-airport-form" className={manageAirportsSection ? '' : 'hidden_4'}>
                    <label htmlFor="delete-airport-code">Airport Code:</label>
                    <input type="text" id="delete-airport-code" name="delete-airport-code" required />
                    <button type="submit" id="submit-delete-airport-btn">
                        Delete Airport
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Admin2;
