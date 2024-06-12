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
    const [seatSelected , setSeat] = useState(null);
    const [passengerDetails , setPassengerDetails] = useState({});
    return (
        <Router>
            <div>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <Routes>
                    <Route exact path="/" element={<FlightBooking />} />
                    <Route exact path="/FlightSelect" element={<Flightselect isLoggedIn={isLoggedIn}/>} />
                    <Route exact path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                    <Route exact path="/FlightDetails" element={<FlightDetails setPassengerDetails = {setPassengerDetails} />} />
                    <Route exact path="/SeatSelection" element={<SeatSelection setSeat = {setSeat} seatSelected = {seatSelected}/>} />
                    <Route exact path="/Confirmation" element={<Confirmation seatSelected={seatSelected} passengerDetails={passengerDetails} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
