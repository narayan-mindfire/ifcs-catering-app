export interface Aircraft {
  id: string;
  type: string;
  registration: string;
  aircraftGroup: string | null;
  designator: string | null;
}

export interface AircraftConfig {
  id: string;
  fmId: string;
  lopa: string | null;
  name: string;
}

export interface MealPlan {
  id: string;
  fmId: string;
  name: string;
}

export interface Airline {
  id: string;
  fmId: string;
  code: string | null;
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

export interface Gate {
  id: string;
  type: "Departure" | "Arrival" | string;
  gateId: string | null;
  gate: string | null;
  gateFrom: string;
  gateTo: string;
  scheduledTime: string;
  sequence: number;
  stand: string | null;
  standFrom: string;
  standTo: string;
}

export interface LoadingPlan {
  id: string;
  fmId: string;
  value: string;
  name: string;
  isSetupRecord: boolean;
}

export interface Flight {
  id: string;
  fmId: string | null;

  // Flags
  isCancelled: boolean;
  isPrepared: boolean;

  // Relations (IDs)
  loadingPlanId: string | null;
  menuId: string | null;
  parentId: string | null;
  aircraftConfigId: string | null;
  aircraftId: string | null;
  airlineId: string | null;

  // Flight Info
  flightNumber: string;
  flightNumberSuffix: string | null;
  direction: "ARR" | "DEP" | string | null;

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

  // Status & Pairing
  status: string | null;
  pairPosition: number;
  pairRoute: string | null;
  pairType: string | null;

  cutoffTime: string | null;
  flightType: string | null;
  flightTypeIataCode: string | null;

  // Nested Objects
  departureStation: Station;
  arrivalStation: Station;
  aircraft: Aircraft | null;
  aircraftConfig: AircraftConfig | null;
  airline: Airline | null;
  loadingPlan: LoadingPlan | null;
  mealPlan: MealPlan | null;

  passengers: any | null;
  preparationStatus: PreparationStatus;
  prepStatus: string;

  gate: Gate | null;

  createdAt: string;
  updatedAt: string;
  __sortIndex?: number;
}
export interface FlightFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  isPrepared?: boolean;

  direction?: "ARR" | "DEP";
  status?: string[];
  airlineIds?: string[];
  hideCancelled?: boolean;
  isCancelled?: boolean;

  page?: number;
  pageSize?: number;
  limit?: number;

  sortBy?: keyof Flight;
  sortOrder?: "asc" | "desc";
  order?: "asc" | "desc";

  client?: string;
  station?: string;
  route?: string;
  flight?: string;
}

export interface Station {
  code: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export interface FlightApiResponse {
  success: boolean;
  message: string;
  data: Flight[][];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: string;
      pages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface FlightServiceResponse {
  data: Flight[][];
  meta: {
    hasNextPage: boolean;
    page: number;
    total: number;
  };
}

export interface SingleFlightResponse {
  success: boolean;
  message: string;
  data: Flight[];
}
