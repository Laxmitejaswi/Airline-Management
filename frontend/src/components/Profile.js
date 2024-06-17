import React from 'react';
import _Header from './ProfileHeader';
import '../profile.css';
import suitcase from './suitcase.webp';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Trips');
  };

  const username = localStorage.getItem('username');

  return (
    <div className='outerDiv'>
      <div className='container_1'>
        <_Header username={username} />
        <div className="profile-section" id="profile-section-id">
          <div id="my-trips-btn" className="btn-secondary" onClick={handleClick}>
            <img src={suitcase} alt="Suitcase" />
            <div className="text" >My Trips</div>
          </div>
          <Link to="/" id='nav' className='button2'>Book Flights</Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
