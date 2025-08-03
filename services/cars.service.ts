import { rentuApi } from '../constants/secrets';
import { CarFilters } from 'interfaces/cars.chemas';

export class CarService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = rentuApi;
  }

  private buildQueryParams(filters: CarFilters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.model) params.append('model', filters.model);
    if (filters.type) params.append('type', filters.type);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.international_use !== undefined)
      params.append('international_use', filters.international_use.toString());
    if (filters.is_insured !== undefined)
      params.append('is_insured', filters.is_insured.toString());
    if (filters.department_scope) params.append('department_scope', filters.department_scope);
    return params.toString();
  }

  async getAllCars(filters: CarFilters = {}) {
    const query = this.buildQueryParams(filters);
    const url = `${this.baseUrl}/cars?${query}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  async getCarByID(id: string) {
    const url = `${this.baseUrl}/cars/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  async getCarsForOwner(userID: string, token: string) {
    const url = `${this.baseUrl}/cars/owner/${userID}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  async getCarsByOwnerForClients(userID: string, token: string) {
    const url = `${this.baseUrl}/cars/by-owner/${userID}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  async createCarStep1(data: any, token: string) {
    const url = `${this.baseUrl}/cars/step1`;
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

  async createCarStep2(carID: string, data: any, token: string) {
    const url = `${this.baseUrl}/cars/step2/${carID}`;
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

  async createCarFilesStep3(carID: string, files: any[], token: string) {
    const url = `${this.baseUrl}/cars/step3/${carID}`;
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name || `file${index}.jpg`,
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

  async updateCar(carID: string, data: any, token: string) {
    const url = `${this.baseUrl}/cars/${carID}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async deleteCar(carID: string, token: string) {
    const url = `${this.baseUrl}/cars/${carID}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  async deleteFilesCar(carID: string, token: string) {
    const url = `${this.baseUrl}/cars/files/${carID}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  async changeCarFiles(carID: string, files: any[], token: string) {
    const url = `${this.baseUrl}/cars/change-files/${carID}`;
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', {
        uri: file.uri,
        name: file.name || `file${index}.jpg`,
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

  async getCarPictures(carID: string) {
    const url = `${this.baseUrl}/cars/pictures/${carID}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  }

  async getCarByIDForClients(carID: string) {
    const url = `${this.baseUrl}/cars/client/${carID}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  }

  async seedBrandsModels() {
    const url = `${this.baseUrl}/cars/seeds/brands-models`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  }

  async getBrands() {
    const url = `${this.baseUrl}/cars/brands-models/brands`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  }

  async getBrandModels(brandID: string) {
    const url = `${this.baseUrl}/cars/brands-models/models/${brandID}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  }
}
