import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { UserService } from 'services/users.service';

type User = {
  id: number;
  email: string;
  names: string;
  last_names: string;
  profile_image: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  sessionId: string | null;
  login: (
    user: User,
    accessToken: string,
    refreshToken: string,
    sessionId: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  getUserStatusFromService: (user_id: number) => Promise<number | null>;
};

// Handler global para usar logout fuera del contexto
let logoutHandler: (() => Promise<void>) | null = null;
export const getLogoutHandler = () => logoutHandler;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const userService = useMemo(() => new UserService(), []);

  // Guarda credenciales y usuario
  const login = useCallback(
    async (user: User, accessToken: string, refreshToken: string, sessionId: string) => {
      setUser(user);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setSessionId(sessionId);

      await AsyncStorage.setItem(
        'auth',
        JSON.stringify({ user, accessToken, refreshToken, sessionId })
      );
    },
    []
  );

  // Cierra sesión tanto en API como local
  const logout = useCallback(async () => {
    try {
      if (user?.id && refreshToken && sessionId) {
        await userService.logoutUser({
          token: refreshToken,
          user_id: user.id,
          sessionId: sessionId,
        });
      }
    } catch (err) {
      console.warn('Error en logout API:', err);
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setSessionId(null);
      await AsyncStorage.removeItem('auth');
      // reemplazo de ruta, más forzado.
      router.replace('/');
    }
  }, [user, refreshToken, sessionId, router, userService]);

  // Recupera sesión guardada en almacenamiento local
  const loadStoredAuth = useCallback(async () => {
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
  }, []);

  // Efecto para cargar sesión al iniciar la app
  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  // Asigna el handler global para logout
  useEffect(() => {
    logoutHandler = logout;
    return () => {
      logoutHandler = null;
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        sessionId,
        login,
        logout,
        loading,
        getUserStatusFromService,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const getUserStatusFromService = async (user_id: number): Promise<number | null> => {
  if (!user_id) return null;
  const userService = new UserService();
  try {
    const response = await userService.getUserStatus(user_id);
    return response?.status ?? null;
  } catch (error) {
    console.error('Error fetching user status:', error);
    return null;
  }
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
