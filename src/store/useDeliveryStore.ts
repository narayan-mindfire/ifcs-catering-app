import { create } from "zustand";
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

interface DeliveryStore {
  deliveries: Delivery[];
  selectedDeliveryId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchDeliveries: (flightId: string) => Promise<void>;
  selectDelivery: (id: string) => void;
  createDelivery: (flightId: string, deliveryName: string) => Promise<void>;
  updateDelivery: (
    flightId: string,
    deliveryId: string,
    payload: Partial<Delivery>,
  ) => Promise<void>;
  addSignature: (
    flightId: string,
    deliveryId: string,
    type: "tsa" | "driver" | "crew" | "security",
    signature: string,
    comment?: string,
  ) => Promise<void>;
  deleteDelivery: (flightId: string, deliveryId: string) => Promise<void>;
}

export const useDeliveryStore = create<DeliveryStore>((set, get) => ({
  deliveries: [],
  selectedDeliveryId: null,
  isLoading: false,
  error: null,

  fetchDeliveries: async (flightId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log(
        "======================FLIGHT ID WE'RE TRYING FOR: ",
        flightId,
      );
      const response = await apiClient.get<ApiResponse<Delivery[]>>(
        `/flights/${flightId}/deliveries`,
      );

      console.log("Full Response:", response.data);
      const deliveriesArray = response.data.data || [];

      console.log("Extracted Deliveries Array:", deliveriesArray);

      set({
        deliveries: deliveriesArray,
        selectedDeliveryId:
          get().selectedDeliveryId ||
          (deliveriesArray.length > 0 ? deliveriesArray[0].id : null),
        isLoading: false,
      });
    } catch (err: any) {
      console.error("Fetch Deliveries Error:", err);
      set({
        error: "Failed to fetch deliveries",
        isLoading: false,
        deliveries: [],
      });
    }
  },

  selectDelivery: (id: string) => {
    set({ selectedDeliveryId: id });
  },

  createDelivery: async (flightId: string, deliveryName: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<ApiResponse<Delivery>>(
        `/flights/${flightId}/deliveries`,
        { deliveryName },
      );

      console.log("NEW DELIVERY CREATED RESPONSE:", response.data);
      const newDelivery = response.data.data;

      set((state) => ({
        deliveries: [...state.deliveries, newDelivery],
        selectedDeliveryId: newDelivery.id,
        isLoading: false,
      }));
    } catch (err: any) {
      console.error("Create Delivery Error:", err);
      set({ error: "Failed to create delivery", isLoading: false });
    }
  },

  updateDelivery: async (
    flightId: string,
    deliveryId: string,
    payload: Partial<Delivery>,
  ) => {
    try {
      const response = await apiClient.put<ApiResponse<Delivery>>(
        `/flights/${flightId}/deliveries/${deliveryId}`,
        payload,
      );
      const updatedDelivery = response.data.data;

      set((state) => ({
        deliveries: state.deliveries.map((d) =>
          d.id === deliveryId ? updatedDelivery : d,
        ),
      }));
    } catch (err: any) {
      console.error("Update Delivery Error:", err);
      set({ error: "Failed to update delivery" });
    }
  },

  addSignature: async (
    flightId: string,
    deliveryId: string,
    type: "tsa" | "driver" | "crew" | "security",
    signature: string,
    comment?: string,
  ) => {
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

      const updatedDelivery = response.data.data;
      set((state) => ({
        deliveries: state.deliveries.map((d) =>
          d.id === deliveryId ? updatedDelivery : d,
        ),
      }));
    } catch (err: any) {
      console.error("Add Signature Error:", err);
      if (err.response) {
        console.log("Error Status:", err.response.status);
        console.log("Error Data:", JSON.stringify(err.response.data, null, 2));
      }
    }
  },
  deleteDelivery: async (flightId: string, deliveryId: string) => {
    try {
      await apiClient.delete(`/flights/${flightId}/deliveries/${deliveryId}`);
      set((state) => ({
        deliveries: state.deliveries.filter((d) => d.id !== deliveryId),
        selectedDeliveryId:
          state.selectedDeliveryId === deliveryId
            ? state.deliveries[0]?.id || null
            : state.selectedDeliveryId,
      }));
    } catch (err: any) {
      console.error("Delete Delivery Error:", err);
      set({ error: "Failed to delete delivery" });
    }
  },
}));
