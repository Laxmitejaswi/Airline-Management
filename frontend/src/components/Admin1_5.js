import React, { useState } from 'react';
import '../admin.css';

export default function Admin1_5() {
    const [flightNumberToDelete, setFlightNumberToDelete] = useState('');

    const handleInputChange = (e) => {
        setFlightNumberToDelete(e.target.value);
    };

    const handleDeleteFlight = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://airline-management-2.onrender.com/api/flights/cancel/${flightNumberToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete flight');
            }
            setFlightNumberToDelete('');
        } catch (error) {
            console.error('Error deleting flight:', error);
        }
    };

    return (
        <div className="main_4">
            <h3>Delete Flight</h3>
            <form onSubmit={handleDeleteFlight}>
                <div className='delete_4'>
                    <label htmlFor="flight-number" id="add">Flight Number :</label>
                    <input
                        type="text"
                        id="flight-number"
                        value={flightNumberToDelete}
                        onChange={handleInputChange}
                        placeholder='Enter Flight Number'
                        required
                    />
                </div>
                <button type="submit" className="delete-btn">
                    Delete Flight
                </button>
            </form>
        </div>
    );
}
