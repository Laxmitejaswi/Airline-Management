import React, { useState , useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import CustomSelect from './CustomSelect';
import { useNavigate } from 'react-router-dom';

const FlightBooking = () => {
    const [from, setFrom] = useState('Select a City');
    const [to, setTo] = useState('Select a City');
    const [showFromOptions, setShowFromOptions] = useState(false);
    const [showToOptions, setShowToOptions] = useState(false);
    const [ways, setWays] = useState('One way');
    const [fromSearch, setFromSearch] = useState('');
    const [toSearch, setToSearch] = useState('');
    const [departDate, setDepartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [cities, setCities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('https://airline-management-2.onrender.com/api/airports');
                const data = await response.json();
                const cityNames = data.map(airport => airport.city);
                setCities(cityNames);
            } catch (error) {
                console.error('Error fetching cities:', error);
                setErrorMessage('There was an error fetching the city data. Please try again later.');
            }
        };

        fetchCities();
    }, []);

    const filteredFromCities = cities.filter(city => city.toLowerCase().includes(fromSearch.toLowerCase()));
    const filteredToCities = cities.filter(city => city.toLowerCase().includes(toSearch.toLowerCase()));
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (from === 'Select a City' || to === 'Select a City' || !departDate || !ways) {
            setErrorMessage("Please fill in all the required fields !!");
            return;
        }
        try {
            fetch(`https://airline-management-2.onrender.com/api/flightsavailable?from=${from}&to=${to}&startDate=${departDate}&endDate=${returnDate}&tripType=${ways}`)
                .then((response) => response.json())
                .then((data) => {
                    localStorage.setItem('flightSearchResults', JSON.stringify(data));
                    navigate('/Flightselect');
                })
                .catch((error) => {
                    console.error('Error fetching flight data:', error);
                    setErrorMessage('There was an error fetching the flight data. Please try again later.');
                });
        } catch (error) {
            console.error('Unexpected error:', error);
            setErrorMessage('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="flight-booking">
            <div className="heading">
                <h1>Flight Booking</h1>
            </div>
            <div className="main-box">
                <div className="upper-part">
                    <div className="trips">
                        <FontAwesomeIcon icon={faArrowRight} />
                        <select id="ways" value={ways} onChange={(e) => setWays(e.target.value)}>
                            <option value="one way">One way</option>
                            {/* <option value="Round trip">Round trip</option> */}
                        </select>
                    </div>
                </div>
                <form id="form" onSubmit={handleSubmit}>
                    <div className="lower-part-1">
                        <CustomSelect
                            label="From"
                            selected={from}
                            setSelected={setFrom}
                            showOptions={showFromOptions}
                            setShowOptions={setShowFromOptions}
                            search={fromSearch}
                            setSearch={setFromSearch}
                            filteredCities={filteredFromCities}
                        />
                        <FontAwesomeIcon icon={faArrowRightArrowLeft} className="double-arrow" />
                        <CustomSelect
                            label="To"
                            selected={to}
                            setSelected={setTo}
                            showOptions={showToOptions}
                            setShowOptions={setShowToOptions}
                            search={toSearch}
                            setSearch={setToSearch}
                            filteredCities={filteredToCities}
                        />
                    </div>
                    <div className="date-box">
                        <span className="date-label">Travel Date :</span>
                        <input
                            type="date"
                            className="date-field"
                            value={departDate}
                            onChange={(e) => setDepartDate(e.target.value)}
                        />
                        {/* <span className="date-field" id="minus">-</span>
                        <input
                            type="date"
                            className="date-field"
                            placeholder="Add return trip"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                        /> */}
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <button type="submit" className="search-button">Search Flight</button>
                </form>
            </div>
        </div>
    );
};

export default FlightBooking;
