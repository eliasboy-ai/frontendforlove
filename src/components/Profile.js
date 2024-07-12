// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Profile.css';
import config from './config';

function Profile() {
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.sub && decodedToken.sub.user_id) {
        setUserId(decodedToken.sub.user_id);
      } else {
        console.error('user_id not found in token');
      }
    } else {
      console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchProfileImage = async () => {
        try {
          const response = await axios.get(`${config.apiUrl}/get_profile_image?user_id=${userId}`, { responseType: 'arraybuffer' });
          if (response.data) {
            const imageBlob = new Blob([response.data], { type: response.headers['content-type'] });
            const imageUrl = URL.createObjectURL(imageBlob);
            setProfileImage(imageUrl);
          }
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      };

      fetchProfileImage();
    }
  }, [userId]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios.post(`${config.apiUrl}/upload_profile_pic`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    })
    .catch(error => {
      console.error('Error uploading profile picture:', error.response ? error.response.data.error : error.message);
    });
  };

  const handleProfileImageClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleEditProfile = () => {
    navigate('/profile-editing');
  };

  const handleEditPreferences = () => {
    navigate('/edit-preferences');
  };

  const handleTrainAI = () => {
    navigate('/train-ai');
  };

  const handleImportChat = () => {
    navigate('/chat-upload');
  };

  const handleTrainAI2 = () => {
    navigate('/train-ai-2');
  };

  return (
    <div className="profile-container">
      <div className="image-placeholder" onClick={handleProfileImageClick} style={{ cursor: 'pointer' }}>
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="profile-image" />
        ) : (
          <div className="placeholder-icon">Bild hochladen</div>
        )}
      </div>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      <button className="profile-button" onClick={handleEditProfile}>
        Edit Userinfo
      </button>
      <button className="profile-button" onClick={handleEditPreferences}>
        Edit Preference
      </button>
      <button className="profile-button" onClick={handleTrainAI}>
        Train your AI
      </button>
      <button className="profile-button" onClick={handleTrainAI2}>
        Train your AI 2
      </button>
      <button className="profile-button" onClick={handleImportChat}>
        Import Chat
      </button>
    </div>
  );
}

export default Profile;
