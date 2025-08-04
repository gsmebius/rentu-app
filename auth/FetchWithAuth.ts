import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from "services/auth.service";

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const authString = await AsyncStorage.getItem('auth');
  let accessToken = null;
  let refreshToken = null;
  let sessionId = null;

  if (authString) {
    const authData = JSON.parse(authString);
    accessToken = authData.accessToken;
    refreshToken = authData.refreshToken;
    sessionId = authData.sessionId;
  }

  let headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Authorization: `Bearer ${accessToken}`,
    'session-id': sessionId || '',
  };

  const doFetch = async () =>
    fetch(url, {
      ...options,
      headers,
    });

  let response = await doFetch();

  if (response.status === 401 && refreshToken && sessionId) {
    try {
      const authService = new AuthService();
      const newAccessToken = await authService.refreshAccessToken(refreshToken, sessionId);

      // Actualiza tokens en AsyncStorage también para futuras peticiones
      await AsyncStorage.setItem(
        'auth',
        JSON.stringify({
          ...JSON.parse(authString || '{}'),
          accessToken: newAccessToken,
        })
      );

      headers.Authorization = `Bearer ${newAccessToken}`; // Actualizamos el header con el nuevo token
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (error) {
      await AsyncStorage.multiRemove(['auth']);
      throw error;
    }
  }
  return response;
};
