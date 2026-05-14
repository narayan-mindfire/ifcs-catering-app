import {
  AddUserSignatureResponse,
  PreparationDetailData,
  PreparationDetailResponse,
  PreparationFlagUpdatePayload,
  PreparationItem,
  PrintData,
  Truck,
  UserSignature,
  UserSignatureResponse,
} from "@/types/preparations";
import { log } from "@/utils/logger";

import apiClient from "../api/axiosClient";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const flightPreparationService = {
  getPreparations: async (
    flightId: string,
  ): Promise<{ preparations: PreparationDetailData[]; trucks: Truck[] }> => {
    const response = await apiClient.get<PreparationDetailResponse>(
      `/flights/${flightId}/preparations`,
      {
        params: { includeContent: true },
      },
    );

    if (response.data.success && response.data.data) {
      const data = response.data.data;
      if ("preparation" in data) {
        const { preparation, trucks } = data;
        const preparations =
          (Array.isArray(preparation) ? preparation : [preparation]) || [];
        return { preparations, trucks: trucks || [] };
      } else {
        // New format where data is preparation(s)
        const preparations = Array.isArray(data)
          ? (data as PreparationDetailData[])
          : [data as PreparationDetailData];
        const trucks = Array.isArray(data)
          ? [] // Or extract from each prep if needed, but trucks is usually top-level
          : (data as PreparationDetailData).trucks || [];
        return { preparations, trucks };
      }
    }
    throw new Error(response.data.message || "Failed to fetch preparations");
  },

  getPreparationById: async (
    flightId: string,
    preparationId: string,
  ): Promise<PreparationDetailData> => {
    const response = await apiClient.get<PreparationDetailResponse>(
      `/flights/${flightId}/preparations/${preparationId}`,
    );
    if (response.data?.success && response.data?.data) {
      const data = response.data.data;

      if ("preparation" in data) {
        const { preparation, trucks } = data;
        const prep = Array.isArray(preparation)
          ? preparation.find((p) => p.id === preparationId) || preparation[0]
          : preparation;

        return {
          ...prep,
          trucks,
        };
      } else {
        const prep = data as PreparationDetailData;
        return {
          ...prep,
          trucks: prep.trucks || [],
        };
      }
    }
    throw new Error(
      response.data?.message || "Failed to fetch preparation details",
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
    userId?: string,
  ): Promise<UserSignature[]> => {
    const params = userId ? { byUser: true } : {};
    const response = await apiClient.get<UserSignatureResponse>(
      `/flights/${flightId}/users/signatures`,
      {
        params,
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
    cleanSignature: string,
  ): Promise<void> => {
    const payload = {
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
      const currentDetailsResponse =
        await apiClient.get<PreparationDetailResponse>(
          `/flights/${flightId}/preparations/${currentPrepId}`,
        );

      if (
        !currentDetailsResponse.data?.success ||
        !currentDetailsResponse.data?.data
      ) {
        throw new Error(
          "Failed to fetch current preparation details before linking",
        );
      }

      const data = currentDetailsResponse.data.data;
      let currentData: PreparationDetailData;

      if ("preparation" in data) {
        const preparation = data.preparation;
        currentData = Array.isArray(preparation)
          ? preparation.find((p) => p.id === currentPrepId) || preparation[0]
          : preparation;
      } else {
        currentData = data as PreparationDetailData;
      }

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
    } catch (error: unknown) {
      log.error("Link Prior Prep API Error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to link preparations";
      throw new Error(message);
    }
  },

  deleteUserSignature: async (
    flightId: string,
    signatureId: string,
  ): Promise<void> => {
    const response = await apiClient.delete(
      `/flights/${flightId}/users/signatures/${signatureId}`,
    );

    if (response.status !== 204 && !response.data.success) {
      throw new Error(response.data.message || "Failed to delete signature");
    }
  },
};
