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
  flight: "211",
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
      const data = await flightService.getFlights(currentFilters);

      console.log("Fetched Flights:", {
        groups: data.length,
        filters: currentFilters,
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
