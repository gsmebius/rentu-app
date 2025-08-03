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

  // Actualizar usuario (PUT)
  async updateUser(user_id: number, data: any, token: string) {
    const url = `${this.baseUrl}/${user_id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  // Eliminar usuario (PATCH /delete)
  async deleteUser(user_id: number, token: string) {
    const url = `${this.baseUrl}/delete?user_id=${user_id}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  // Upload picture (single file)
  async uploadPictureImage(user_id: string, file: any, token: string) {
    const url = `${this.baseUrl}/upload-picture`;
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name || 'photo.jpg',
      type: file.type || 'image/jpeg',
    } as any);
    formData.append('user_id', user_id);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response;
  }

  // Upload identify documents (multiple files)
  async uploadIdentifyDocuments(user_id: string, files: any[], token: string) {
    const url = `${this.baseUrl}/upload-identify-documents`;
    const formData = new FormData();
    files.forEach((file, i) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name || `file${i}.jpg`,
        type: file.type || 'image/jpeg',
      } as any);
    });
    formData.append('user_id', user_id);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response;
  }

  // Upload licence documents (multiple files)
  async uploadLicenceDocuments(user_id: string, files: any[], token: string) {
    const url = `${this.baseUrl}/upload-licence-documents`;
    const formData = new FormData();
    files.forEach((file, i) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name || `file${i}.jpg`,
        type: file.type || 'image/jpeg',
      } as any);
    });
    formData.append('user_id', user_id);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response;
  }

  // Obtener usuario por id
  async getUserById(user_id: number, token: string) {
    const url = `${this.baseUrl}/${user_id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  // Update step 1
  async updateUserStep1(user_id: number, data: any, token: string) {
    const url = `${this.baseUrl}/update-step-1/${user_id}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  // Update step 2 (with files)
  async updateUserStep2(user_id: number, data: any, files: any[], token: string) {
    const url = `${this.baseUrl}/update-step-2/${user_id}`;
    const formData = new FormData();
    // Los archivos se dividen según controlador: primeros 2 identityFiles, siguientes 2 licenceFiles
    files.forEach((file, i) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name || `file${i}.jpg`,
        type: file.type || 'image/jpeg',
      } as any);
    });
    formData.append('data', JSON.stringify(data));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response;
  }

  // Upload step 3 private validation photo
  async uploadPrivateValidationPhoto(user_id: string, file: any, token: string) {
    const url = `${this.baseUrl}/upload-step-3`;
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name || 'photo.jpg',
      type: file.type || 'image/jpeg',
    } as any);
    formData.append('user_id', user_id);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response;
  }

  // Get identity documents
  async getIdentityDocuments(user_id: string, token: string) {
    const url = `${this.baseUrl}/identity-documents/${user_id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  // Change identity documents (files)
  async changeIdentityDocuments(user_id: string, files: any[], token: string) {
    const url = `${this.baseUrl}/change-identity-documents/${user_id}`;
    const formData = new FormData();
    files.forEach((file, i) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name || `file${i}.jpg`,
        type: file.type || 'image/jpeg',
      } as any);
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response;
  }

  // Get licence documents
  async getLicenceDocuments(user_id: string, token: string) {
    const url = `${this.baseUrl}/licence-documents/${user_id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  // Change licence documents (files)
  async changeLicenceDocuments(user_id: string, files: any[], token: string) {
    const url = `${this.baseUrl}/change-licence-documents/${user_id}`;
    const formData = new FormData();
    files.forEach((file, i) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name || `file${i}.jpg`,
        type: file.type || 'image/jpeg',
      } as any);
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response;
  }
}
