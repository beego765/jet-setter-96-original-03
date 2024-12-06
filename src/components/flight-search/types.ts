export interface Flight {
  id: string;
  airline: string;
  airlineLogoUrl?: string;
  airlineCode?: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  origin: string;
  destination: string;
  aircraft?: string;
  cabinClass: string;
  operatingCarrier: string;
  departureDate: string;
  segments: Array<{
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
  }>;
  services?: {
    seatSelection: boolean;
    meals: string[];
    baggage: {
      included: boolean;
      details: string;
    };
    refund?: {
      allowed: boolean;
      penalty?: number;
    };
    changes?: {
      allowed: boolean;
      penalty?: number;
    };
  };
  carbonEmissions?: {
    amount: number;
    unit: string;
  };
}