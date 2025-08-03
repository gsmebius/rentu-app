export interface CarSchema {
  id: number;
  brand: string;
  model: string;
  year: string;
  price: number;
  type: string;
  description: string;
  mainImage: string;
  rating?: number;
  totalVotes?: number;
  transmission_type: string;
}

export interface CarFilters {
  page?: number;
  pageSize?: number;
  brand?: string;
  model?: string;
  type?: string;
  international_use?: boolean;
  is_insured?: boolean;
  department_scope?: string;
  startDate?: string;
  endDate?: string;
}