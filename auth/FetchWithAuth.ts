import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from "services/auth.service";
import { getLogoutHandler } from "./AuthContext";

let isLoggingOut = false; // evita múltiples llamadas seguidas

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const authString = await AsyncStorage.getItem("auth");
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
    "session-id": sessionId || "",
  };

  const doFetch = async () =>
    fetch(url, {
      ...options,
      headers,
    });

  let response = await doFetch();

  // Caso: token expirado, intentar refresh
  if (response.status === 401 && refreshToken && sessionId) {
    try {
      const authService = new AuthService();
      const newAccessToken = await authService.refreshAccessToken(
        refreshToken,
        sessionId
      );

      await AsyncStorage.setItem(
        "auth",
        JSON.stringify({
          ...JSON.parse(authString || "{}"),
          accessToken: newAccessToken,
        })
      );

      headers.Authorization = `Bearer ${newAccessToken}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (error) {
      if (!isLoggingOut) {
        isLoggingOut = true;
        const logout = getLogoutHandler();
        if (logout) await logout();
      }
      throw error;
    }
  }

  return response;
};
