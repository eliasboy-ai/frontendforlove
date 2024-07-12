// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Fügen Sie diese Zeile hinzu, um die spezifischen Stile für die Navbar zu laden

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/home">Matches</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/chat">Chat</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
