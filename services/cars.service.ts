import { fetchWithAuth } from 'auth/FetchWithAuth';
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

    if (!response.ok) {
      throw new Error('Error fetching car data');
    }

    const data = await response.json();
    return data;
  }

  async getCarsForOwner(userID: string) {
    const url = `${this.baseUrl}/cars/owner/${userID}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  async getCarsByOwnerForClients(userID: string) {
    const url = `${this.baseUrl}/cars/by-owner/${userID}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  async createCarStep1(data: any) {
    const url = `${this.baseUrl}/cars/step1`;
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

  async createCarStep2(carID: string, data: any) {
    const url = `${this.baseUrl}/cars/step2/${carID}`;
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

  async deleteUnavailableDays(dateID: number) {
    const url = `${this.baseUrl}/unavailable-days/${dateID}`;
    const response = await fetchWithAuth(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  async createCarFilesStep3(carID: string, formData: FormData) {
    const url = `${this.baseUrl}/cars/step3/${carID}`;

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

  async changeCarFiles(carID: string, formData: FormData) {
    const url = `${this.baseUrl}/cars/change-files/${carID}`;

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

  async updateCar(carID: string, data: any) {
    const url = `${this.baseUrl}/cars/${carID}`;
    const response = await fetchWithAuth(url, {
      method: 'PATCH',
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

  async deleteCar(carID: string) {
    const url = `${this.baseUrl}/cars/${carID}`;
    const response = await fetchWithAuth(url, {
      method: 'DELETE',
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

  async deleteFilesCar(carID: string) {
    const url = `${this.baseUrl}/cars/files/${carID}`;
    const response = await fetchWithAuth(url, {
      method: 'DELETE',
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

  async getCarPictures(carID: string) {
    const url = `${this.baseUrl}/cars/pictures/${carID}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  }

  async getCarStatusByID(carID: number) {
    const url = `${this.baseUrl}/cars/status/validation/${carID}`;
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
