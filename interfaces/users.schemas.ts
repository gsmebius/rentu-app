export interface CreateUserDTO {
  email: string;
  password: string;
  names: string;
  last_names: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface LogoutDTO {
  token: string;
  user_id: number;
  sessionId: string;
}
