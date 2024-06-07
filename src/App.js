import React, { useState } from 'react';
import './App.css';
import FlightBooking from './components/FlightBooking';
import Flightselect from './Flightselect';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Navbar from './components/Navbar';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Router>
            <div>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <Routes>
                    <Route exact path="/" element={<FlightBooking />} />
                    <Route exact path="/FlightSelect" element={<Flightselect />} />
                    <Route exact path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
