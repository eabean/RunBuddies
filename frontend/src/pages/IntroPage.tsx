import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
// import './IntroPage.css'; // Optional: Add styles specific to the IntroPage

const IntroPage = () => {
  return (
    <div className="intro-page">
      <h1>Welcome to RunBuddies</h1>
      <p>Please log in or create an account to get started.</p>
      <div className="auth-forms">
        <LoginForm />
        <SignupForm />
      </div>
    </div>
  );
};

export default IntroPage;