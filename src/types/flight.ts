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

export interface LoadingPlan {
  name: string;
  status?: string;
  version?: number;
}

export interface Flight {
  id: string;
  flightNumber: string;

  // Directions and Locations
  direction: "ARR" | "DEP" | string | null; // Typed string union for better DX, fallback to string
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
  preparationStatus: PreparationStatus;

  // Routes & Pairing
  pairRoute: string | null;
  pairPosition: number;
  pairType: string | null;

  // Relations
  aircraft: Aircraft | null;
  airline: Airline | null;
  passengers: PaxCounts | null; // Updated from 'any' to specific type
  loadingPlan: LoadingPlan | null;

  // Meta
  flightType: string | null;
  flightTypeIataCode: string | null;
  cutoffTime: string | null;
  createdAt: string;
  updatedAt: string;
}

// Filter Definition
export interface FlightFilters {
  // Search & Dates
  search?: string;
  startDate?: string;
  endDate?: string;
  isPrepared?: boolean;

  // Core Attributes
  direction?: "ARR" | "DEP";
  status?: string[];
  airlineIds?: string[];
  hideCancelled?: boolean;
  isCancelled?: boolean; // Added to match store usage

  // Pagination
  page?: number;
  pageSize?: number;
  limit?: number; // Added to match store usage

  // Sorting
  sortBy?: keyof Flight;
  sortOrder?: "asc" | "desc";
  order?: "asc" | "desc"; // Added to match store usage

  // Specific Metadata Filters (Added from store usage)
  client?: string;
  station?: string;
  route?: string;
  flight?: string; // for flightNumber search
}

export interface FlightApiResponse {
  success: boolean;
  data: Flight[][]; // Preserved user's structure (Array of Arrays)
  meta: {
    total: number;
    page: number;
    last_page: number;
    per_page: number;
  };
}
