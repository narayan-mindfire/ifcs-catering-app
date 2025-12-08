import { create } from "zustand";
import { Flight, FlightApiResponse, FlightFilters } from "../types/flight";
import apiClient from "../api/axiosClient";
// import { mockPreparations } from "../const/PreparationData"; // Removed as we are using real API

const INITIAL_FILTERS: FlightFilters = {
  page: 1,
  limit: 50,
  sortBy: "scheduledDeparture",
  order: "desc",
  startDate: "2025-12-03",
  endDate: "2025-12-03",
  client: "Oman Air",
  isCancelled: false,
  isPrepared: false,
};

interface FlightStore {
  flightGroups: Flight[][];
  selectedFlight: Flight | null;
  filters: FlightFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFlights: (newFilters?: FlightFilters) => Promise<void>;
  setFilters: (newFilters: FlightFilters) => void;
  selectFlightById: (id: string | number) => void;
}

export const useFlightStore = create<FlightStore>((set, get) => ({
  flightGroups: [],
  selectedFlight: null,
  filters: INITIAL_FILTERS,
  isLoading: false,
  error: null,

  preparations: [],
  isPrepLoading: false,

  setFilters: (newFilters: FlightFilters) => {
    set({ filters: newFilters });
    // Trigger fetch immediately when filters are set
    get().fetchFlights(newFilters);
  },

  fetchFlights: async (customFilters?: FlightFilters) => {
    set({ isLoading: true, error: null });

    const currentFilters = customFilters || get().filters;

    try {
      // 1. Construct API Query Parameters from currentFilters (Dynamic)
      const params: Record<string, any> = {
        page: currentFilters.page,
        limit: currentFilters.limit,
        sortBy: currentFilters.sortBy,
        order: currentFilters.order,
      };

      // 2. Map Filter Fields
      if (currentFilters.search) {
        params.search = currentFilters.search;
      }

      // Map 'startDate' -> 'fromDate' (API expects fromDate)
      if (currentFilters.startDate) {
        params.fromDate = currentFilters.startDate;
      }

      // Map 'endDate' -> 'toDate' (if exists)
      if (currentFilters.endDate) {
        params.toDate = currentFilters.endDate;
      }

      if (currentFilters.flight) params.flightNumber = currentFilters.flight;
      if (currentFilters.status) params.status = currentFilters.status;
      if (currentFilters.client) params.client = currentFilters.client;
      if (currentFilters.station) params.station = currentFilters.station;
      if (currentFilters.route) params.route = currentFilters.route;

      // 3. Handle Boolean Filters (explicit check for undefined)
      if (typeof currentFilters.isCancelled !== "undefined") {
        params.isCancelled = currentFilters.isCancelled;
      }
      if (typeof currentFilters.isPrepared !== "undefined") {
        params.isPrepared = currentFilters.isPrepared;
      }

      // 4. Call API with Staging URL Override
      const response = await apiClient.get<FlightApiResponse>("/flights", {
        baseURL: "https://oman.stg.api.ifcs.aero/api/v1",
        params,
      });

      const actualData = response.data?.data;
      console.groupEnd();

      set({
        flightGroups: actualData || [],
        isLoading: false,
        filters: currentFilters,
      });
    } catch (err: any) {
      console.error("❌ Fetch Flights Error:", err);
      if (err.response) {
        console.error("Error Response Data:", err.response.data);
      }
      set({ error: "Failed to fetch flights", isLoading: false });
    }
  },

  selectFlightById: (id) => {
    const { flightGroups } = get();
    const allFlights = flightGroups.flat();
    const foundFlight = allFlights.find((f) => f.id === id);
    set({ selectedFlight: foundFlight || null });
  },
}));
