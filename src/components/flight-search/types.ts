export interface Flight {
  id: string;
  owner: {
    name: string;
    logo_symbol_url: string;
    logo_lockup_url?: string;
    iata_code: string;
  };
  slices: Array<{
    duration: string;
    fare_brand_name?: string;
    origin: {
      iata_code: string;
    };
    destination: {
      iata_code: string;
    };
    segments: Array<{
      operating_carrier_flight_number: string;
      departing_at: string;
      arriving_at: string;
      aircraft?: {
        name: string;
      };
      operating_carrier?: {
        name: string;
      };
      origin: {
        iata_code: string;
      };
      destination: {
        iata_code: string;
      };
    }>;
  }>;
  total_amount: string;
  conditions?: {
    refund_before_departure?: {
      allowed: boolean;
      penalty_amount?: number;
    };
    change_before_departure?: {
      allowed: boolean;
      penalty_amount?: number;
    };
  };
  payment_requirements: {
    requires_instant_payment: boolean;
    payment_required_by: string;
  };
}

export interface FlightDetailsProps {
  departureTime: string;
  arrivalTime: string;
  duration: string;
  origin: string;
  destination: string;
}