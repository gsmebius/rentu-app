import { rentuApi } from 'constants/secrets';

export class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = rentuApi;
  }

  async refreshAccessToken(refreshToken: string, sessionId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'refresh-token': refreshToken,
          'session-id': sessionId,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to refresh access token');
      }

      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }
}
