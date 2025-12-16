import apiClient from "../api/axiosClient";
import { Delivery } from "../types/deliveries";

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

// Helper to handle the specific flight ID swap logic
const resolveFlightId = (flightId: string) => {
  return flightId === "a990a562-e77e-4461-82ad-bbcd003ae4b1"
    ? "eaedd455-3e21-4c74-8a78-24989b0e82a8"
    : flightId;
};

export const deliveryService = {
  getDeliveries: async (flightId: string): Promise<Delivery[]> => {
    const callFlight = resolveFlightId(flightId);
    const response = await apiClient.get<ApiResponse<Delivery[]>>(
      `/flights/${callFlight}/deliveries`,
    );
    return response.data.data || [];
  },

  createDelivery: async (
    flightId: string,
    deliveryName: string,
  ): Promise<Delivery> => {
    const callFlight = resolveFlightId(flightId);
    const response = await apiClient.post<ApiResponse<Delivery>>(
      `/flights/${callFlight}/deliveries`,
      { deliveryName },
    );
    console.log("NEW DELIVERY CREATED RESPONSE:", response.data);
    return response.data.data;
  },

  updateDelivery: async (
    flightId: string,
    deliveryId: string,
    payload: Partial<Delivery>,
  ): Promise<Delivery> => {
    const callFlight = resolveFlightId(flightId);
    const response = await apiClient.put<ApiResponse<Delivery>>(
      `/flights/${callFlight}/deliveries/${deliveryId}`,
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
    const cleanSignature = signature.replace(/^data:image\/[a-z]+;base64,/, "");

    const requestPayload = {
      signature: cleanSignature,
      comment: comment || "",
    };

    const callFlight = resolveFlightId(flightId);
    const url = `/flights/${callFlight}/deliveries/${deliveryId}/signatures?type=${type}`;

    console.log("\n================= REQUEST DEBUG START =================");
    console.log("URL:", url);
    console.log("COMMENT:", requestPayload.comment);
    console.log(
      "SIGNATURE START (Check for prefix):",
      requestPayload.signature.substring(0, 50) + "...",
    );
    console.log("================= REQUEST DEBUG END ===================\n");

    const response = await apiClient.post<ApiResponse<Delivery>>(
      url,
      requestPayload,
    );
    console.log("RESPONSE DATA =================", response.data.data);
    return response.data.data;
  },

  deleteDelivery: async (
    flightId: string,
    deliveryId: string,
  ): Promise<void> => {
    const callFlight = resolveFlightId(flightId);
    await apiClient.delete(`/flights/${callFlight}/deliveries/${deliveryId}`);
  },

  printDeliverySecurityDeclaration: async (
    flightId: string,
    deliveryId: string,
  ): Promise<string> => {
    const callFlight = resolveFlightId(flightId);
    const response = await apiClient.get(
      `/flights/${callFlight}/deliveries/${deliveryId}/print`,
    );

    if (response.data.success && response.data.data?.url) {
      return response.data.data.url;
    }
    throw new Error(response.data.message || "Failed to generate PDF");
  },
};
