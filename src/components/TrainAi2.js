import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './TrainAi2.css';
import config from './config';

function TrainAi2() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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

  const handleSendMessage = async () => {
    const userMessage = { id: messages.length + 1, sender: 'user', text: newMessage };
    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Call backend API to get the response from the AI model
    try {
      const response = await axios.post(`${config.apiUrl}/openai`, {
        prompt: newMessage,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log("Response from server:", response.data); // Debugging log

      const aiMessage = { id: messages.length + 2, sender: 'ai', text: response.data.response };
      setMessages([...messages, userMessage, aiMessage]);
    } catch (error) {
      console.error('Error generating message:', error);

      // Log the error response from the server for debugging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      }
    }
  };

  return (
    <div className="train-ai-2-container">
      <h2>Train your AI 2</h2>
      <div className="messages">
        {messages.length === 0 ? (
          <p>Start the conversation with a prompt...</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          ))
        )}
      </div>
      <div className="new-message">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter your prompt..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default TrainAi2;
