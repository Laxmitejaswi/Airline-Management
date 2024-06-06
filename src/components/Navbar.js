import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';

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
                <a href="">Book Flights</a>
                <a href="">Check-in</a>
                <a href="">Flight Status</a>
                <a href="">Login</a>
            </div>
        </div>
    );
};

export default Navbar;