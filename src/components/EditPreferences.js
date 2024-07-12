import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './EditPreferences.css';
import config from './config';

function EditPreferences() {
  const [preferences, setPreferences] = useState({
    preferred_gender: '',
    preferred_age_min: '',
    preferred_age_max: '',
    preferred_education: '',
    preferred_smoking_habits: '',
    preferred_drinking_habits: '',
    preferred_diet_preferences: '',
    preferred_hobbies: '',
    preferred_values_and_beliefs: '',
    preferred_life_goals: '',
    preferred_communication_style: '',
    preferred_family_plan: '',
    preferred_financial_views: '',
    preferred_conflict_resolution_style: '',
    preferred_sexual_lifestyle: '',
    preferred_health_and_fitness: ''
  });
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
      const fetchPreferences = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${config.apiUrl}/get_preferences?user_id=${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setPreferences(response.data.preferences || {});
        } catch (error) {
          console.error('Error fetching preferences:', error.response ? error.response.data.error : error.message);
          setMessage('Error fetching preferences');
        }
      };

      fetchPreferences();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      await axios.post(`${config.apiUrl}/update_preferences`, preferences, { headers });
      setMessage('Preferences updated successfully');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error updating preferences:', error.response ? error.response.data.error : error.message);
      setMessage('Error updating preferences');
    }
  };

  return (
    <div className="edit-preferences-container">
      <h2>Edit Preferences</h2>
      <form onSubmit={handleSubmit}>
        <div className="preferences-list">
          {Object.keys(preferences).map((key) => (
            <div className="preference-item" key={key}>
              <label>{key.replace(/_/g, ' ')}:</label>
              <input
                type={key.includes('age') ? 'number' : 'text'}
                name={key}
                value={preferences[key] || ''}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        <button type="submit">Save Preferences</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default EditPreferences;
