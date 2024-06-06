import React from 'react';
import './App.css';
import Home from './components/home'
import Flightselect from './Flightselect';
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route exact path="/" element={<Home/>}/>
                    <Route exact path='/FlightSelect' element = {<Flightselect/>}/>
                </Routes>
            </div>
        </Router>
    );
};

export default App;