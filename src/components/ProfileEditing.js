import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ProfileEditing.css';
import config from './config';

function ProfileEditing() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    gender: '',
    sexual_orientation: '',
    height: '',
    body_type: '',
    eye_color: '',
    hair_color: '',
    hobbies: '',
    music_taste: '',
    movie_taste: '',
    book_taste: '',
    smoking_habits: '',
    drinking_habits: '',
    diet_preferences: '',
    about_me: '',
    search_for: '',
    relationship_type: ''
  });

  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      if (decodedToken.sub && decodedToken.sub.user_id) {
        setUserId(decodedToken.sub.user_id);
        console.log('Decoded user ID:', decodedToken.sub.user_id);
      } else {
        console.error('user_id not found in token');
      }
    } else {
      console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchProfileData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${config.apiUrl}/profile/edit`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('Fetched profile data:', response.data);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching profile data:', error);
          setMessage('Error fetching profile data');
        }
      };

      fetchProfileData();
    } else {
      console.log('User ID not set');
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Submitting form data:', formData);
      await axios.post(`${config.apiUrl}/profile/edit`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setMessage('Profile updated successfully');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      setMessage('Error updating profile');
      console.error('Error updating profile:', error.response ? error.response.data.error : error.message);
    }
  };

  return (
    <div className="profile-editing-container">
      <h2>Profile Editing</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Birth Date:</label>
          <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="diverse">Diverse</option>
          </select>
        </div>
        <div className="form-group">
          <label>Sexual Orientation:</label>
          <input type="text" name="sexual_orientation" value={formData.sexual_orientation} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Height:</label>
          <input type="text" name="height" value={formData.height} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Body Type:</label>
          <input type="text" name="body_type" value={formData.body_type} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Eye Color:</label>
          <input type="text" name="eye_color" value={formData.eye_color} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Hair Color:</label>
          <input type="text" name="hair_color" value={formData.hair_color} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Hobbies:</label>
          <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Music Taste:</label>
          <input type="text" name="music_taste" value={formData.music_taste} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Movie Taste:</label>
          <input type="text" name="movie_taste" value={formData.movie_taste} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Book Taste:</label>
          <input type="text" name="book_taste" value={formData.book_taste} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Smoking Habits:</label>
          <input type="text" name="smoking_habits" value={formData.smoking_habits} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Drinking Habits:</label>
          <input type="text" name="drinking_habits" value={formData.drinking_habits} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Diet Preferences:</label>
          <input type="text" name="diet_preferences" value={formData.diet_preferences} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>About Me:</label>
          <input type="text" name="about_me" value={formData.about_me} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Search For:</label>
          <input type="text" name="search_for" value={formData.search_for} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Relationship Type:</label>
          <input type="text" name="relationship_type" value={formData.relationship_type} onChange={handleChange} />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default ProfileEditing;
