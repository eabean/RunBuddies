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
        setIsMatch(true);
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setIsMatch(false);
        }, 2000);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (err) {
      console.error('Swipe failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (isMatch) return <div className="match-celebration">It's a Match! 🎉</div>;

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
          {currentUser.contactInfo && <p>Contact: {currentUser.contactInfo}</p>}
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