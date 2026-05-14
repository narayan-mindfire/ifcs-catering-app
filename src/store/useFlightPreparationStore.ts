import { create } from "zustand";

import { flightPreparationService } from "@/services/flightPreparationService";
import {
  PreparationDetailData,
  PreparationFlagUpdatePayload,
  PreparationItem,
  Truck,
  UserSignature,
} from "@/types/preparations";
import { log } from "@/utils/logger";

interface FlightPreparationState {
  preparations: PreparationItem[];
  preparationDetail: PreparationDetailData | null;
  userSignatures: UserSignature[];
  isLoading: boolean;
  isPrinting: boolean;
  trucks: Truck[];
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
    userId?: string,
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
  deleteUserSignature: (
    flightId: string,
    signatureId: string,
  ) => Promise<boolean>;
}

export const useFlightPreparationStore = create<FlightPreparationState>(
  (set, get) => ({
    preparations: [],
    trucks: [],
    preparationDetail: null,
    userSignatures: [],
    isLoading: false,
    isPrepLoading: false,
    isUpdating: false,
    error: null,
    isPrinting: false,

    fetchPreparations: async (flightId: string) => {
      set({ isLoading: true, error: null });
      try {
        const { preparations, trucks } =
          await flightPreparationService.getPreparations(flightId);
        set({
          preparations: preparations as unknown as PreparationItem[],
          trucks,
          isLoading: false,
        });
      } catch (err: any) {
        log.error("Fetch Preparations Error:", err);
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
        log.error("Fetch Detail Error:", err);
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
            item.id === preparationId
              ? {
                  ...item,
                  ...updatedItem,
                  isSealRequired: item.isSealRequired,
                  isLockRequired: item.isLockRequired,
                  isTrackConsumption: item.isTrackConsumption,
                }
              : item,
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
      userId?: string,
    ): Promise<boolean> => {
      try {
        const signatures = userId
          ? await flightPreparationService.getUserSignatures(flightId, userId)
          : await flightPreparationService.getUserSignatures(flightId);

        set({ userSignatures: signatures });
        return signatures.length > 0;
      } catch (err: any) {
        log.error("Check User Signature Error:", err);
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
          cleanSignature,
        );

        await get().checkUserSignature(flightId, deliveryId, userId);
        return true;
      } catch (err: any) {
        log.error("Add User Signature Error:", err);
        return false;
      }
    },

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
        log.error("Link Prior Prep Error:", err);
        set({
          isUpdating: false,
          error: err.message || "Failed to link prior preparation",
        });
        return false;
      }
    },

    deleteUserSignature: async (flightId, signatureId) => {
      try {
        await flightPreparationService.deleteUserSignature(
          flightId,
          signatureId,
        );
        set((state) => ({
          userSignatures: state.userSignatures.filter(
            (sig) => sig.id !== signatureId,
          ),
        }));
        return true;
      } catch (err: any) {
        log.error("Delete Signature Error:", err);
        return false;
      }
    },
  }),
);
