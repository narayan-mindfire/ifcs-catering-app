import apiClient from "../api/axiosClient";
import { Delivery } from "../types/deliveries";
import { log } from "../utils/logger";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    limit?: number;
    offset?: number;
    total?: number;
  };
}

export const deliveryService = {
  getDeliveries: async (
    flightId: string,
    dispatchAssignmentId?: string,
  ): Promise<Delivery[]> => {
    const response = await apiClient.get<ApiResponse<Delivery[]>>(
      `/flights/${flightId}/deliveries`,
      {
        params: dispatchAssignmentId ? { dispatchAssignmentId } : {},
      },
    );
    return response.data.data || [];
  },

  createDelivery: async (
    flightId: string,
    deliveryName: string,
  ): Promise<Delivery> => {
    const response = await apiClient.post<ApiResponse<Delivery>>(
      `/flights/${flightId}/deliveries`,
      { deliveryName },
    );
    return response.data.data;
  },

  updateDelivery: async (
    flightId: string,
    deliveryId: string,
    payload: Partial<Delivery>,
  ): Promise<Delivery> => {
    const response = await apiClient.put<ApiResponse<Delivery>>(
      `/flights/${flightId}/deliveries/${deliveryId}`,
      payload,
    );
    return response.data.data;
  },

  addSignature: async (
    flightId: string,
    deliveryId: string,
    type: "tsa" | "driver" | "crew" | "security",
    signature: string,
    comment?: string,
  ): Promise<Delivery> => {
    try {
      const cleanSignature = signature.replace(
        /^data:image\/[a-z]+;base64,/,
        "",
      );

      const requestPayload = {
        signature: cleanSignature,
        comment: comment || "",
      };

      const url = `/flights/${flightId}/deliveries/${deliveryId}/signatures?type=${type}`;

      const response = await apiClient.post<ApiResponse<Delivery>>(
        url,
        requestPayload,
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to add signature");
      }
    } catch (error: any) {
      log.error("addSignature Service Error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to add signature",
      );
    }
  },

  deleteDelivery: async (
    flightId: string,
    deliveryId: string,
  ): Promise<void> => {
    await apiClient.delete(`/flights/${flightId}/deliveries/${deliveryId}`);
  },

  printDeliverySecurityDeclaration: async (
    flightId: string,
    deliveryId: string,
  ): Promise<string> => {
    const response = await apiClient.get(
      `/flights/${flightId}/deliveries/${deliveryId}/print`,
    );

    if (response.data.success && response.data.data?.url) {
      return response.data.data.url;
    }
    throw new Error(response.data.message || "Failed to generate PDF");
  },
};
