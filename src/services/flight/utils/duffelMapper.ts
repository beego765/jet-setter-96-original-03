import type { DuffelOffer } from '../types/duffel';
import type { Flight } from '@/components/flight-search/FlightCard';

interface Segment {
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
  meal_service?: string[];
}

interface Slice {
  duration?: string;
  segments: Segment[];
  origin: {
    iata_code: string;
  };
  destination: {
    iata_code: string;
  };
}

export const mapDuffelOfferToFlight = (offer: DuffelOffer): Flight => {
  const firstSlice = (offer.slices?.[0] || {}) as Slice;
  const firstSegment = firstSlice.segments?.[0] || {};
  const lastSegment = firstSlice.segments?.[firstSlice.segments?.length - 1] || firstSegment;

  return {
    id: offer.id,
    airline: offer.owner?.name || 'Unknown Airline',
    airlineLogoUrl: offer.owner?.logo_symbol_url,
    airlineCode: offer.owner?.iata_code,
    flightNumber: firstSegment.operating_carrier_flight_number || 'N/A',
    departureTime: firstSegment.departing_at ? new Date(firstSegment.departing_at).toLocaleTimeString() : 'N/A',
    arrivalTime: lastSegment.arriving_at ? new Date(lastSegment.arriving_at).toLocaleTimeString() : 'N/A',
    duration: firstSlice.duration || 'N/A',
    price: offer.total_amount || 0,
    origin: firstSlice.origin?.iata_code || 'N/A',
    destination: firstSlice.destination?.iata_code || 'N/A',
    aircraft: firstSegment.aircraft?.name || 'N/A',
    cabinClass: offer.passenger_identity_documents_required ? 'First/Business' : 'Economy',
    operatingCarrier: firstSegment.operating_carrier?.name || 'N/A',
    departureDate: firstSegment.departing_at || new Date().toISOString(),
    segments: firstSlice.segments?.map(segment => ({
      origin: segment.origin?.iata_code || 'N/A',
      destination: segment.destination?.iata_code || 'N/A',
      departureTime: segment.departing_at ? new Date(segment.departing_at).toLocaleTimeString() : 'N/A',
      arrivalTime: segment.arriving_at ? new Date(segment.arriving_at).toLocaleTimeString() : 'N/A',
      duration: segment.departing_at && segment.arriving_at
        ? `${Math.round((new Date(segment.arriving_at).getTime() - new Date(segment.departing_at).getTime()) / (1000 * 60))}m`
        : 'N/A'
    })) || [],
    services: {
      seatSelection: offer.passenger_identity_documents_required || false,
      meals: firstSlice.segments?.flatMap(s => s.meal_service || []) || [],
      baggage: {
        included: offer.passengers?.[0]?.baggages?.length > 0 || false,
        details: `${offer.passengers?.[0]?.baggages?.[0]?.quantity || 0} bags included`
      },
      refund: {
        allowed: offer.conditions?.refund_before_departure?.allowed || false,
        penalty: offer.conditions?.refund_before_departure?.penalty_amount
      },
      changes: {
        allowed: offer.conditions?.change_before_departure?.allowed || false,
        penalty: offer.conditions?.change_before_departure?.penalty_amount
      }
    },
    carbonEmissions: offer.total_emissions_kg ? {
      amount: parseInt(offer.total_emissions_kg),
      unit: 'kg CO2e'
    } : undefined
  };
};