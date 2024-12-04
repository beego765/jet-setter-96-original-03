export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass?: 'economy' | 'business' | 'first';
}

export interface CreateBookingParams {
  offerId: string;
  passengers: any[];
}