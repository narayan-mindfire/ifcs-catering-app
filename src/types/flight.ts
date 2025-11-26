// types/flight.ts

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

export interface PreparationStatus {
  sealTagNumber: string;
  assemblyProcessFlag: string;
  loadedTruckFlag: string;
}

export interface Flight {
  id: string;
  flightNumber: string;

  // Directions and Locations
  direction: string | null;
  departureDestination: string;
  departureGate: string | null;
  arrivalDestination: string;
  arrivalGate: string | null;

  // Departure Times
  scheduledDeparture: string;
  estimatedDeparture: string | null;
  actualDeparture: string | null;
  scheduledDepartureUtc: string;
  estimatedDepartureUtc: string | null;
  actualDepartureUtc: string | null;

  // Arrival Times
  scheduledArrival: string;
  estimatedArrival: string | null;
  actualArrival: string | null;
  scheduledArrivalUtc: string;
  estimatedArrivalUtc: string | null;
  actualArrivalUtc: string | null;

  // Status and Flags
  status: string | null;
  isCancelled: boolean;
  preparationStatus: PreparationStatus; // Added based on new JSON

  // Routes & Pairing
  pairRoute: string | null;
  pairPosition: number;
  pairType: string | null;

  // Relations
  aircraft: Aircraft | null;
  airline: Airline | null;
  passengers: any; // Or use PaxCounts if the data matches
  loadingPlan: { name: string } | null;

  // Meta
  flightType: string | null; // Added based on new JSON
  flightTypeIataCode: string | null;
  cutoffTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FlightApiResponse {
  success: boolean;
  data: Flight[][];
  meta: any;
}
