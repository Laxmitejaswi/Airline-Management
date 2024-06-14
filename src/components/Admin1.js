import React, { useState } from 'react';
import '../admin.css';
import Admin1_1 from './Admin1_1';
import Admin1_2 from './Admin1_2'
import Admin1_3 from './Admin1_3';
import Admin1_4 from './Admin1_4';
import Admin1_5 from './Admin1_5';
import Admin1_6 from './Admin1_6';

const Admin1 = () => {
    const [viewFlightsSection, setViewFlightsSection] = useState(false);
    const [manageFlightsSection, setManageFlightsSection] = useState(false);
    const [showAddDailyForm, setShowAddDailyForm] = useState(false);
    const [showAddWeeklyForm, setShowAddWeeklyForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [showAllFlights , setShowAllFlights] = useState(false);

    const toggleViewFlightsSection = () => {
        setViewFlightsSection(true);
        setManageFlightsSection(false);
        setShowAddDailyForm(false);
        setShowAddWeeklyForm(false);
        setShowDeleteForm(false);
        setShowAddForm(false);
        setShowAllFlights(false);
    };

    const toggleManageFlightsSection = () => {
        setManageFlightsSection(true);
        setViewFlightsSection(false);
        setShowAddDailyForm(false);
        setShowAddWeeklyForm(false);
        setShowDeleteForm(false);
        setShowAddForm(false);
        setShowAllFlights(false);
    };

    const toggleAddDailyForm = () => {
        setShowAddDailyForm(true);
        setShowAddWeeklyForm(false);
        setShowDeleteForm(false);
        setViewFlightsSection(false);
        setManageFlightsSection(true);
        setShowAddForm(false);
        setShowAllFlights(false);
    };

    const toggleAddWeeklyForm = () => {
        setShowAddWeeklyForm(true);
        setShowAddDailyForm(false);
        setShowDeleteForm(false);
        setViewFlightsSection(false);
        setManageFlightsSection(true);
        setShowAddForm(false);
        setShowAllFlights(false);
    };

    const toggleDeleteForm = () => {
        setShowDeleteForm(true);
        setShowAddDailyForm(false);
        setShowAddWeeklyForm(false);
        setViewFlightsSection(false);
        setManageFlightsSection(true);
        setShowAddForm(false);
        setShowAllFlights(false);
    };

    const toggleAddForm = () => {
        setShowDeleteForm(false);
        setShowAddDailyForm(false);
        setShowAddWeeklyForm(false);
        setViewFlightsSection(false);
        setManageFlightsSection(true);
        setShowAddForm(true);
        setShowAllFlights(false);
    };

    const toggleViewAllFlights = () => {
        setShowDeleteForm(false);
        setShowAddDailyForm(false);
        setShowAddWeeklyForm(false);
        setViewFlightsSection(false);
        setManageFlightsSection(false);
        setShowAddForm(false);
        setShowAllFlights(true);
    };
    return (
        <div className="main_4">
            <nav className="nav_4">
                <button onClick={toggleViewFlightsSection}>View Flights</button>
                <button onClick={toggleManageFlightsSection}>Manage Flights</button>
                <button id="view all-flight-btn" onClick={toggleViewAllFlights}>View All Flights</button>
            </nav>
            {viewFlightsSection && (
                <Admin1_1 />
            )}
            {showAllFlights && (
                <Admin1_6 />
            )}
            <div id="manage-flights-section" className={manageFlightsSection ? '' : 'hidden_4'}>
                <h2>Manage Flights</h2>
                <button id="add-flight-btn" onClick={toggleAddForm}>Add Flight</button>
                <button id="delete-flight-btn" onClick={toggleDeleteForm}>Delete Flight</button>
                <button id="add-daily-flight-btn" onClick={toggleAddDailyForm}>Add Daily Flights</button>
                <button id="add-weekly-flight-btn" onClick={toggleAddWeeklyForm}>Add Weekly Flights</button>
                {showAddForm && (
                    <Admin1_2 />
                )}
                {showAddDailyForm && (
                    <Admin1_3 />
                )}
                {showAddWeeklyForm && (
                    <Admin1_4 />
                )}
                {showDeleteForm && (
                    <Admin1_5 />
                )}
            </div>
        </div>
    );
};

export default Admin1;
