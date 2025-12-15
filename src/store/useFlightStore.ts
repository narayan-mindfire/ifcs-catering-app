import { create } from "zustand";
import { Flight, FlightApiResponse, FlightFilters } from "../types/flight";
import apiClient from "../api/axiosClient";

const getTodayDateString = () => new Date().toISOString().split("T")[0];

const INITIAL_FILTERS: FlightFilters = {
  page: 1,
  limit: 50,
  sortBy: "scheduledDeparture",
  order: "asc",
  startDate: getTodayDateString(),
  endDate: getTodayDateString(),
  client: "Oman Air",
  isCancelled: false,
  isPrepared: false,
  flight: "",
};

interface FlightStore {
  flightGroups: Flight[][];
  selectedFlight: Flight | null;
  filters: FlightFilters;
  isLoading: boolean;
  error: string | null;

  fetchFlights: (newFilters?: Partial<FlightFilters>) => Promise<void>;
  setFilters: (newFilters: Partial<FlightFilters>) => void;
  selectFlightById: (id: string) => void;
}

export const useFlightStore = create<FlightStore>((set, get) => ({
  flightGroups: [],
  selectedFlight: null,
  filters: INITIAL_FILTERS,
  isLoading: false,
  error: null,

  setFilters: (newFilters) => {
    const currentFilters = get().filters;
    const updatedFilters: FlightFilters = {
      ...currentFilters,
      ...newFilters,
    };

    // Reset pagination if search criteria change
    const shouldResetPage =
      (newFilters.startDate !== undefined &&
        newFilters.startDate !== currentFilters.startDate) ||
      (newFilters.endDate !== undefined &&
        newFilters.endDate !== currentFilters.endDate) ||
      (newFilters.flight !== undefined &&
        newFilters.flight !== currentFilters.flight) ||
      (newFilters.search !== undefined &&
        newFilters.search !== currentFilters.search) ||
      newFilters.status !== undefined ||
      newFilters.station !== undefined ||
      newFilters.route !== undefined ||
      newFilters.client !== undefined;

    if (shouldResetPage) {
      updatedFilters.page = 1;
    }

    set({ filters: updatedFilters });
    get().fetchFlights(updatedFilters);
  },

  fetchFlights: async (customFilters) => {
    set({ isLoading: true, error: null });

    const currentFilters: FlightFilters = {
      ...get().filters,
      ...customFilters,
    };

    try {
      const params: Record<string, any> = {
        page: currentFilters.page,
        limit: currentFilters.limit,
        sortBy: currentFilters.sortBy,
        order: currentFilters.order,
      };

      // ---- Map filters to API params ----
      if (currentFilters.startDate) params.fromDate = currentFilters.startDate;
      if (currentFilters.endDate) params.toDate = currentFilters.endDate;
      if (currentFilters.flight) params.flightNumber = currentFilters.flight;
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.client) params.client = currentFilters.client;
      if (currentFilters.station) params.station = currentFilters.station;
      if (currentFilters.route) params.route = currentFilters.route;
      if (currentFilters.status) params.status = currentFilters.status;

      if (typeof currentFilters.isCancelled !== "undefined") {
        params.isCancelled = currentFilters.isCancelled;
      }

      if (typeof currentFilters.isPrepared !== "undefined") {
        params.isPrepared = currentFilters.isPrepared;
      }

      const response = await apiClient.get<FlightApiResponse>("/flights", {
        params,
      });

      const data = response.data?.data || [];

      console.log("Fetched Flights:", {
        groups: data.length,
        params,
      });

      set({
        flightGroups: data,
        isLoading: false,
        filters: currentFilters,
      });
    } catch (err) {
      console.error("Fetch Flights Error:", err);
      set({
        error: "Failed to fetch flights",
        isLoading: false,
      });
    }
  },

  selectFlightById: (id) => {
    const allFlights = get().flightGroups.flat();
    const found = allFlights.find((f) => f.id === id) || null;
    set({ selectedFlight: found });
  },
}));
