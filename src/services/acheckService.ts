import apiClient from "../api/axiosClient";
import {
  CreateACheckPayload,
  TruckACheck,
  UpdateACheckPayload,
} from "../types/acheck";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ListData<T> {
  data: T[];
  total: number;
}

export interface ACheckSearchParams {
  assignmentId?: string;
  truckId?: string;
  userId?: string;
  hasAccidentHazard?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}

export const acheckService = {
  /**
   * Search truck a-checks with optional filters.
   * Use assignmentId to find the a-check for a specific dispatcher assignment.
   */
  getAChecks: async (
    params: ACheckSearchParams = {},
  ): Promise<TruckACheck[]> => {
    const response = await apiClient.get<ApiResponse<ListData<TruckACheck>>>(
      "/truck-a-checks",
      { params },
    );
    return response.data.data?.data || [];
  },

  /**
   * Get a single truck a-check by ID.
   */
  getACheck: async (id: string): Promise<TruckACheck> => {
    const response = await apiClient.get<ApiResponse<TruckACheck>>(
      `/truck-a-checks/${id}`,
    );
    return response.data.data;
  },

  /**
   * Create a new truck a-check entry.
   */
  createACheck: async (payload: CreateACheckPayload): Promise<TruckACheck> => {
    const response = await apiClient.post<ApiResponse<TruckACheck>>(
      "/truck-a-checks",
      payload,
    );
    return response.data.data;
  },

  /**
   * Update an existing truck a-check (only mutable fields allowed by API).
   */
  updateACheck: async (
    id: string,
    payload: UpdateACheckPayload,
  ): Promise<TruckACheck> => {
    const response = await apiClient.put<ApiResponse<TruckACheck>>(
      `/truck-a-checks/${id}`,
      payload,
    );
    return response.data.data;
  },
};
