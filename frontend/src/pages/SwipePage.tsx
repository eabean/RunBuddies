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
  const [myPhotoUrl, setMyPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [token]);

  const loadUsers = async () => {
    if (!token) return;
    try {
      const [data, profile] = await Promise.allSettled([
        api.getDiscovery(token, 1),
        api.getMyProfile(token),
      ]);
      if (data.status === 'fulfilled') setUsers(data.value);
      if (profile.status === 'fulfilled') {
        const p = profile.value as any;
        const main = p.photos?.find((x: any) => x.isMain) ?? p.photos?.[0];
        setMyPhotoUrl(main?.url ?? p.mainPhotoUrl ?? null);
      }
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
        <div className="swipe-header-actions">
          <button type="button" className="profile-avatar-btn" onClick={() => navigate('/profile-setup?edit=true')} title="Edit Profile">
            {myPhotoUrl ? (
              <img src={myPhotoUrl} alt="Edit profile" />
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            )}
          </button>
          <button type="button" className="matches-link-button" onClick={() => navigate('/matches')}>
            View Matches
          </button>
        </div>
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