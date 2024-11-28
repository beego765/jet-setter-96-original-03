export interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: Passengers;
  cabinClass: string;
}

export interface DuffelApiError {
  documentation_url: string;
  title: string;
  type: string;
  message: string;
  code: string;
}

export interface DuffelApiResponse {
  data?: any;
  errors?: DuffelApiError[];
  meta?: {
    request_id: string;
    status: number;
  };
}