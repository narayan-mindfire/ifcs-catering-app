import apiClient from "../api/axiosClient";
import { DestinationApiResponse } from "../types/destination";

export const destinationService = {
  getDestinations: async (
    search?: string,
    page = 1,
    limit = 20,
  ): Promise<DestinationApiResponse> => {
    const params: Record<string, any> = {
      page,
      limit,
      sortBy: "code",
      order: "asc",
    };

    if (search) {
      params.search = search;
    }

    const response = await apiClient.get<DestinationApiResponse>(
      "/destinations",
      {
        params,
      },
    );

    return response.data;
  },
};
