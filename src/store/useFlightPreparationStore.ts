import { create } from "zustand";
import apiClient from "../api/axiosClient";
import {
  PreparationItem,
  PreparationDetailData,
  PreparationFlagUpdatePayload,
  PrintData,
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
  preparations: PreparationItem[];
  preparationDetail: PreparationDetailData | null;

  isLoading: boolean;
  isPrinting: boolean;
  isPrepLoading: boolean;

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
  printPreparation: (
    flightId: string,
  ) => Promise<{ success: boolean; fileUrl?: string; error?: string }>;
  clearPreparationDetail: () => void;
}

export const useFlightPreparationStore = create<FlightPreparationState>(
  (set, get) => ({
    preparations: [],
    preparationDetail: null,
    isLoading: false,
    isPrepLoading: false,
    error: null,
    isPrinting: false,

    fetchPreparations: async (flightId: string) => {
      console.log("CALLED CALLED CALLED CALLED");
      const callFlight =
        flightId === "a990a562-e77e-4461-82ad-bbcd003ae4b1"
          ? "eaedd455-3e21-4c74-8a78-24989b0e82a8"
          : "a990a562-e77e-4461-82ad-bbcd003ae4b1";
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.get<ApiResponse<PreparationItem[]>>(
          `/flights/${callFlight}/preparations`,
          {
            baseURL: "https://oman.stg.api.ifcs.aero/api/v1",
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

    // 2. Fetch Single Detail
    fetchPreparationById: async (flightId: string, preparationId: string) => {
      set({ isPrepLoading: true, error: null });
      const callFlight =
        flightId === "a990a562-e77e-4461-82ad-bbcd003ae4b1"
          ? "eaedd455-3e21-4c74-8a78-24989b0e82a8"
          : "a990a562-e77e-4461-82ad-bbcd003ae4b1";
      try {
        const response = await apiClient.get<
          ApiResponse<PreparationDetailData>
        >(`/flights/${callFlight}/preparations/${preparationId}`, {
          baseURL: "https://oman.stg.api.ifcs.aero/api/v1",
        });
        if (response.data.success) {
          console.log(
            "Preparation Detail Response:",
            JSON.stringify(response.data.data, null, 2),
          );
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
        const response = await apiClient.patch<ApiResponse<PreparationItem>>(
          `/flights/${flightId}/preparation-flags/${preparationId}`,
          payload,
          {
            baseURL: "https://oman.stg.api.ifcs.aero/api/v1",
          },
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

    printPreparation: async (flightId: string) => {
      const callFlight =
        flightId === "a990a562-e77e-4461-82ad-bbcd003ae4b1"
          ? "eaedd455-3e21-4c74-8a78-24989b0e82a8"
          : "a990a562-e77e-4461-82ad-bbcd003ae4b1";
      set({ isPrinting: true, error: null });
      try {
        const response = await apiClient.post<ApiResponse<PrintData>>(
          `/flights/${callFlight}/preparations/print`,
          {},
          {
            baseURL: "https://oman.stg.api.ifcs.aero/api/v1",
          },
        );

        set({ isPrinting: false });

        if (response.data.success && response.data.data?.fileUrl) {
          return { success: true, fileUrl: response.data.data.fileUrl };
        } else {
          return {
            success: false,
            error: response.data.message || "Failed to generate print file",
          };
        }
      } catch (err: any) {
        console.error("Print Error:", err);
        set({
          error:
            err.response?.data?.message || "Network error generating print",
          isPrinting: false,
        });
        return { success: false, error: err.message };
      }
    },

    clearPreparationDetail: () => {
      set({ preparationDetail: null });
    },
  }),
);
