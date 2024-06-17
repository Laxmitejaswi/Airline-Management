import React, { useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (token) {
            setIsLoggedIn(true);
        }
    }, []); 

    return (
        <div className="navbar-container">
            <div className="navbar">
                <div className="nav-left">
                    <div className="nav-name">
                        <p>Airlines</p>
                    </div>
                    <FontAwesomeIcon icon={faPlane} />
                </div>
                <div className="nav-right">
                    <Link to="/">Book Flights</Link>
                    <Link to="/FlightStatus">Flight Status</Link>
                    <Link to="/CheckIn">Check-in</Link>
                    <Link to="/Reviews_Ratings">Ratings & Reviews</Link>
                    <Link to="/RR">Submit Feedback</Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/Profile">My Profile</Link>
                            <a onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
