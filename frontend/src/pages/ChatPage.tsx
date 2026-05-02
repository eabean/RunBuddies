import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import '../styles/ChatPage.css';

interface PromptAnswer {
  promptText: string;
  answerText: string;
}

interface MatchedUser {
  firstName: string;
  contactInfo?: string;
  mainPhotoUrl?: string;
  age?: number;
  biography?: string;
  lookingFor?: string;
  experienceLevel?: number;
  paceMinutes?: number;
  paceUnit?: number;
  promptAnswers?: PromptAnswer[];
}

interface Match {
  matchId: string;
  matchedAt: string;
  matchedUser: MatchedUser;
}

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, [token]);

  const loadMatches = async () => {
    if (!token) return;
    try {
      const data = await api.getMatches(token) as Match[];
      setMatches(data);
      setSelectedMatchId(null);
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

  const selectedMatch = matches.find((match) => match.matchId === selectedMatchId) || null;
  const selectedUser = selectedMatch?.matchedUser;
  const promptAnswers = selectedUser?.promptAnswers ?? [];

  return (
    <div className="chat-page">
      <h1>Your Matches</h1>
      <div className="chat-layout">
        <div className="matches-grid">
          {matches.map((match) => (
            <button
              key={match.matchId}
              className={`match-tile ${selectedMatchId === match.matchId ? 'selected' : ''}`}
              onClick={() => {
                setSelectedMatchId(match.matchId);
              }}
              type="button"
            >
              <img src={match.matchedUser.mainPhotoUrl} alt={match.matchedUser.firstName} />
              <h3>{match.matchedUser.firstName}</h3>
              <p>Matched {new Date(match.matchedAt).toLocaleDateString()}</p>
            </button>
          ))}
        </div>
        {selectedUser && (
          <section className="match-details">
            <h2>{selectedUser.firstName}'s Profile</h2>
            <p><strong>Contact:</strong> {selectedUser.contactInfo || 'Not shared yet'}</p>
            {selectedUser.age !== undefined && <p><strong>Age:</strong> {selectedUser.age}</p>}
            {selectedUser.biography && <p><strong>Bio:</strong> {selectedUser.biography}</p>}
            {selectedUser.lookingFor && <p><strong>Looking for:</strong> {selectedUser.lookingFor}</p>}
            {selectedUser.experienceLevel !== undefined && (
              <p><strong>Experience level:</strong> {selectedUser.experienceLevel}</p>
            )}
            {selectedUser.paceMinutes !== undefined && selectedUser.paceUnit !== undefined && (
              <p><strong>Pace preference:</strong> {selectedUser.paceMinutes} min, unit {selectedUser.paceUnit}</p>
            )}
            <div className="prompt-answers">
              <h3>Prompt Answers</h3>
              {promptAnswers.length === 0 ? (
                <p>No prompt answers shared yet.</p>
              ) : (
                promptAnswers.map((answer, index) => (
                  <div key={`${answer.promptText}-${index}`} className="prompt-answer-item">
                    <p className="prompt-question">{answer.promptText}</p>
                    <p>{answer.answerText}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
      <div className="chat-page-actions">
        <button className="secondary-action-button" onClick={() => navigate('/swipe')}>
          Back to Swiping
        </button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <button onClick={handleLogout}>Logout</button>
      <ChatWindow />
    </div>
  );
};

export default ChatPage;