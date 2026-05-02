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

const MOCK_MATCHES: Match[] = [
  {
    matchId: 'mock-1',
    matchedAt: new Date().toISOString(),
    matchedUser: {
      firstName: 'Sarah',
      age: 28,
      biography: 'Marathon runner chasing a sub-3:30. Love trail runs on weekends and post-run brunch.',
      lookingFor: 'A steady long-run partner for early morning miles.',
      experienceLevel: 4,
      paceMinutes: 8,
      paceUnit: 1,
      contactInfo: '@sarahrunsfast',
      mainPhotoUrl: 'https://picsum.photos/seed/sarah/400/500',
      promptAnswers: [
        { promptText: 'My favourite post-run meal is…', answerText: 'Avocado toast and a giant iced coffee, always.' },
        { promptText: 'My running goal this year is…', answerText: 'Qualify for Boston — fingers crossed!' },
      ],
    },
  },
  {
    matchId: 'mock-2',
    matchedAt: new Date(Date.now() - 86400000).toISOString(),
    matchedUser: {
      firstName: 'James',
      age: 32,
      biography: '5K enthusiast turned half-marathon convert. Running keeps me sane.',
      lookingFor: 'Someone to push the pace on track days.',
      experienceLevel: 3,
      paceMinutes: 9,
      paceUnit: 1,
      contactInfo: '@james_on_the_run',
      mainPhotoUrl: 'https://picsum.photos/seed/james/400/500',
      promptAnswers: [
        { promptText: 'My favourite post-run meal is…', answerText: 'A big bowl of ramen — carbs are life.' },
        { promptText: 'The song that always gets me through a hard mile is…', answerText: 'Lose Yourself — never fails.' },
      ],
    },
  },
];

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [myPhotoUrl, setMyPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    loadMatches();
  }, [token]);

  const loadMatches = async () => {
    if (!token) return;
    try {
      const [matchData, profileResult] = await Promise.allSettled([
        api.getMatches(token),
        api.getMyProfile(token),
      ]);
      if (matchData.status === 'fulfilled') {
        setMatches([...MOCK_MATCHES, ...(matchData.value as Match[])]);
      }
      if (profileResult.status === 'fulfilled') {
        const p = profileResult.value as any;
        const main = p.photos?.find((x: any) => x.isMain) ?? p.photos?.[0];
        setMyPhotoUrl(main?.url ?? p.mainPhotoUrl ?? null);
      }
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
      <div className="chat-page-header">
        <h1>Your Matches</h1>
        <button
          className="profile-avatar-btn"
          onClick={() => navigate('/profile-setup?edit=true')}
          title="Edit Profile"
          type="button"
        >
          {myPhotoUrl ? (
            <img src={myPhotoUrl} alt="Edit profile" />
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          )}
        </button>
      </div>
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
              <div>
                <h3>{match.matchedUser.firstName}</h3>
                <p>Matched {new Date(match.matchedAt).toLocaleDateString()}</p>
              </div>
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
    </div>
  );
};

export default ChatPage;