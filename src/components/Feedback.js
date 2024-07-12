import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Feedback.css';
import config from './config';
import { jwtDecode } from 'jwt-decode';

function Feedback() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');
  const [userId, setUserId] = useState(null);


// Check for JWT token and decode it to get the user ID
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${config.apiUrl}/feedback`,
        {
          match_id: matchId,
          rating,
          comments,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        navigate('/matches'); // Navigate back to matches page after successful submission
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="feedback-container">
      <h1>Give Feedback</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </label>
        <label>
          Comments:
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}

export default Feedback;
