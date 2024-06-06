import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="nav-left">
                <div className="nav-name">
                    <p>App Name</p>
                </div>
                <FontAwesomeIcon icon={faPlane} />
            </div>
            <div className="nav-right">
                <Link to="/">Book Flights</Link>
                <a href="">Check-in</a>
                <Link to="/login">Login</Link>
            </div>
        </div>
    );
};

export default Navbar;