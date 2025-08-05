import { CreateUserDTO, LoginUserDTO, LogoutDTO } from 'interfaces/users.schemas';
import { rentuApi } from '../constants/secrets';
import { fetchWithAuth } from 'auth/FetchWithAuth';

export class UserService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${rentuApi}/users`;
  }

  async getUserStatus(user_id: number) {
    const response = await fetch(`${this.baseUrl}/status/creation/${user_id}`);
    return response.json();
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

  async logoutUser(data: LogoutDTO) {
    const response = await fetchWithAuth(`${this.baseUrl}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error en el logout');
    return response.json();
  }

  // Actualizar usuario (PUT)
  async updateUser(user_id: number, data: any) {
    const url = `${this.baseUrl}/${user_id}`;
    const response = await fetchWithAuth(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  // Eliminar usuario (PATCH /delete)
  async deleteUser(user_id: number) {
    const url = `${this.baseUrl}/delete?user_id=${user_id}`;
    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  // Upload picture (single file)
  async uploadPictureImage(user_id: string, file: any) {
    const url = `${this.baseUrl}/upload-picture`;
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name || 'photo.jpg',
      type: file.type || 'image/jpeg',
    } as any);
    formData.append('user_id', user_id);

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response;
  }

  // Upload identify documents (multiple files)
  async uploadIdentifyDocuments(user_id: string, files: any[]) {
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

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response;
  }

  // Upload licence documents (multiple files)
  async uploadLicenceDocuments(user_id: string, files: any[]) {
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

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response;
  }

  // Obtener usuario por id
  async getUserById(user_id: number) {
    const url = `${this.baseUrl}/${user_id}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  async updateUserStep1(user_id: number, data: any) {
    const url = `${this.baseUrl}/update-step-1/${user_id}`;
    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Error desconocido en la validación (step 1)';
      try {
        const errorData = await response.json();
        if (errorData?.message) errorMessage = errorData.message;
      } catch {}
      throw new Error(errorMessage);
    }

    return await response.json();
  }

   async updateUserStep2(user_id: number, formData: FormData) {
    const url = `${this.baseUrl}/update-step-2/${user_id}`;

    // Log para depuración
    console.log('🚀 Enviando request a:', url);
    console.log('📦 FormData preparado, haciendo fetch...');

    const response = await fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Error desconocido en la validación';
      try {
        const errorData = await response.json();
        if (errorData?.message) errorMessage = errorData.message;
        console.error('❌ Error en respuesta:', errorData);
      } catch (e) {
        console.error('❌ Error al parsear respuesta:', e);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Respuesta recibida:', result);
    return result;
  }

  async uploadPrivateValidationPhoto(user_id: string, fileBlob: Blob, fileName: string) {
    const url = `${this.baseUrl}/upload-step-3`;
    const formData = new FormData();

    formData.append('file', fileBlob, fileName);
    formData.append('user_id', user_id);

    const response = await fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Error desconocido en la validación (step 3)';
      try {
        const errorData = await response.json();
        if (errorData?.message) errorMessage = errorData.message;
      } catch {}
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  // Get identity documents
  async getIdentityDocuments(user_id: string) {
    const url = `${this.baseUrl}/identity-documents/${user_id}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  // Change identity documents (files)
  async changeIdentityDocuments(user_id: string, files: any[]) {
    const url = `${this.baseUrl}/change-identity-documents/${user_id}`;
    const formData = new FormData();
    files.forEach((file, i) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name || `file${i}.jpg`,
        type: file.type || 'image/jpeg',
      } as any);
    });

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response;
  }

  // Get licence documents
  async getLicenceDocuments(user_id: string) {
    const url = `${this.baseUrl}/licence-documents/${user_id}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  // Change licence documents (files)
  async changeLicenceDocuments(user_id: string, files: any[]) {
    const url = `${this.baseUrl}/change-licence-documents/${user_id}`;
    const formData = new FormData();
    files.forEach((file, i) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name || `file${i}.jpg`,
        type: file.type || 'image/jpeg',
      } as any);
    });

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return response;
  }
}
