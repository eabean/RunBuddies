import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ProfileForm from '../components/profile/ProfileForm';
import QuestionPrompt from '../components/profile/QuestionPrompt';

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    dateOfBirth: '',
    zipCode: '',
    paceMinutes: '',
    paceUnit: 0,
    matchingRadiusKm: '',
    experienceLevel: 0,
    goals: '',
    biography: '',
    lookingFor: '',
    contactInfo: '',
  });
  const [prompts, setPrompts] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPrompts = async () => {
      if (!token) return;
      try {
        const promptData = await api.getPrompts(token);
        setPrompts(promptData);
      } catch (err) {
        setError('Failed to load prompts');
      } finally {
        setLoading(false);
      }
    };
    loadPrompts();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePromptAnswerChange = (promptId: string, answerText: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.promptId === promptId);
      if (existing) {
        return prev.map((a) => (a.promptId === promptId ? { ...a, answerText } : a));
      }
      return [...prev, { promptId, answerText }];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      // Create profile
      await api.createProfile(token, formData);
      // Save prompt answers
      if (answers.length > 0) {
        await api.savePromptAnswers(token, answers);
      }
      navigate('/swipe');
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-setup-page">
      <h1>Create Your Profile</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          value={formData.zipCode}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="paceMinutes"
          placeholder="Pace (minutes)"
          value={formData.paceMinutes}
          onChange={handleInputChange}
          required
        />
        <select name="paceUnit" value={formData.paceUnit} onChange={handleInputChange}>
          <option value={0}>min/km</option>
          <option value={1}>min/mile</option>
        </select>
        <input
          type="number"
          name="matchingRadiusKm"
          placeholder="Matching Radius (km)"
          value={formData.matchingRadiusKm}
          onChange={handleInputChange}
          required
        />
        <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange}>
          <option value={0}>Beginner</option>
          <option value={1}>Novice</option>
          <option value={2}>Intermediate</option>
          <option value={3}>Advanced</option>
          <option value={4}>Elite</option>
        </select>
        <textarea
          name="biography"
          placeholder="Biography"
          value={formData.biography}
          onChange={handleInputChange}
        />
        <textarea
          name="lookingFor"
          placeholder="Looking For"
          value={formData.lookingFor}
          onChange={handleInputChange}
        />
        <textarea
          name="goals"
          placeholder="Goals"
          value={formData.goals}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="contactInfo"
          placeholder="Contact Info (phone, Instagram, etc.)"
          value={formData.contactInfo}
          onChange={handleInputChange}
        />

        <h3>Answer Prompts</h3>
        {prompts.map((prompt) => (
          <div key={prompt.id}>
            <label>{prompt.promptText}</label>
            <textarea
              placeholder="Your answer"
              onChange={(e) => handlePromptAnswerChange(prompt.id, e.target.value)}
            />
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Continue to Swipe'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetupPage;