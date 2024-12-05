import type { DuffelOffer } from '../types/duffel';
import type { Flight } from '@/components/flight-search/FlightCard';

export const mapDuffelOfferToFlight = (offer: DuffelOffer): Flight => ({
  id: offer.id,
  airline: offer.owner.name,
  airlineLogoUrl: offer.owner.logo_symbol_url,
  airlineCode: offer.owner.iata_code,
  flightNumber: offer.slices[0].segments[0].operating_carrier_flight_number,
  departureTime: new Date(offer.slices[0].segments[0].departing_at).toLocaleTimeString(),
  arrivalTime: new Date(offer.slices[0].segments[offer.slices[0].segments.length - 1].arriving_at).toLocaleTimeString(),
  duration: offer.slices[0].duration,
  price: offer.total_amount,
  origin: offer.slices[0].origin.iata_code,
  destination: offer.slices[0].destination.iata_code,
  aircraft: offer.slices[0].segments[0].aircraft.name,
  cabinClass: offer.passenger_identity_documents_required ? 'First/Business' : 'Economy',
  operatingCarrier: offer.slices[0].segments[0].operating_carrier.name,
  departureDate: offer.slices[0].segments[0].departing_at,
  segments: offer.slices[0].segments.map(segment => ({
    origin: segment.origin.iata_code,
    destination: segment.destination.iata_code,
    departureTime: new Date(segment.departing_at).toLocaleTimeString(),
    arrivalTime: new Date(segment.arriving_at).toLocaleTimeString(),
    // Calculate segment duration from departing and arriving times
    duration: `${Math.round((new Date(segment.arriving_at).getTime() - new Date(segment.departing_at).getTime()) / (1000 * 60))}m`
  })),
  services: {
    seatSelection: offer.passenger_identity_documents_required,
    meals: offer.slices[0].segments.map(s => s.meal_service || []).flat(),
    baggage: {
      included: offer.passengers[0].baggages && offer.passengers[0].baggages.length > 0,
      details: `${offer.passengers[0].baggages?.[0]?.quantity || 0} bags included`
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
});