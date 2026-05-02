import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import '../styles/SwipePage.css';

const SwipePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatch, setIsMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [token]);

  const loadUsers = async () => {
    if (!token) return;
    try {
      const data = await api.getDiscovery(token, 1);
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (isLike: boolean) => {
    if (currentIndex >= users.length) return;
    const user = users[currentIndex];
    if (!token) return;

    try {
      const response = await api.swipe(token, user.userId, isLike);
      if (isLike && response.isMatch) {
        setMatchedUser(user);
        setIsMatch(true);
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setIsMatch(false);
          setMatchedUser(null);
        }, 5000);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (err) {
      console.error('Swipe failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (isMatch) return (
    <div className="match-celebration">
      <div className="match-celebration-content">
        <div className="match-hearts">❤️</div>
        <h1>It's a Match!</h1>
        {matchedUser && <p>You and {matchedUser.firstName} liked each other</p>}
        <button className="match-view-button" onClick={() => navigate('/matches')}>View Matches</button>
      </div>
    </div>
  );

  const hasMoreUsers = currentIndex < users.length;
  const currentUser = hasMoreUsers ? users[currentIndex] : null;

  return (
    <div className="swipe-page">
      <div className="swipe-header">
        <h1>Discover Runners</h1>
        <button type="button" className="matches-link-button" onClick={() => navigate('/matches')}>
          View Matches
        </button>
      </div>
      {hasMoreUsers && currentUser ? (
        <div className="swipe-card">
          <img src={currentUser.mainPhotoUrl} alt={currentUser.firstName} />
          <h2>{currentUser.firstName}, {currentUser.age}</h2>
          <p>{currentUser.biography}</p>
          <p>Looking for: {currentUser.lookingFor}</p>
          <div className="swipe-buttons">
            <button onClick={() => handleSwipe(false)}>❌ Pass</button>
            <button onClick={() => handleSwipe(true)}>❤️ Like</button>
          </div>
        </div>
      ) : (
        <div className="no-more-runners">
          <p>You're all caught up for now. Check back later for more runners.</p>
        </div>
      )}
    </div>
  );
};

export default SwipePage;