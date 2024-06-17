import React, { useState } from 'react';
import '../admin.css';

const Admin2 = () => {
    const [viewAirportsSection, setViewAirportsSection] = useState(false);
    const [manageAirportsSection, setManageAirportsSection] = useState(false);
    const [airports, setAirports] = useState([]);
    const [viewCountry, setViewCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteAirportCity, setDeleteAirportCity] = useState('');
    const [newAirportName, setNewAirportName] = useState('');
    const [newAirportCode, setNewAirportCode] = useState('');
    const [newAirportCity, setNewAirportCity] = useState('');
    const [newAirportCountry, setNewAirportCountry] = useState('');
    const [deleteMessage, setDeleteMessage] = useState("");
    const [addMessage, setAddMessage] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);

    const fetchAirportsByCountry = async (countryName) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://airline-management-2.onrender.com/api/airports/country/${countryName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch airports');
            }
            const data = await response.json();
            setAirports(data);
            console.log(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAirports = () => {
        fetchAirportsByCountry(viewCountry);
    };

    const handleDeleteAirport = async (airportCity) => {
        try {
            const response = await fetch(`https://airline-management-2.onrender.com/api/airports/${airportCity}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to delete airport: ${errorData.message || response.statusText}`);
            }
    
            const updatedAirports = airports.filter(airport => airport.city !== airportCity);
            setAirports(updatedAirports);
            setDeleteMessage("Airport deleted successfully");
            setDeleteAirportCity('');
            setTimeout(() => setDeleteMessage(""), 3000); 
        } catch (error) {
            console.error('Error deleting airport:', error);
        }
    };

    const handleAddAirport = async () => {
        try {
            const response = await fetch('https://airline-management-2.onrender.com/api/airports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newAirportName,
                    code: newAirportCode,
                    city: newAirportCity,
                    country: newAirportCountry
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to add airport: ${errorData.message || response.statusText}`);
            }
            setAddMessage("Airport added successfully");
            setTimeout(() => setAddMessage(""), 3000); 
            setNewAirportName('');
            setNewAirportCode('');
            setNewAirportCity('');
            setNewAirportCountry('');
            const newAirport = await response.json();
            setAirports([...airports, newAirport]);
        } catch (error) {
            console.error('Error adding airport:', error);
        }
    };

    const handleDeleteSubmit = (e) => {
        e.preventDefault();
        handleDeleteAirport(deleteAirportCity);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        handleAddAirport();
    };

    const toggleViewAirportsSection = () => {
        setViewAirportsSection(true);
        setManageAirportsSection(false);
    };

    const toggleManageAirportsSection = () => {
        setManageAirportsSection(true);
        setViewAirportsSection(false);
    };

    const toggleAddForm = () => {
        setShowAddForm(true);
        setShowDeleteForm(false);
    };

    const toggleDeleteForm = () => {
        setShowDeleteForm(true);
        setShowAddForm(false);
    };

    const handleViewCountryChange = (e) => {
        setViewCountry(e.target.value);
    };

    const handleDeleteAirportCodeChange = (e) => {
        setDeleteAirportCity(e.target.value);
    };

    const handleNewAirportNameChange = (e) => {
        setNewAirportName(e.target.value);
    };

    const handleNewAirportCodeChange = (e) => {
        setNewAirportCode(e.target.value);
    };

    const handleNewAirportCityChange = (e) => {
        setNewAirportCity(e.target.value);
    };

    const handleNewAirportCountryChange = (e) => {
        setNewAirportCountry(e.target.value);
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
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
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
                    <tbody>
                        {airports.map(airport => (
                            <tr key={airport.code}>
                                <td>{airport.name}</td>
                                <td>{airport.code}</td>
                                <td>{airport.city}</td>
                                <td>{airport.country}</td>
                                <td>
                                    <button className="delete-btn" onClick={() => handleDeleteAirport(airport.city)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div id="manage-airports-section" className={manageAirportsSection ? '' : 'hidden_4'}>
                <h2>Manage Airports</h2>
                <button id="add-airport-btn" onClick={toggleAddForm}>Add Airport</button>
                <button id="delete-airport-btn" onClick={toggleDeleteForm}>Delete Airport</button>

                {showAddForm && (
                    <form id="airport-form" className={manageAirportsSection ? '' : 'hidden_4'} onSubmit={handleAddSubmit}>
                        <label htmlFor="airport-name">Airport Name:</label>
                        <input
                            type="text"
                            id="airport-name"
                            name="airport-name"
                            value={newAirportName}
                            onChange={handleNewAirportNameChange}
                            required
                        />

                        <label htmlFor="airport-code">Airport Code:</label>
                        <input
                            type="text"
                            id="airport-code"
                            name="airport-code"
                            value={newAirportCode}
                            onChange={handleNewAirportCodeChange}
                            required
                        />

                        <label htmlFor="city">City:</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={newAirportCity}
                            onChange={handleNewAirportCityChange}
                            required
                        />

                        <label htmlFor="country">Country:</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={newAirportCountry}
                            onChange={handleNewAirportCountryChange}
                            required
                        />
                        <button type="submit" id="submit-airport-btn">
                            Add Airport
                        </button>
                        {addMessage && <p className='message_2'>{addMessage}</p>}
                    </form>
                )}

                {showDeleteForm && (
                    <form id="delete-airport-form" className={manageAirportsSection ? '' : 'hidden_4'} onSubmit={handleDeleteSubmit}>
                        <label htmlFor="delete-airport-code">Airport City:</label>
                        <input
                            type="text"
                            id="delete-airport-city"
                            name="delete-airport-city"
                            value={deleteAirportCity}
                            onChange={handleDeleteAirportCodeChange}
                            required
                        />
                        <button type="submit" id="submit-delete-airport-btn">
                            Delete Airport
                        </button>
                        {deleteMessage && <p className='message_1'>{deleteMessage}</p>}
                    </form>
                )}
            </div>
        </div>
    );
};

export default Admin2;
