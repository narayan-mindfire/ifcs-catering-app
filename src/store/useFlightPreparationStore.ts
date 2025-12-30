import { create } from "zustand";

import { flightPreparationService } from "../services/flightPreparationService";
import {
  PreparationDetailData,
  PreparationFlagUpdatePayload,
  PreparationItem,
} from "../types/preparations";

export interface UserSignature {
  id: string;
  deliveryId: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userType: string;
  userOrganization: string;
  userBadgeNumber: string | null;
  signature: string;
  createdAt: string;
  updatedAt: string;
  raic: string | null;
}

interface FlightPreparationState {
  preparations: PreparationItem[];
  preparationDetail: PreparationDetailData | null;
  userSignatures: UserSignature[];
  isLoading: boolean;
  isPrinting: boolean;
  isPrepLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  fetchPreparations: (flightId: string) => Promise<void>;
  fetchPreparationById: (
    flightId: string,
    preparationId: string,
  ) => Promise<void>;
  updatePreparationFlag: (
    flightId: string,
    preparationId: string,
    payload: PreparationFlagUpdatePayload,
  ) => Promise<boolean>;
  printPreparation: (
    flightId: string,
  ) => Promise<{ success: boolean; fileUrl?: string; error?: string }>;
  clearPreparationDetail: () => void;
  checkUserSignature: (
    flightId: string,
    deliveryId: string,
    userId: string,
  ) => Promise<boolean>;
  addUserSignature: (
    flightId: string,
    deliveryId: string,
    userId: string,
    signature: string,
  ) => Promise<boolean>;
  linkPriorPrep: (
    flightId: string,
    currentPrepId: string,
    oldPrepId: string,
  ) => Promise<boolean>;
}

export const useFlightPreparationStore = create<FlightPreparationState>(
  (set, get) => ({
    preparations: [],
    preparationDetail: null,
    userSignatures: [],
    isLoading: false,
    isPrepLoading: false,
    isUpdating: false,
    error: null,
    isPrinting: false,

    // ... (Keep fetchPreparations, fetchPreparationById, updatePreparationFlag, printPreparation, clearPreparationDetail, checkUserSignature, addUserSignature AS IS) ...
    fetchPreparations: async (flightId: string) => {
      set({ isLoading: true, error: null });
      try {
        const data = await flightPreparationService.getPreparations(flightId);
        set({
          preparations: data,
          isLoading: false,
        });
      } catch (err: any) {
        console.error("Fetch Preparations Error:", err);
        set({
          error:
            err.response?.data?.message ||
            err.message ||
            "Network error fetching preparations",
          isLoading: false,
        });
      }
    },

    fetchPreparationById: async (flightId: string, preparationId: string) => {
      set({ isPrepLoading: true, error: null });
      try {
        const data = await flightPreparationService.getPreparationById(
          flightId,
          preparationId,
        );
        set({
          preparationDetail: data,
          isPrepLoading: false,
        });
      } catch (err: any) {
        console.error("Fetch Detail Error:", err);
        set({
          error:
            err.response?.data?.message ||
            err.message ||
            "Network error fetching details",
          isPrepLoading: false,
        });
      }
    },

    updatePreparationFlag: async (flightId, preparationId, payload) => {
      set({ isUpdating: true, error: null });
      try {
        const updatedItem =
          await flightPreparationService.updatePreparationFlag(
            flightId,
            preparationId,
            payload,
          );

        set((state) => ({
          preparations: state.preparations.map((item) =>
            item.id === preparationId ? { ...item, ...updatedItem } : item,
          ),
          isUpdating: false,
        }));
        return true;
      } catch (err: any) {
        set({
          isUpdating: false,
          error:
            err.response?.data?.message ||
            err.message ||
            "Network error during update",
        });
        return false;
      }
    },

    printPreparation: async (flightId: string) => {
      set({ isPrinting: true, error: null });
      try {
        const fileUrl =
          await flightPreparationService.printPreparation(flightId);
        set({ isPrinting: false });
        return { success: true, fileUrl };
      } catch (err: any) {
        set({
          error:
            err.response?.data?.message ||
            err.message ||
            "Network error generating print",
          isPrinting: false,
        });
        return { success: false, error: err.message };
      }
    },

    clearPreparationDetail: () => {
      set({ preparationDetail: null });
    },

    checkUserSignature: async (
      flightId: string,
      deliveryId: string,
      userId: string,
    ): Promise<boolean> => {
      try {
        const signatures = await flightPreparationService.getUserSignatures(
          flightId,
          userId,
        );
        set({ userSignatures: signatures });
        return signatures.length > 0;
      } catch (err: any) {
        console.error("Check User Signature Error:", err);
        set({ userSignatures: [] });
        return false;
      }
    },

    addUserSignature: async (
      flightId: string,
      deliveryId: string,
      userId: string,
      signature: string,
    ): Promise<boolean> => {
      try {
        const cleanSignature = signature.replace(
          /^data:image\/[a-z]+;base64,/,
          "",
        );

        await flightPreparationService.addUserSignature(
          flightId,
          userId,
          cleanSignature,
        );

        await get().checkUserSignature(flightId, deliveryId, userId);
        return true;
      } catch (err: any) {
        console.error("Add User Signature Error:", err);
        return false;
      }
    },

    // 👇 UPDATED REAL IMPLEMENTATION 👇
    linkPriorPrep: async (
      flightId: string,
      currentPrepId: string,
      oldPrepId: string,
    ): Promise<boolean> => {
      set({ isUpdating: true, error: null });
      try {
        await flightPreparationService.linkPriorPreparation(
          flightId,
          currentPrepId,
          oldPrepId,
        );
        set({ isUpdating: false });
        return true;
      } catch (err: any) {
        console.error("Link Prior Prep Error:", err);
        set({
          isUpdating: false,
          error: err.message || "Failed to link prior preparation",
        });
        return false;
      }
    },
  }),
);
