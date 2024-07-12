// src/components/ChatWindow.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ChatWindow.css';
import { jwtDecode } from 'jwt-decode';
import config from './config';

function ChatWindow() {
  const { chatId } = useParams();
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
      const response = await axios.post(`${config.apiUrl}/generate_message`, {
        prompt: newMessage,
        username: "hoa" // Assuming chatId is the username for personalized response
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log("Response from server:", response.data); // Debugging log

      const aiMessage = { id: messages.length + 2, sender: 'match', text: response.data.message };
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
    <div className="chat-window">
      <h2>Chat mit {chatId}</h2>
      <div className="messages">
        {messages.length === 0 ? (
          <p>Starten Sie die Konversation mit einer Frage...</p>
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
          placeholder="Nachricht eingeben..."
        />
        <button onClick={handleSendMessage}>Senden</button>
      </div>
    </div>
  );
}

export default ChatWindow;
