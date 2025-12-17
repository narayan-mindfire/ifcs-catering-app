import { create } from "zustand";
import { Flight, FlightFilters } from "../types/flight";
import { flightService } from "../services/flightService";

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
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  error: string | null;

  fetchFlights: (
    newFilters?: Partial<FlightFilters>,
    isRefresh?: boolean,
  ) => Promise<void>;

  loadMoreFlights: () => Promise<void>;
  setFilters: (newFilters: Partial<FlightFilters>) => void;
  selectFlightById: (id: string) => void;
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
      newFilters.station !== undefined ||
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      set({
        error: "Failed to fetch flights",
        isLoading: false,
        isRefreshing: false,
      });
    }
  },

  loadMoreFlights: async () => {
    const { isLoadingMore, hasNextPage, filters, flightGroups } = get();

    // Prevent duplicate requests
    if (isLoadingMore || !hasNextPage) return;

    set({ isLoadingMore: true, error: null });

    try {
      const nextPage = (filters.page || 1) + 1;
      const response = await flightService.getFlights({
        ...filters,
        page: nextPage,
      });

      // Create a Set of existing flight IDs to check for duplicates
      const existingIds = new Set(
        flightGroups.flat().map((flight) => flight.id),
      );

      // Filter out flight groups that contain flights we already have
      const newGroups = response.data.filter((group) =>
        group.every((flight) => !existingIds.has(flight.id)),
      );

      set({
        flightGroups: [...flightGroups, ...newGroups],
        isLoadingMore: false,
        hasNextPage: response.meta.hasNextPage,
        filters: { ...filters, page: nextPage },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
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
}));
