export interface BookingTrend {
  x: string;
  y: number;
}

export interface DestinationData {
  id: string;
  value: number;
}

export interface BookingStats {
  trends: BookingTrend[];
  destinations: DestinationData[];
}