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

// Helper to handle the specific flight ID swap logic
const resolveFlightId = (flightId: string) => {
  return flightId === "a990a562-e77e-4461-82ad-bbcd003ae4b1"
    ? "eaedd455-3e21-4c74-8a78-24989b0e82a8"
    : flightId;
};

export const flightPreparationService = {
  getPreparations: async (flightId: string): Promise<PreparationItem[]> => {
    const callFlight = resolveFlightId(flightId);
    log.info("Fetching preparations for flight:", flightId);

    const response = await apiClient.get<ApiResponse<PreparationItem[]>>(
      `/flights/${callFlight}/preparations`,
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
    const callFlight = resolveFlightId(flightId);
    const response = await apiClient.get<ApiResponse<PreparationDetailData>>(
      `/flights/${callFlight}/preparations/${preparationId}`,
    );
    log.info("Preparation Detail Response:", response.data.data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch preparation details",
    );
  },

  updatePreparationFlag: async (
    flightId: string,
    preparationId: string,
    payload: PreparationFlagUpdatePayload,
  ): Promise<PreparationItem> => {
    const callFlight = resolveFlightId(flightId);
    log.info("PAYLOAD", payload);
    const response = await apiClient.patch<ApiResponse<PreparationItem>>(
      `/flights/${callFlight}/preparation-flags/${preparationId}`,
      payload,
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update flag");
  },

  printPreparation: async (flightId: string): Promise<string> => {
    const callFlight = resolveFlightId(flightId);
    const response = await apiClient.post<ApiResponse<PrintData>>(
      `/flights/${callFlight}/preparations/print`,
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
    const callFlight = resolveFlightId(flightId);
    const response = await apiClient.get<any>(
      `/flights/${callFlight}/deliveries/user/signatures`,
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
    const callFlight = resolveFlightId(flightId);
    const payload = {
      userId,
      signature: cleanSignature,
    };

    const response = await apiClient.post<AddUserSignatureResponse>(
      `/flights/${callFlight}/deliveries/user-signatures`,
      payload,
    );

    if (!response.data.success) {
      throw new Error("Failed to add signature");
    }
    log.info("User signature added successfully:", response.data.data);
  },

  linkPriorPreparation: async (
    flightId: string,
    currentPrepId: string,
    oldPrepId: string,
  ): Promise<void> => {
    const callFlight = resolveFlightId(flightId);

    log.info("🔗 Linking Prior Prep:", {
      currentPrepId,
      oldPrepId,
    });

    try {
      // 1. Fetch current details to ensure we don't overwrite existing data
      // (Since PUT replaces the resource, we usually need the full object)
      const currentDetailsResponse = await apiClient.get<
        ApiResponse<PreparationDetailData>
      >(`/flights/${callFlight}/preparations/${currentPrepId}`);

      if (!currentDetailsResponse.data.success) {
        throw new Error(
          "Failed to fetch current preparation details before linking",
        );
      }

      const currentData = currentDetailsResponse.data.data;

      // 2. Prepare Payload: Merge existing data with new link
      // We strip out fields that shouldn't be sent back if necessary (like 'id', 'createdAt'),
      // but usually sending back the data received is safe for a PUT.
      const payload = {
        ...currentData,
        priorFlightPreparationId: oldPrepId, // <--- THE UPDATE
      };

      // 3. Send PUT Request
      const response = await apiClient.put<ApiResponse<PreparationItem>>(
        `/flights/${callFlight}/preparations/${currentPrepId}`,
        payload,
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to update preparation link",
        );
      }

      log.info("✅ Successfully linked prior preparation");
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
