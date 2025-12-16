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
  error: string | null;

  fetchFlights: (
    newFilters?: Partial<FlightFilters>,
    isRefresh?: boolean,
  ) => Promise<void>;

  setFilters: (newFilters: Partial<FlightFilters>) => void;
  selectFlightById: (id: string) => void;
}

export const useFlightStore = create<FlightStore>((set, get) => ({
  flightGroups: [],
  selectedFlight: null,
  filters: INITIAL_FILTERS,
  isLoading: false,
  isRefreshing: false,
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
      const data = await flightService.getFlights({
        ...get().filters,
        ...customFilters,
      });

      set({
        flightGroups: data,
        isLoading: false,
        isRefreshing: false,
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

  selectFlightById: (id) => {
    const allFlights = get().flightGroups.flat();
    const found = allFlights.find((f) => f.id === id) || null;
    set({ selectedFlight: found });
  },
}));
