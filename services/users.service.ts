import { CreateUserDTO, LoginUserDTO, LogoutDTO } from 'interfaces/users.schemas';
import { rentuApi } from '../constants/secrets';

export class UserService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${rentuApi}/users`;
  }

  async registerUser(data: CreateUserDTO) {
    const response = await fetch(`${this.baseUrl}/singup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error en el registro');
    return response.json();
  }

  async loginUser(data: LoginUserDTO) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error en el login');
    return response.json();
  }

  async logoutUser(data: LogoutDTO, token: string) {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error en el logout');
    return response.json();
  }
}
