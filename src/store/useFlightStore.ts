import { create } from "zustand";

import { destinationService } from "../services/destinationService"; // Import new service
import { flightService } from "../services/flightService";
import { Destination } from "../types/destination"; // Import new type
import { Flight, FlightFilters } from "../types/flight";

const getTodayDateString = () => new Date().toISOString().split("T")[0];

const INITIAL_FILTERS: FlightFilters = {
  page: 1,
  limit: 50,
  sortBy: "groundPairing", // As requested
  order: "asc",
  startDate: getTodayDateString(),
  endDate: getTodayDateString(),
  client: "Oman Air",
  isCancelled: false,
  isPrepared: false,
  flight: "",
  station: "MCT", // Default
};

interface FlightStore {
  // --- Flight State ---
  flightGroups: Flight[][];
  selectedFlight: Flight | null;
  filters: FlightFilters;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  error: string | null;

  // --- Destination State (New) ---
  destinations: Destination[];
  isDestinationsLoading: boolean;

  // --- Actions ---
  fetchFlights: (
    newFilters?: Partial<FlightFilters>,
    isRefresh?: boolean,
  ) => Promise<void>;
  fetchFlightById: (id: string) => Promise<void>;
  loadMoreFlights: () => Promise<void>;
  setFilters: (newFilters: Partial<FlightFilters>) => void;
  selectFlightById: (id: string) => void;

  // --- New Destination Action ---
  fetchDestinations: (search?: string) => Promise<void>;
}

export const useFlightStore = create<FlightStore>((set, get) => ({
  flightGroups: [],
  selectedFlight: null,
  filters: INITIAL_FILTERS,
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  hasNextPage: true,
  error: null,

  // Destination Initial State
  destinations: [],
  isDestinationsLoading: false,

  setFilters: (newFilters) => {
    const currentFilters = get().filters;
    const updatedFilters: FlightFilters = {
      ...currentFilters,
      ...newFilters,
    };

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
      newFilters.station !== undefined || // Reset page if station changes
      newFilters.route !== undefined ||
      newFilters.client !== undefined;

    if (shouldResetPage) {
      updatedFilters.page = 1;
    }

    set({ filters: updatedFilters });
    get().fetchFlights(updatedFilters, false);
  },

  fetchFlights: async (customFilters, isRefresh = false) => {
    set({
      isLoading: !isRefresh,
      isRefreshing: isRefresh,
      error: null,
    });

    try {
      const mergedFilters = {
        ...get().filters,
        ...customFilters,
      };

      const response = await flightService.getFlights(mergedFilters);

      set({
        flightGroups: response.data,
        isLoading: false,
        isRefreshing: false,
        hasNextPage: response.meta.hasNextPage,
        filters: mergedFilters,
      });
    } catch (_e) {
      set({
        error: "Failed to fetch flights",
        isLoading: false,
        isRefreshing: false,
      });
    }
  },

  fetchFlightById: async (flightId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await flightService.getFlightById(flightId);
      const foundFlight =
        data.find((f) => f.id === flightId) || data[0] || null;

      set({
        selectedFlight: foundFlight,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("Fetch Flight Error:", err);
      set({
        error: err.message || "Failed to fetch flight details",
        isLoading: false,
      });
    }
  },

  loadMoreFlights: async () => {
    const { isLoadingMore, hasNextPage, filters, flightGroups } = get();

    if (isLoadingMore || !hasNextPage) return;

    set({ isLoadingMore: true, error: null });

    try {
      const nextPage = (filters.page || 1) + 1;
      const response = await flightService.getFlights({
        ...filters,
        page: nextPage,
      });

      const existingIds = new Set(
        flightGroups.flat().map((flight) => flight.id),
      );

      const newGroups = response.data.filter((group) =>
        group.every((flight) => !existingIds.has(flight.id)),
      );

      set({
        flightGroups: [...flightGroups, ...newGroups],
        isLoadingMore: false,
        hasNextPage: response.meta.hasNextPage,
        filters: { ...filters, page: nextPage },
      });
    } catch (_e) {
      set({
        error: "Failed to load more flights",
        isLoadingMore: false,
      });
    }
  },

  selectFlightById: (id) => {
    const allFlights = get().flightGroups.flat();
    const found = allFlights.find((f) => f.id === id) || null;
    set({ selectedFlight: found });
  },

  // --- New Destination Logic ---
  fetchDestinations: async (search = "") => {
    set({ isDestinationsLoading: true });
    try {
      // Fetch destinations (defaulting to first page, limit 20)
      const response = await destinationService.getDestinations(search);
      set({
        destinations: response.data,
        isDestinationsLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch destinations", error);
      set({ isDestinationsLoading: false }); // Don't block UI on failure, just empty list
    }
  },
}));
