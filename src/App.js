import React, { useState } from 'react';
import './App.css';
import FlightBooking from './components/FlightBooking';
import Flightselect from './Flightselect';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import Navbar from './components/Navbar';
import FlightDetails from './components/FlightDetails';
import SeatSelection from './components/SeatSelection';
import Confirmation from './components/Confirmation';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <Router>
            <div>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <Routes>
                    <Route exact path="/" element={<FlightBooking />} />
                    <Route exact path="/FlightSelect" element={<Flightselect isLoggedIn={isLoggedIn}/>} />
                    <Route exact path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}/>} />
                    <Route exact path="/FlightDetails" element={<FlightDetails/>} />
                    <Route exact path="/SeatSelection" element={<SeatSelection />} />
                    <Route exact path="/Confirmation" element={<Confirmation />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
