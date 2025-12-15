import { create } from "zustand";
import { Flight, FlightApiResponse, FlightFilters } from "../types/flight";
import apiClient from "../api/axiosClient";

const INITIAL_FILTERS: FlightFilters = {
  page: 1,
  limit: 50,
  sortBy: "scheduledDeparture",
  order: "desc",
  // 1. Set main view to Today (13th)
  startDate: "2025-12-13",
  endDate: "2025-12-13",
  client: "Oman Air",
  // Remove 'flight' here so we get ALL flights for today
  isCancelled: false,
  isPrepared: false,
};

interface FlightStore {
  flightGroups: Flight[][];
  selectedFlight: Flight | null;
  filters: FlightFilters;
  isLoading: boolean;
  error: string | null;

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

  setFilters: (newFilters: FlightFilters) => {
    set({ filters: newFilters });
    get().fetchFlights(newFilters);
  },

  fetchFlights: async (customFilters?: FlightFilters) => {
    set({ isLoading: true, error: null });

    const currentFilters = customFilters || get().filters;

    try {
      // --- PREPARE QUERY 1: Main List (Dec 13th) ---
      const mainParams: Record<string, any> = {
        page: currentFilters.page,
        limit: currentFilters.limit,
        sortBy: currentFilters.sortBy,
        order: currentFilters.order,
      };

      if (currentFilters.search) mainParams.search = currentFilters.search;
      if (currentFilters.startDate)
        mainParams.fromDate = currentFilters.startDate;
      if (currentFilters.endDate) mainParams.toDate = currentFilters.endDate;
      if (currentFilters.flight)
        mainParams.flightNumber = currentFilters.flight;
      if (currentFilters.status) mainParams.status = currentFilters.status;
      if (currentFilters.client) mainParams.client = currentFilters.client;
      if (currentFilters.station) mainParams.station = currentFilters.station;
      if (currentFilters.route) mainParams.route = currentFilters.route;

      if (typeof currentFilters.isCancelled !== "undefined") {
        mainParams.isCancelled = currentFilters.isCancelled;
      }
      if (typeof currentFilters.isPrepared !== "undefined") {
        mainParams.isPrepared = currentFilters.isPrepared;
      }

      // --- PREPARE QUERY 2: Specific Flight 211 (Dec 3rd) ---
      // We only fetch this if we are on Page 1 to avoid duplicates on pagination
      const shouldFetchSpecificFlight = currentFilters.page === 1;

      const promises = [
        apiClient.get<FlightApiResponse>("/flights", { params: mainParams }),
      ];

      if (shouldFetchSpecificFlight) {
        promises.push(
          apiClient.get<FlightApiResponse>("/flights", {
            params: {
              flightNumber: "211",
              fromDate: "2025-12-04",
              toDate: "2025-12-04",
              client: "Oman Air", // Optional: keep consistency
            },
          }),
        );
      }

      // --- EXECUTE ---
      const responses = await Promise.all(promises);

      const mainData = responses[0].data?.data || [];
      const specificData = responses[1]?.data?.data || [];

      // --- MERGE ---
      // Put specific flight (211) at the END as requested
      // We use a Set or check IDs to avoid duplicates if 211 happens to be in the main list too
      const mergedData = [...mainData];

      specificData.forEach((specialFlightGroup) => {
        // Assuming flightGroup is Flight[] (paired) or single Flight object
        // We check if this specific group is already in mainData to avoid duplication
        const isDuplicate = mainData.some((mainGroup) => {
          // Simple check: compare IDs of the first flight in the group
          const mainId = Array.isArray(mainGroup)
            ? mainGroup[0].id
            : (mainGroup as any).id;
          const specialId = Array.isArray(specialFlightGroup)
            ? specialFlightGroup[0].id
            : (specialFlightGroup as any).id;
          return mainId === specialId;
        });

        if (!isDuplicate) {
          mergedData.push(specialFlightGroup);
        }
      });

      console.log("Merged Flights:", mergedData);

      set({
        flightGroups: mergedData,
        isLoading: false,
        filters: currentFilters,
      });
    } catch (err: any) {
      console.error("Fetch Flights Error:", err);
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
