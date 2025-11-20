import apiClient from "./axiosClient";
import { FlightApiResponse, Flight } from "../types/flight";

export const flightService = {
  getAll: async (): Promise<Flight[]> => {
    const response = await apiClient.get<FlightApiResponse>("/flights");
    const nestedFlights = response.data.data;
    const flatFlights = nestedFlights.flat();

    return flatFlights;
  },
};
