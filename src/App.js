// src/App.js
import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfileEditing from './components/ProfileEditing';
import Home from './components/Home';
import Profile from './components/Profile';
import Chat from './components/Chat';
import ChatWindow from './components/ChatWindow';
import Register from './components/Register';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import ChatUpload from './components/ChatUpload';
import './App.css';
import EditPreferences from './components/EditPreferences';
import TrainAi from './components/TrainAi';
import TrainAi2 from './components/TrainAi2';
import Feedback from './components/Feedback';


const LogoutButton = ({ handleLogout }) => (
  <button className="logout-button" onClick={handleLogout}>
    Logout
  </button>
);

function App() {

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://backendforlove.herokuapp.com/api/hello")
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>AI Dating App</h1>
          <LogoutButton handleLogout={handleLogout} />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/profile-editing" element={<PrivateRoute><ProfileEditing /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="/chat/:chatId" element={<PrivateRoute><ChatWindow /></PrivateRoute>} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat-upload" element={<PrivateRoute><ChatUpload /></PrivateRoute>} />
            <Route path="/train-ai" element={<TrainAi />} />
            <Route path="/edit-preferences" element={<PrivateRoute><EditPreferences /></PrivateRoute>} />
            <Route path="/train-ai-2" element={<TrainAi2 />} />
            <Route path="/feedback/:matchId" element={<Feedback />} />
          </Routes>
        </main>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
