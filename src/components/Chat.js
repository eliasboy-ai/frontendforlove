// src/components/Chat.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

function Chat() {
  const [activeTab, setActiveTab] = useState('KI-Chat');
  const navigate = useNavigate();

  const kiChats = [
  { id: 'personalized-ai', image: 'https://via.placeholder.com/50', lastMessage: 'Chat with your AI clone' },
    { id: 2, image: 'https://via.placeholder.com/50', lastMessage: 'Bla Bla Bla...' },
    { id: 3, image: 'https://via.placeholder.com/50', lastMessage: 'Bla Bla Bla...' }
  ];

  const normalChats = [
    { id: 1, image: 'https://via.placeholder.com/50', lastMessage: 'Hallo, wie geht es dir?' },
    { id: 2, image: 'https://via.placeholder.com/50', lastMessage: 'Lust auf einen Kaffee?' },
    { id: 3, image: 'https://via.placeholder.com/50', lastMessage: 'Ich habe ein neues Hobby gefunden!' }
  ];

const handleChatClick = (chatId) => {
  if (chatId === 'personalized-ai') {
    navigate('/chat/personalized-ai');
  } else {
    navigate(`/chat/${chatId}`);
  }
};


  return (
    <div className="chat-page">
      <h2>Deine Chats</h2>
      <div className="chat-tabs">
        <button
          className={activeTab === 'KI-Chat' ? 'active' : ''}
          onClick={() => setActiveTab('KI-Chat')}
        >
          KI-Chat
        </button>
        <button
          className={activeTab === 'Chat' ? 'active' : ''}
          onClick={() => setActiveTab('Chat')}
        >
          Chat
        </button>
      </div>
      {activeTab === 'KI-Chat' ? (
        <div>
          <p>Hier sind deine Chats mit den KI-Klonen</p>
          <div className="chat-list">
            {kiChats.map(chat => (
              <div key={chat.id} className="chat-item" onClick={() => handleChatClick(chat.id)}>
                <img src={chat.image} alt="Profilbild" />
                <div className="chat-info">
                  <p>Letzte Nachricht:</p>
                  <p>{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p>Hier sind deine normalen Chats</p>
          <div className="chat-list">
            {normalChats.map(chat => (
              <div key={chat.id} className="chat-item" onClick={() => handleChatClick(chat.id)}>
                <img src={chat.image} alt="Profilbild" />
                <div className="chat-info">
                  <p>Letzte Nachricht:</p>
                  <p>{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
