import React from 'react';
import Admin1 from './Admin1';
import Admin2 from './Admin2';
import '../admin.css';

const Admin = () => {
    return (
        <div>
            <div class="header_4">
                <h1>Flight Booking System Admin</h1>
            </div>
            <Admin1 />
            <Admin2 />
        </div>
    );
};

export default Admin;
