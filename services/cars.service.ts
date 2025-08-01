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
}
