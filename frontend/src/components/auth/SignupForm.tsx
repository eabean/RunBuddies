import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import './AuthForm.css';

const SignupForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.register(email, password);
      if (response.token) {
        setAuth(response.token, response.userId, response.hasProfile);
        navigate('/profile-setup');
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSignup} className="auth-form">
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          required
        />
      </Form.Group>

      <Button
        variant="success"
        type="submit"
        className="w-100"
        disabled={loading}
        size="lg"
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Signing up...
          </>
        ) : (
          'Sign Up'
        )}
      </Button>
    </Form>
  );
};

export default SignupForm;