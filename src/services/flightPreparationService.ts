import apiClient from "../api/axiosClient";
import {
  PreparationItem,
  PreparationDetailData,
  PreparationFlagUpdatePayload,
  PrintData,
  AddUserSignatureResponse,
} from "../types/preparations";

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
    console.log("Fetching preparations for flight:", flightId);

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
    console.log("User signature added successfully:", response.data.data);
  },
};
