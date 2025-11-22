export interface Aircraft {
  id: string;
  type: string;
  registration: string;
  designator: string;
}

export interface Airline {
  id: string;
  code: string;
  name: string;
  logo: string | null;
  designator: string | null;
}

export interface PaxCounts {
  totalCount: number;
  businessCount: number;
  economyCount: number;
  crewCount: number;
}

export interface Flight {
  passengers: any;
  id: string;
  flightNumber: string;
  direction: string;
  departureDestination: string;
  departureGate: string | null;
  scheduledDeparture: string;
  arrivalDestination: string;
  arrivalGate: string | null;
  scheduledArrival: string;
  status: string | null;
  isCancelled: boolean;

  pairRoute: string;
  pairPosition: number;

  aircraft: Aircraft | null;
  airline: Airline | null;
  paxCounts: PaxCounts | null;
  loadingPlan: { name: string } | null;
  flightTypeIataCode: string | null;
  cutoffTime: string | null;
}

export interface FlightApiResponse {
  success: boolean;
  data: Flight[][];
  meta: any;
}
