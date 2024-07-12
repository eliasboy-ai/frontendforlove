// src/components/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import config from './config';

function Home() {
  const [matches, setMatches] = useState([]);
  const [profileImages, setProfileImages] = useState({});
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
      const fetchMatches = async () => {
        try {
          const response = await axios.post(
            `${config.apiUrl}/match`,
            {}, // Add search parameters here if needed
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data) {
            setMatches(response.data);
            response.data.forEach(match => fetchProfileImage(match.user_id));
          }
        } catch (error) {
          console.error('Error fetching matches:', error);
        }
      };

      fetchMatches();
    }
  }, [userId]);

  const fetchProfileImage = async (id) => {
    try {
      const response = await axios.get(`${config.apiUrl}/get_profile_image?user_id=${id}`, { responseType: 'arraybuffer' });
      if (response.data) {
        const imageBlob = new Blob([response.data], { type: response.headers['content-type'] });
        const imageUrl = URL.createObjectURL(imageBlob);
        setProfileImages(prevImages => ({ ...prevImages, [id]: imageUrl }));
      } else {
        setProfileImages(prevImages => ({ ...prevImages, [id]: null }));
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
      setProfileImages(prevImages => ({ ...prevImages, [id]: null }));
    }
  };

  const handleStartChatting = (match) => {
    navigate('/chat', { state: { match } });
  };

  const handleFeedbackClick = (matchId) => {
    navigate(`/feedback/${matchId}`);
  };

  return (
    <div className="home-container">
      <h1>Matches</h1>
      {matches.length === 0 ? (
        <p>Matches are loading...</p>
      ) : (
        <div className="matches-container">
          {matches.map((match, index) => (
            <div key={index} className="match-box">
              <div className="image-placeholder">
                {profileImages[match.user_id] ? (
                  <img src={profileImages[match.user_id]} alt="Profile" className="profile-pic" />
                ) : (
                  <div className="placeholder-icon">No Image</div>
                )}
              </div>
              <div className="match-info">
                <p>Name: {match.name}</p>
                <p>Age: {match.age}</p>
                <p>Rating: {match.rating}</p>
                <p>Reason: {match.reason}</p>
                <button onClick={() => handleStartChatting(match)}>Start Chatting</button>
                <button onClick={() => handleFeedbackClick(match.id)}>Give Feedback</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;