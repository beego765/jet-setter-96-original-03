import type { Flight } from '@/components/flight-search/types';

export const mapDuffelOfferToFlight = (offer: any): Flight => {
  return {
    id: offer.id,
    owner: {
      name: offer.owner?.name || 'Unknown Airline',
      logo_symbol_url: offer.owner?.logo_symbol_url,
      logo_lockup_url: offer.owner?.logo_lockup_url,
      iata_code: offer.owner?.iata_code,
    },
    slices: offer.slices.map((slice: any) => ({
      duration: slice.duration,
      fare_brand_name: slice.fare_brand_name,
      origin: {
        iata_code: slice.origin?.iata_code,
      },
      destination: {
        iata_code: slice.destination?.iata_code,
      },
      segments: slice.segments.map((segment: any) => ({
        operating_carrier_flight_number: segment.operating_carrier_flight_number,
        departing_at: segment.departing_at,
        arriving_at: segment.arriving_at,
        aircraft: segment.aircraft,
        operating_carrier: segment.operating_carrier,
        origin: {
          iata_code: segment.origin?.iata_code,
        },
        destination: {
          iata_code: segment.destination?.iata_code,
        },
      })),
    })),
    total_amount: offer.total_amount,
    conditions: {
      refund_before_departure: offer.conditions?.refund_before_departure,
      change_before_departure: offer.conditions?.change_before_departure,
    },
    payment_requirements: {
      requires_instant_payment: offer.payment_requirements?.requires_instant_payment || false,
      payment_required_by: offer.payment_requirements?.payment_required_by,
    },
  };
};