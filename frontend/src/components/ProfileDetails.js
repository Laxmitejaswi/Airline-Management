import React, { useState, useEffect } from 'react';
import leftArrow from './Left arrow.png';
import '../profile.css';
import { useNavigate } from 'react-router-dom';

const ProfileDetails = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    phoneNumber: '',
    email: ''
  });
  const [isEditable, setIsEditable] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const UserName = localStorage.getItem('username');

  useEffect(() => {
    fetchProfileData();
  }, [UserName]);

  const fetchProfileData = () => {
    fetch(`https://airline-management-2.onrender.com/api/passengers/${UserName}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched profile data:', data);
        const { name, username, contact, email } = data;
        setProfileData({
          name: name || '',
          username: username || '',
          phoneNumber: contact || '',
          email: email || ''
        });
      })
      .catch(error => {
        console.error('Error fetching the profile data:', error);
      });
  };

  const handleBack = () => {
    navigate('/Profile');
  };

  const toggleEdit = () => {
    if (isEditable) {
      fetch(`https://airline-management-2.onrender.com/api/passengers/${UserName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          username: profileData.username,
          contact: profileData.phoneNumber,
          email: profileData.email,
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Profile update response:', data);
          localStorage.setItem('username', profileData.username);
          setUpdateMessage('Profile updated successfully!');
          setTimeout(() => setUpdateMessage(''), 3000); 
        })
        .catch(error => {
          console.error('Error updating the profile:', error);
          setUpdateMessage('Failed to update profile. Please try again.');
          setTimeout(() => setUpdateMessage(''), 3000); 
        });
    }
    setIsEditable(!isEditable);
  };

  const handleUsernameClick = () => {
    if (isEditable) {
      setUpdateMessage('Username cannot be editable');
      setTimeout(() => setUpdateMessage(''), 3000); 
    }
  };

  return (
    <div className='outerDiv'>
      <div className='container_1'>
        <div className="profile-details" id="profile-details">
          <div className="profile-header">
            <button id="back-to-main-btn-p" className="back">
              <img src={leftArrow} alt="Left Arrow" onClick={handleBack} />
            </button>
            <h1>Profile Details</h1>
          </div>
          <div className="details">
            <div className="detail-item">
              <label htmlFor="profile-name">Name:</label>
              <input 
                type="text" 
                id="profile-name" 
                placeholder='Name' 
                value={profileData.name} 
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                required 
                readOnly={!isEditable} 
              />
            </div>
            <div className="detail-item">
              <label htmlFor="profile-username">Username:</label>
              <input 
                type="text" 
                id="profile-username" 
                placeholder='Username' 
                value={profileData.username} 
                onClick={handleUsernameClick}
                readOnly
              />
            </div>
            <div className="detail-item">
              <label htmlFor="profile-mobile">Phone Number:</label>
              <input 
                type="text" 
                id="profile-mobile" 
                placeholder='Phone Number' 
                value={profileData.phoneNumber} 
                onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                required 
                readOnly={!isEditable} 
              />
            </div>
            <div className="detail-item">
              <label htmlFor="profile-email">Email:</label>
              <input 
                type="email" 
                id="profile-email" 
                placeholder="Email ID" 
                value={profileData.email} 
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                required 
                readOnly={!isEditable} 
              />
            </div>
            {updateMessage && <p className="update-message">{updateMessage}</p>}
            <button 
              id="save-profile-btn" 
              className="save" 
              onClick={toggleEdit}
            >
              {isEditable ? 'Update Profile' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
