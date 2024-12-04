import airportsData from '../../../airports.json';

interface Airport {
  iata_code: string;
  name: string;
  city: string;
  country: string;
  _geoloc?: {
    lat: number;
    lng: number;
  };
}

export const searchAirports = (query: string): Airport[] => {
  if (query.length < 2) return [];

  return airportsData.filter(airport => 
    airport.iata_code.toLowerCase().includes(query.toLowerCase()) ||
    airport.name.toLowerCase().includes(query.toLowerCase()) ||
    airport.city.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);
};

export const getAirportByCode = (iataCode: string): Airport | undefined => {
  return airportsData.find(
    airport => airport.iata_code.toLowerCase() === iataCode.toLowerCase()
  );
};