import React from 'react';
import rightArrow from './Right arrow.png';
import '../profile.css';
import { useNavigate } from 'react-router-dom';

const _Header = ({ username }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/');
  }
  const handleProfile = (event) => {
    event.preventDefault();
    navigate('/ProfileDetails');
  };

  return (
    <div id="heading_2">
      <h1 className="page-heading">Welcome, {username}</h1>
      <div className="viewprofile">
        <button id="view-profile-btn" className="btn-primary" onClick={handleProfile}>
          VIEW PROFILE
        </button>
        <img src={rightArrow} alt="Right Arrow" />
      </div>
    </div>
  );
};

export default _Header;
