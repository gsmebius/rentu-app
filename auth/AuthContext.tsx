import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: number;
  email: string;
  names: string;
  last_names: string;
  status_creation: number;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  sessionId: string | null;
  login: (user: User, accessToken: string, refreshToken: string, sessionId: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (
    user: User,
    accessToken: string,
    refreshToken: string,
    sessionId: string
  ) => {
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setSessionId(sessionId);
    await AsyncStorage.setItem(
      'auth',
      JSON.stringify({ user, accessToken, refreshToken, sessionId })
    );
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setSessionId(null);
    await AsyncStorage.removeItem('auth');
  };

  const loadStoredAuth = async () => {
    try {
      const data = await AsyncStorage.getItem('auth');
      if (data) {
        const parsed = JSON.parse(data);
        setUser(parsed.user);
        setAccessToken(parsed.accessToken);
        setRefreshToken(parsed.refreshToken);
        setSessionId(parsed.sessionId);
      }
    } catch (err) {
      console.error('Error loading auth from storage', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoredAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, refreshToken, sessionId, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
