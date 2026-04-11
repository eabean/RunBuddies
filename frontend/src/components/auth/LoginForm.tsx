import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import './AuthForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.login(email, password);
      if (response.token) {
        setAuth(response.token, response.userId, response.hasProfile);
        navigate(response.hasProfile ? '/swipe' : '/profile-setup');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="auth-form">
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

      <Form.Group className="mb-4">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        className="w-100"
        disabled={loading}
        size="lg"
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </Button>
    </Form>
  );
};

export default LoginForm;