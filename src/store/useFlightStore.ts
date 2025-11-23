import { create } from "zustand";
import { Flight } from "../types/flight";
// import apiClient from "../api/axiosClient";
import { flights } from "../const/mocks/mockFlightResponse";

interface FlightStore {
  flightGroups: Flight[][];
  isLoading: boolean;
  error: string | null;
  fetchFlights: () => Promise<void>;
}

// export const useFlightStore = create<FlightStore>((set) => ({
//   flightGroups: [],
//   isLoading: false,
//   error: null,

//   fetchFlights: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await apiClient.get<FlightApiResponse>("/flights");
//       console.log("==========================");
//       console.log(response.data);
//       console.log("========================");
//       set({ flightGroups: response.data.data, isLoading: false });
//     } catch (err: any) {
//       console.error(err);
//       set({ error: "Failed to fetch flights", isLoading: false });
//     }
//   },
// }));

export const useFlightStore = create<FlightStore>((set) => ({
  flightGroups: [],
  isLoading: false,
  error: null,

  fetchFlights: async () => {
    set({ isLoading: true, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({
        flightGroups: flights.data as unknown as Flight[][],
        isLoading: false,
      });
    } catch (err: any) {
      console.error(err);
      set({ error: "Failed to fetch flights", isLoading: false });
    }
  },
}));
