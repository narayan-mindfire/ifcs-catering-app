import apiClient from "../api/axiosClient";
import { FlightApiResponse, FlightFilters, Flight } from "../types/flight";

export const flightService = {
  getFlights: async (filters: FlightFilters): Promise<Flight[][]> => {
    const params: Record<string, any> = {
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      order: filters.order,
    };

    if (filters.startDate) params.fromDate = filters.startDate;
    if (filters.endDate) params.toDate = filters.endDate;
    if (filters.flight) params.flightNumber = filters.flight;
    if (filters.search) params.search = filters.search;
    if (filters.client) params.client = filters.client;
    if (filters.station) params.station = filters.station;
    if (filters.route) params.route = filters.route;
    if (filters.status) params.status = filters.status;

    if (typeof filters.isCancelled !== "undefined") {
      params.isCancelled = filters.isCancelled;
    }

    if (typeof filters.isPrepared !== "undefined") {
      params.isPrepared = filters.isPrepared;
    }

    const response = await apiClient.get<FlightApiResponse>("/flights", {
      params,
    });

    return response.data?.data || [];
  },
};
