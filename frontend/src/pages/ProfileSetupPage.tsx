import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button, Alert, Spinner } from 'react-bootstrap';
import '../styles/ProfileSetupPage.css';

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [step, setStep] = useState(1);
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
  const [submitting, setSubmitting] = useState(false);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Predefined prompts
  const availablePrompts = [
    { id: 'frequency', text: 'How often do you run?' },
    { id: 'time', text: 'When do you like to run?' },
    { id: 'location', text: 'Where do you like to run?' },
    { id: 'injuries', text: 'Do you have any injuries?' },
    { id: 'pets', text: 'Do you have pets you like to run with?' },
    { id: 'type', text: 'What type of run do you like to do?' },
  ];

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

  const handlePromptSelect = (promptId: string) => {
    setSelectedPrompts((prev) =>
      prev.includes(promptId) ? prev.filter((id) => id !== promptId) : [...prev, promptId]
    );
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

  const handlePhotoChange = (file: File) => {
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.firstName && formData.dateOfBirth && formData.zipCode);
      case 2:
        return !!(formData.paceMinutes && formData.matchingRadiusKm);
      case 3:
        return !!(formData.biography || formData.lookingFor || formData.goals);
      case 4:
        return selectedPrompts.length > 0;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setError('');
      setStep(step + 1);
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setError('');
    try {
      await api.createProfile(token, formData);
      if (answers.length > 0) {
        await api.savePromptAnswers(token, answers);
      }
      if (photoFile) {
        await api.uploadPhoto(token, photoFile);
      }
      navigate('/swipe');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="profile-setup-page"><Spinner animation="border" className="mt-5" /></div>;

  return (
    <div className="profile-setup-page">
      <h1>Create Your Profile</h1>

      <div className="progress-indicator">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`progress-dot ${s === step ? 'active' : s < step ? 'completed' : ''}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
            <div className="step-title">
              <h2>Let's start with the basics</h2>
              <p>We'll need some basic info to get you set up</p>
            </div>

            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Zip Code *</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="10001"
                required
              />
            </div>

            <div className="form-navigation">
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
                className="btn-back"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                className="btn-next"
              >
                Next
              </Button>
            </div>
          </>
        )}

        {/* Step 2: Running Info */}
        {step === 2 && (
          <>
            <div className="step-title">
              <h2>Tell us about your running</h2>
              <p>This helps us find your perfect match</p>
            </div>

            <div className="form-group">
              <label className="form-label">Running Pace *</label>
              <div className="pace-inputs">
                <input
                  type="number"
                  name="paceMinutes"
                  value={formData.paceMinutes}
                  onChange={handleInputChange}
                  placeholder="8"
                  required
                />
                <select name="paceUnit" value={formData.paceUnit} onChange={handleInputChange}>
                  <option value={0}>min/km</option>
                  <option value={1}>min/mile</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Search Radius (km) *</label>
              <input
                type="number"
                name="matchingRadiusKm"
                value={formData.matchingRadiusKm}
                onChange={handleInputChange}
                placeholder="10"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange}>
                <option value={0}>Beginner</option>
                <option value={1}>Novice</option>
                <option value={2}>Intermediate</option>
                <option value={3}>Advanced</option>
                <option value={4}>Elite</option>
              </select>
            </div>

            <div className="form-navigation">
              <Button
                variant="secondary"
                onClick={handleBack}
                className="btn-back"
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                className="btn-next"
              >
                Next
              </Button>
            </div>
          </>
        )}

        {/* Step 3: About You */}
        {step === 3 && (
          <>
            <div className="step-title">
              <h2>Tell us about yourself</h2>
              <p>Help others get to know you</p>
            </div>

            <div className="form-group">
              <label className="form-label">About You</label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                placeholder="Tell us a little about yourself..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">What You're Looking For</label>
              <textarea
                name="lookingFor"
                value={formData.lookingFor}
                onChange={handleInputChange}
                placeholder="What are you looking for in a running partner?"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Goals</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                placeholder="Your running goals..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Info</label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder="Instagram, phone, email..."
              />
            </div>

            <div className="form-navigation">
              <Button
                variant="secondary"
                onClick={handleBack}
                className="btn-back"
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                className="btn-next"
              >
                Next
              </Button>
            </div>
          </>
        )}

        {/* Step 4: Prompts */}
        {step === 4 && (
          <>
            <div className="step-title">
              <h2>Answer some questions</h2>
              <p>Select up to 3 prompts to answer</p>
            </div>

            <div className="prompts-container">
              {selectedPrompts.map((promptId, index) => {
                const prompt = availablePrompts.find((p) => p.id === promptId);
                const remainingPrompts = availablePrompts.filter(
                  (p) => !selectedPrompts.includes(p.id)
                );

                return (
                  <div key={promptId} className="prompt-card">
                    <div className="prompt-header">
                      <label className="form-label" style={{ marginBottom: 0 }}>
                        Prompt {index + 1}
                      </label>
                      <button
                        type="button"
                        className="remove-prompt-btn"
                        onClick={() => {
                          setSelectedPrompts(selectedPrompts.filter((id) => id !== promptId));
                          setAnswers(answers.filter((a) => a.promptId !== promptId));
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    <select
                      value={promptId}
                      onChange={(e) => {
                        const newPrompts = [...selectedPrompts];
                        newPrompts[index] = e.target.value;
                        setSelectedPrompts(newPrompts);
                      }}
                      className="prompt-select"
                    >
                      <option value={promptId}>{prompt?.text}</option>
                      {remainingPrompts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.text}
                        </option>
                      ))}
                    </select>

                    <textarea
                      placeholder="Your answer..."
                      value={answers.find((a) => a.promptId === promptId)?.answerText || ''}
                      onChange={(e) => handlePromptAnswerChange(promptId, e.target.value)}
                      className="prompt-answer"
                    />
                  </div>
                );
              })}

              {selectedPrompts.length < 3 && (
                <button
                  type="button"
                  className="add-prompt-btn"
                  onClick={() => {
                    const firstUnselected = availablePrompts.find(
                      (p) => !selectedPrompts.includes(p.id)
                    );
                    if (firstUnselected) {
                      setSelectedPrompts([...selectedPrompts, firstUnselected.id]);
                    }
                  }}
                >
                  + Add Prompt
                </button>
              )}
            </div>

            <div className="form-navigation">
              <Button variant="secondary" onClick={handleBack} className="btn-back">
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={selectedPrompts.length === 0}
                className="btn-next"
              >
                Next
              </Button>
            </div>
          </>
        )}

        {/* Step 5: Photo Upload */}
        {step === 5 && (
          <>
            <div className="step-title">
              <h2>Add your photo</h2>
              <p>Choose a photo that shows off your running spirit</p>
            </div>

            <div
              className="photo-upload-area"
              onClick={() => document.getElementById('photo-input')?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) handlePhotoChange(file);
              }}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="photo-preview" />
              ) : (
                <div className="photo-upload-placeholder">
                  <div className="photo-upload-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
                      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M9 5l1.5-2h3L15 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="18" cy="8" r="1" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="photo-upload-label">Click or drag a photo here</p>
                  <p className="photo-upload-hint">JPG, PNG or HEIC · Max 10 MB</p>
                </div>
              )}
            </div>

            <input
              id="photo-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoChange(file);
              }}
            />

            {photoPreview && (
              <button
                type="button"
                className="photo-remove-btn"
                onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
              >
                Remove photo
              </button>
            )}

            <div className="form-navigation">
              <Button variant="secondary" onClick={handleBack} className="btn-back">
                Back
              </Button>
              <Button
                variant="success"
                type="submit"
                disabled={submitting}
                className="btn-submit"
              >
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating Profile...
                  </>
                ) : (
                  "Let's Go Running! 🏃"
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ProfileSetupPage;