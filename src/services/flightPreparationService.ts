import apiClient from "../api/axiosClient";
import {
  AddUserSignatureResponse,
  PreparationDetailData,
  PreparationFlagUpdatePayload,
  PreparationItem,
  PrintData,
} from "../types/preparations";
import { log } from "../utils/logger";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const flightPreparationService = {
  getPreparations: async (flightId: string): Promise<PreparationItem[]> => {
    const response = await apiClient.get<ApiResponse<PreparationItem[]>>(
      `/flights/${flightId}/preparations`,
      {
        params: { includeContent: true },
      },
    );

    if (response.data.success) {
      return response.data.data || [];
    }
    throw new Error(response.data.message || "Failed to fetch preparations");
  },

  getPreparationById: async (
    flightId: string,
    preparationId: string,
  ): Promise<PreparationDetailData> => {
    const response = await apiClient.get<ApiResponse<PreparationDetailData>>(
      `/flights/${flightId}/preparations/${preparationId}`,
    );
    if (response.data.success) {
      return response.data.data;
    }
    log.info("PREPARATION BY ID WE GOT: ", response.data.data);
    throw new Error(
      response.data.message || "Failed to fetch preparation details",
    );
  },

  updatePreparationFlag: async (
    flightId: string,
    preparationId: string,
    payload: PreparationFlagUpdatePayload,
  ): Promise<PreparationItem> => {
    const response = await apiClient.patch<ApiResponse<PreparationItem>>(
      `/flights/${flightId}/preparation-flags/${preparationId}`,
      payload,
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update flag");
  },

  printPreparation: async (flightId: string): Promise<string> => {
    const response = await apiClient.post<ApiResponse<PrintData>>(
      `/flights/${flightId}/preparations/print`,
    );

    if (response.data.success && response.data.data?.fileUrl) {
      return response.data.data.fileUrl;
    }
    throw new Error(response.data.message || "Failed to generate print file");
  },

  getUserSignatures: async (
    flightId: string,
    userId: string,
  ): Promise<any[]> => {
    const response = await apiClient.get<any>(
      `/flights/${flightId}/users/signatures`,
      {
        params: { userId },
      },
    );

    if (response.data.success && response.data.data) {
      return Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
    }
    return [];
  },

  addUserSignature: async (
    flightId: string,
    userId: string,
    cleanSignature: string,
  ): Promise<void> => {
    const payload = {
      userId,
      signature: cleanSignature,
    };

    const response = await apiClient.post<AddUserSignatureResponse>(
      `/flights/${flightId}/users/signatures`,
      payload,
    );

    if (!response.data.success) {
      throw new Error("Failed to add signature");
    }
  },

  linkPriorPreparation: async (
    flightId: string,
    currentPrepId: string,
    oldPrepId: string,
  ): Promise<void> => {
    try {
      const currentDetailsResponse = await apiClient.get<
        ApiResponse<PreparationDetailData>
      >(`/flights/${flightId}/preparations/${currentPrepId}`);

      if (!currentDetailsResponse.data.success) {
        throw new Error(
          "Failed to fetch current preparation details before linking",
        );
      }

      const currentData = currentDetailsResponse.data.data;

      // 2. Prepare Payload: Merge existing data with new link
      const payload = {
        ...currentData,
        priorFlightPreparationId: oldPrepId,
      };

      const response = await apiClient.put<ApiResponse<PreparationItem>>(
        `/flights/${flightId}/preparations/${currentPrepId}`,
        payload,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to update preparation link",
        );
      }
    } catch (error: any) {
      console.error("Link Prior Prep API Error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to link preparations",
      );
    }
  },
};
