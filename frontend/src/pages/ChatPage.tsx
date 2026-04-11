import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ChatWindow from '../components/chat/ChatWindow';
import '../styles/ChatPage.css';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, [token]);

  const loadMatches = async () => {
    if (!token) return;
    try {
      const data = await api.getMatches(token);
      setMatches(data);
    } catch (err) {
      console.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="chat-page">
      <h1>Your Matches</h1>
      <div className="matches-grid">
        {matches.map((match) => (
          <div key={match.matchId} className="match-tile">
            <img src={match.matchedUser.mainPhotoUrl} alt={match.matchedUser.firstName} />
            <h3>{match.matchedUser.firstName}</h3>
            <p>Matched {new Date(match.matchedAt).toLocaleDateString()}</p>
            <p>Contact: {match.matchedUser.contactInfo}</p>
          </div>
        ))}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ChatPage;