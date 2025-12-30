import { create } from "zustand";

import { deliveryService } from "../services/deliveryService";
import { Delivery } from "../types/deliveries";
import { log } from "../utils/logger";

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
  printDeliverySecurityDeclaration: (
    flightId: string,
    deliveryId: string,
  ) => Promise<{ success: boolean; fileUrl?: string; error?: string }>;
}

export const useDeliveryStore = create<DeliveryStore>((set, get) => ({
  deliveries: [],
  selectedDeliveryId: null,
  isLoading: false,
  error: null,

  fetchDeliveries: async (flightId: string) => {
    set({ isLoading: true, error: null });
    try {
      const deliveriesArray = await deliveryService.getDeliveries(flightId);
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
      const newDelivery = await deliveryService.createDelivery(
        flightId,
        deliveryName,
      );

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
      const updatedDelivery = await deliveryService.updateDelivery(
        flightId,
        deliveryId,
        payload,
      );

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
      const updatedDelivery = await deliveryService.addSignature(
        flightId,
        deliveryId,
        type,
        signature,
        comment,
      );

      set((state) => ({
        deliveries: state.deliveries.map((d) =>
          d.id === deliveryId ? updatedDelivery : d,
        ),
      }));
    } catch (err: any) {
      console.error("Add Signature Error:", err);
      if (err.response) {
        log.info("Error Status:", err.response.status);
        log.info("Error Data:", JSON.stringify(err.response.data, null, 2));
      }
    }
  },

  deleteDelivery: async (flightId: string, deliveryId: string) => {
    try {
      await deliveryService.deleteDelivery(flightId, deliveryId);
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

  printDeliverySecurityDeclaration: async (flightId, deliveryId) => {
    try {
      const fileUrl = await deliveryService.printDeliverySecurityDeclaration(
        flightId,
        deliveryId,
      );
      return { success: true, fileUrl };
    } catch (err: any) {
      console.error("Print Delivery Error:", err);
      return {
        success: false,
        error:
          err.response?.data?.message ||
          err.message ||
          "Network error generating print",
      };
    }
  },
}));
