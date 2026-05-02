import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import '../styles/IntroPage.css';

const IntroPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { token, hasProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(hasProfile ? '/swipe' : '/profile-setup', { replace: true });
    }
  }, [token, hasProfile, navigate]);

  return (
    <div className="intro-page">
      <video
        className="intro-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/running-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="intro-container">
        <h1>🏃 RunBuddies</h1>
        <p>Find your perfect running partner</p>

        <div className="intro-tabs">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <div className="form-section">
          {isLogin ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
};

export default IntroPage;