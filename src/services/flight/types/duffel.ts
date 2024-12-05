export interface DuffelOffer {
  id: string;
  total_emissions_kg: string;
  passenger_identity_documents_required: boolean;
  owner: {
    name: string;
    logo_symbol_url: string;
    iata_code: string;
  };
  total_amount: number;
  slices: Array<{
    duration: string;
    segments: Array<{
      operating_carrier_flight_number: string;
      departing_at: string;
      arriving_at: string;
      aircraft: {
        name: string;
      };
      operating_carrier: {
        name: string;
      };
      origin: {
        iata_code: string;
      };
      destination: {
        iata_code: string;
      };
      meal_service?: string[];
    }>;
    origin: {
      iata_code: string;
    };
    destination: {
      iata_code: string;
    };
  }>;
  passengers: Array<{
    baggages?: Array<{
      quantity: number;
    }>;
  }>;
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
}

export interface DuffelApiResponse {
  data: {
    offers: DuffelOffer[];
  };
  meta?: {
    limit: number;
    before: string | null;
    after: string | null;
  };
}