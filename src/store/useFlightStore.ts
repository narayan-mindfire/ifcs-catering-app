import { create } from "zustand";
import { Flight, FlightApiResponse } from "../types/flight";
// import { Flight } from "../types/flight";
import { Preparation, PreparationApiResponse } from "../types/preparations";
import apiClient from "../api/axiosClient";
// import { flights } from "../const/mocks/mockFlightResponse";
import { mockPreparations } from "../const/PreparationData";

interface FlightStore {
  flightGroups: Flight[][];
  selectedFlight: Flight | null;
  isLoading: boolean;
  preparations: Preparation[];
  isPrepLoading: boolean;
  error: string | null;
  fetchFlights: () => Promise<void>;
  selectFlightById: (id: string | number) => void;
  fetchPreparations: (flightId: string) => Promise<void>;
}

export const useFlightStore = create<FlightStore>((set, get) => ({
  flightGroups: [],
  selectedFlight: null,
  isLoading: false,
  error: null,
  preparations: [],
  isPrepLoading: false,

  fetchFlights: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<FlightApiResponse>("/flights");
      set({ flightGroups: response.data.data, isLoading: false });
    } catch (err: any) {
      console.error(err);
      set({ error: "Failed to fetch flights", isLoading: false });
    }
  },

  // fetchFlights: async () => {
  //   set({ isLoading: true, error: null });

  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     set({
  //       flightGroups: flights.data as unknown as Flight[][],
  //       isLoading: false,
  //     });
  //   } catch (err: any) {
  //     console.error(err);
  //     set({ error: "Failed to fetch flights", isLoading: false });
  //   }
  // },

  selectFlightById: (id) => {
    const { flightGroups } = get();
    const allFlights = flightGroups.flat();
    const foundFlight = allFlights.find((f) => f.id === id);
    set({ selectedFlight: foundFlight || null });
  },
  // fetchPreparations: async (flightId: string) => {
  //   set({ isPrepLoading: true, error: null });
  //   try {
  //     const response = await apiClient.get<PreparationApiResponse>(
  //       `/flights/${flightId}/preparations`,
  //     );

  //     // Now TypeScript knows:
  //     // response.data is PreparationApiResponse (Object)
  //     // response.data.data is Preparation[] (Array)
  //     set({ preparations: response.data.data, isPrepLoading: false });
  //   } catch (err: any) {
  //     console.error("Prep fetch error:", err);
  //     set({ error: "Failed to fetch preparations", isPrepLoading: false });
  //   }
  // },

  fetchPreparations: async (flightId: string) => {
    set({ isPrepLoading: true, error: null, preparations: [] });

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockData = mockPreparations[0] || [];
      console.log("MOCK DATA: ", mockData);
      console.log("SETTING MOCK DATA: ", mockData, "for flight id: ", flightId);
      const mockResponse: PreparationApiResponse = {
        success: true,
        message:
          mockData.length > 0
            ? "Preparations retrieved successfully"
            : "No preparations found for this flight",
        data: mockData,
      };

      set({ preparations: mockResponse.data, isPrepLoading: false });
    } catch (err: any) {
      console.error("Prep fetch error:", err);
      set({ error: "Failed to fetch preparations", isPrepLoading: false });
    }
  },
}));
