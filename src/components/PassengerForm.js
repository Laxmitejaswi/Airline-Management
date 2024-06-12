import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PassengerForm = ({setPassengerDetails}) => {
    const [title, setTitle] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [emailId, setEmailId] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [message , setMessage] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!title) {
            setMessage('Please Select Title !');
        }else{
            const newPassenger = { title, firstName, lastName, phoneNum, emailId };
            setPassengerDetails(newPassenger);
            console.log(newPassenger);
            navigate('/SeatSelection');
        }
    };

    return (
        <section id="passengerDetails">
            <form id="passengerForm" onSubmit={handleSubmit}>
                <h2>Traveller Details</h2>
                <div className="traveller-details">
                    <div className="salutation">
                        <div className="select-option" onClick={() => setShowOptions(!showOptions)}>
                            <input
                                type="text"
                                placeholder="Title"
                                id="title"
                                readOnly
                                value={title}
                                required
                            />
                        </div>
                        {showOptions && (
                            <div className="content">
                                <ul className="options">
                                    {['Mr.', 'Ms.', 'Mrs.'].map((option) => (
                                        <li key={option} onClick={() => { setTitle(option); setShowOptions(false); }}>{option}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="name">
                        <div className="first-name">
                            <input
                                type="text"
                                placeholder="Firstname"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="last-name">
                            <input
                                type="text"
                                placeholder="Lastname"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
                <h2>Contact Details</h2>
                <div className="contact-details">
                    <div className="phone-num">
                        <input
                            type="text"
                            placeholder="Phone Number"
                            id="phoneNum"
                            value={phoneNum}
                            onChange={(e) => setPhoneNum(e.target.value)}
                            required
                        />
                    </div>
                    <div className="email">
                        <input
                            type="text"
                            placeholder="Email Id"
                            id="emailId"
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <button type="submit" className='button2'>Select Seat</button>
                <div className='message'>{message}</div>
            </form>
        </section>
    );
};

export default PassengerForm;
