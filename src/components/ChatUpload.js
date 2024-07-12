import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ChatUpload.css';
import config from './config';
function ChatUpload() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);

 try {
      setIsUploading(true); // Hochladen beginnt
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No token found. Please log in.');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      const response = await axios.post(`${config.apiUrl}/upload_whatsapp_chat`, formData, { headers });
      setMessage(response.data.message);
      setIsUploading(false);

          // Starte das Modelltraining nach dem erfolgreichen Upload
      //    await startModelTraining(token);

      setTimeout(() => {
        navigate('/profile'); // Redirect to profile after upload
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      setMessage(error.response ? error.response.data.error : error.message);
    }
  };

  return (
    <div className="chat-upload-container">
      <h2>Upload WhatsApp Chat</h2>
      <div className="instructions">
        <h3>Instructions to Export WhatsApp Chat for Android</h3>
        <ol>
          <li>Open WhatsApp on your phone.</li>
          <li>Go to the chat you want to export.</li>
          <li>Tap on the chat's name at the top to open the contact info screen.</li>
          <li>Scroll down and tap on "Export Chat".</li>
          <li>Select "Without Media" when prompted.</li>
          <li>Choose your email app and send the chat to yourself.</li>
          <li>Download the chat file from your email to your device.</li>
          <li>Use the form below to upload the downloaded chat file.</li>
          <li>enter your username from whatsapp. you can inspect it in your exported txt. file</li>
          <li>Upload conversations from multiple chats to make it more effective</li>
        </ol>
      </div>
      <form onSubmit={handleSubmit}>
            <div>
              <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </label>
            </div>
             <div>
                    <label>
                              Select file:
        <input type="file" accept=".txt" onChange={handleFileChange} />
         </label>
              </div>
        <button type="submit" disabled={isUploading}>Upload</button>
      </form>
            {isUploading ? <p>Bitte warten, der Chat wird hochgeladen...</p> : <p>{message}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ChatUpload;
