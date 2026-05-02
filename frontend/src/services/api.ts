import { mockApi } from './mock';

const USE_MOCK = false; // Set to false when backend is ready

const API_BASE = 'http://localhost:5137/api';

export const api = USE_MOCK
  ? mockApi
  : {
      // AUTH
      register: async (email: string, password: string) => {
        const res = await fetch(`${API_BASE}/Auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Registration failed');
        }
        return res.json();
      },

      login: async (email: string, password: string) => {
        const res = await fetch(`${API_BASE}/Auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Login failed');
        }
        return res.json();
      },

      // PROMPTS
      getPrompts: async (token: string) => {
        const res = await fetch(`${API_BASE}/prompts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
      },

      // PROFILES
      createProfile: async (token: string, profileData: any) => {
        const res = await fetch(`${API_BASE}/profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        });
        return res.json();
      },

      getMyProfile: async (token: string) => {
        const res = await fetch(`${API_BASE}/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
      },

      updateProfile: async (token: string, profileData: any) => {
        const res = await fetch(`${API_BASE}/profiles/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        });
        return res.json();
      },

      savePromptAnswers: async (token: string, answers: any) => {
        const res = await fetch(`${API_BASE}/profiles/me/prompt-answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        });
        return res.status === 204 ? { success: true } : res.json();
      },

      uploadPhoto: async (token: string, file: File) => {
        // Step 1: get a pre-signed S3 URL from the backend
        const urlRes = await fetch(`${API_BASE}/Profiles/me/photos/upload-url`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ fileName: file.name, contentType: file.type }),
        });
        if (!urlRes.ok) {
          const errBody = await urlRes.text();
          throw new Error(`Failed to get upload URL (${urlRes.status}): ${errBody}`);
        }
        const { uploadUrl, s3Key } = await urlRes.json();

        // Step 2: upload the file directly to S3 via the pre-signed URL
        const s3Res = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!s3Res.ok) throw new Error('Failed to upload photo to S3');

        // Step 3: tell the backend to save the photo metadata
        const saveRes = await fetch(`${API_BASE}/Profiles/me/photos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ s3Key, isMain: true, displayOrder: 0 }),
        });
        if (!saveRes.ok) throw new Error('Failed to save photo metadata');
        return saveRes.json();
      },

      // DISCOVERY
      getDiscovery: async (token: string, page: number = 1) => {
        const res = await fetch(`${API_BASE}/discovery?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
      },

      // SWIPES
      swipe: async (token: string, swipedUserId: string, isLike: boolean) => {
        const res = await fetch(`${API_BASE}/swipes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ swipedUserId, isLike }),
        });
        return res.json();
      },

      // MATCHES
      getMatches: async (token: string) => {
        const res = await fetch(`${API_BASE}/matches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
      },

    };