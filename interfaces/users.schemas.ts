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


export interface updateUserStep1DTO {
  country?: string;
  phone_number?: string;
}

export interface updateUserStep2DTO {
  user_type: number;
  identity_document_type?: string;
  identity_document_number?: string;
  licence_document_number?: string;
}

export interface updateUserDTO {
  names?: string;
  last_names?: string;
  country?: string;
  phone_number?: string;
  identity_document_type?: string;
  identity_document_number?: string;
  licence_document_number?: string;
  status_creation?: number;
}
