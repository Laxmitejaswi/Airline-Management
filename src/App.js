import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import FlightBooking from './components/FlightBooking';
import Flightselect from './Flightselect';
import LoginPage from './LoginPage';
import Navbar from './components/Navbar';
import FlightDetails from './components/FlightDetails';
import SeatSelection from './components/SeatSelection';
import Confirmation from './components/Confirmation';
import Profile from './components/Profile';
import ProfileDetails from './components/ProfileDetails';
import Trips from './components/Trips';
import CheckIn from './components/CheckIn';
import ReviewForm from './components/ReviewForm'
import Reviews from './components/Review';
import Admin from './components/Admin';
import FlightStatus from './components/FlightStatus';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Router>
            <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </Router>
    );
};

const AppContent = ({ isLoggedIn, setIsLoggedIn }) => {
    const location = useLocation();
    const hideNavbarPaths = ['/Profile', '/ProfileDetails', '/Trips' , '/CheckIn' , '/RR' , '/Reviews_Ratings' , '/Admin' , '/FlightStatus'].map(path => path.toLowerCase());
    const currentPath = location.pathname.replace(/\/+$/, '').toLowerCase();
    const hideNavbar = hideNavbarPaths.includes(currentPath);

    return (
        <div>
            {!hideNavbar && <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
            <Routes>
                <Route exact path="/" element={<FlightBooking />} />
                <Route exact path="/FlightSelect" element={<Flightselect isLoggedIn={isLoggedIn} />} />
                <Route exact path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                <Route exact path="/FlightDetails" element={<FlightDetails />} />
                <Route exact path="/SeatSelection" element={<SeatSelection />} />
                <Route exact path="/Confirmation" element={<Confirmation />} />
                <Route exact path="/Profile" element={<Profile />} />
                <Route exact path="/ProfileDetails" element={<ProfileDetails />} />
                <Route exact path="/Trips" element={<Trips />} />
                <Route exact path='/CheckIn' element={<CheckIn/>} />
                <Route exact path='/RR' element={<ReviewForm/>} />
                <Route exact path='/Reviews_Ratings' element={<Reviews/>} />
                <Route exact path='/Admin' element={<Admin/>} />
                <Route exact path='/FlightStatus' element={<FlightStatus/>} />
            </Routes>
        </div>
    );
};

export default App;
