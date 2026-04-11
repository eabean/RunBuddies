import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  hasProfile: boolean;
  setAuth: (token: string, userId: string, hasProfile: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [hasProfile, setHasProfile] = useState<boolean>(
    localStorage.getItem('hasProfile') === 'true'
  );

  const setAuth = (token: string, userId: string, hasProfile: boolean) => {
    setToken(token);
    setUserId(userId);
    setHasProfile(hasProfile);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('hasProfile', hasProfile.toString());
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setHasProfile(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('hasProfile');
  };

  return (
    <AuthContext.Provider value={{ token, userId, hasProfile, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};