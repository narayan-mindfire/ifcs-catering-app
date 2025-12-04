import { create } from "zustand";
import apiClient from "../api/axiosClient";
import {
  Preparation,
  PreparationDetailData,
  PreparationFlagUpdatePayload,
} from "../types/preparations";

// Generic API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    limit?: number;
    offset?: number;
    total?: number;
  };
}

interface FlightPreparationState {
  preparations: Preparation[];
  preparationDetail: PreparationDetailData | null;

  // Loading states
  isLoading: boolean; // For the main list
  isPrepLoading: boolean; // For the details modal (NEW)

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
  ) => Promise<void>;
  clearPreparationDetail: () => void;
}

export const useFlightPreparationStore = create<FlightPreparationState>(
  (set, get) => ({
    preparations: [],
    preparationDetail: null,
    isLoading: false,
    isPrepLoading: false, // Initial state
    error: null,

    // 1. Fetch Main List
    fetchPreparations: async (flightId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.get<ApiResponse<Preparation[]>>(
          `/flights/${flightId}/preparations`,
          {
            params: { includeContent: true },
          },
        );

        if (response.data.success) {
          set({
            preparations: response.data.data || [],
            isLoading: false,
          });
        } else {
          set({
            error: response.data.message || "Failed to fetch preparations",
            isLoading: false,
          });
        }
      } catch (err: any) {
        console.error("Fetch Preparations Error:", err);
        set({
          error:
            err.response?.data?.message ||
            "Network error fetching preparations",
          isLoading: false,
        });
      }
    },

    // 2. Fetch Single Detail (Uses isPrepLoading)
    fetchPreparationById: async (flightId: string, preparationId: string) => {
      // Only trigger the modal loading state
      set({ isPrepLoading: true, error: null });
      try {
        const response = await apiClient.get<
          ApiResponse<PreparationDetailData>
        >(`/flights/${flightId}/preparations/${preparationId}`);

        if (response.data.success) {
          set({
            preparationDetail: response.data.data,
            isPrepLoading: false,
          });
        } else {
          set({
            error:
              response.data.message || "Failed to fetch preparation details",
            isPrepLoading: false,
          });
        }
      } catch (err: any) {
        console.error("Fetch Detail Error:", err);
        set({
          error:
            err.response?.data?.message || "Network error fetching details",
          isPrepLoading: false,
        });
      }
    },

    // 3. Update Flags
    updatePreparationFlag: async (
      flightId: string,
      preparationId: string,
      payload: PreparationFlagUpdatePayload,
    ) => {
      try {
        const response = await apiClient.patch<ApiResponse<Preparation>>(
          `/flights/${flightId}/preparation-flags/${preparationId}`,
          payload,
        );

        if (response.data.success) {
          const updatedItem = response.data.data;

          set((state) => ({
            preparations: state.preparations.map((item) =>
              item.id === preparationId ? { ...item, ...updatedItem } : item,
            ),
          }));

          console.log("Flag updated successfully");
        } else {
          console.error("Update failed:", response.data.message);
        }
      } catch (err: any) {
        console.error("Network error during patch:", err);
      }
    },

    clearPreparationDetail: () => {
      set({ preparationDetail: null });
    },
  }),
);
