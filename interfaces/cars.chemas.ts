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

export interface createCarStep1 {
   circulation_car_number: string;
   brand: string;
   model: string;
   year: string;
   color: string;
   is_insured: boolean;
   engine_number: string;
   chacian_bin_number: string;
   licence_plate: string;
   owner_name: string;
   type: string;
   user_id: number;
   transmission_type: string;
   description: string;
}

export interface createCarRules {
   international_use: boolean;
   price: number;
   unable: boolean;
   capacity: number;
   departments_scope: string
   unavailableDates: Date[];
}

export interface updateCar {
   circulation_car_number?: string;
   brand?: string;
   model?: string;
   year?: string;
   color?: string;
   capacity?: number;
   is_insured?: boolean;
   engine_number?: string;
   chacian_bin_number?: string;
   licence_plate?: string;
   owner_name?: string;
   international_use?: boolean;
   price?: number;
   unable?: boolean;
   availability_days?: string;
   departments_scope?: string;
   type?: string;
   description?: string;
}

export interface CreateCarStep2CompleteDTO extends createCarRules {
  unavailableDates: Date[];
}
