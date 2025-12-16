import { create } from "zustand";
import {
  ConsumptionTrackingRecord,
  CreateConsumptionTrackingInput,
  UpdateConsumptionTrackingInput,
  ConsumptionTrackingFilters,
  ConsumptionTrackingListResponse,
  ConsumptionTrackingResponse,
} from "../types/consumption";
import apiClient from "../api/axiosClient";

interface ConsumptionTrackingStore {
  // State
  records: ConsumptionTrackingRecord[];
  selectedRecord: ConsumptionTrackingRecord | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  total: number;
  currentFilters: ConsumptionTrackingFilters;

  // Actions
  fetchConsumptionRecords: (
    flightId: string,
    filters?: ConsumptionTrackingFilters,
  ) => Promise<boolean>;
  fetchConsumptionRecordById: (
    flightId: string,
    recordId: string,
  ) => Promise<boolean>;
  createConsumptionRecord: (
    flightId: string,
    data: CreateConsumptionTrackingInput,
  ) => Promise<{ success: boolean; record?: ConsumptionTrackingRecord }>;
  updateConsumptionRecord: (
    flightId: string,
    recordId: string,
    data: UpdateConsumptionTrackingInput,
  ) => Promise<boolean>;
  deleteConsumptionRecord: (
    flightId: string,
    recordId: string,
  ) => Promise<boolean>;
  clearError: () => void;
  resetStore: () => void;
}

export const useConsumptionTrackingStore = create<ConsumptionTrackingStore>(
  (set, get) => ({
    // Initial State
    records: [],
    selectedRecord: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    total: 0,
    currentFilters: {},

    // Fetch all consumption tracking records for a flight
    fetchConsumptionRecords: async (flightId, filters = {}) => {
      set({ isLoading: true, error: null, currentFilters: filters });

      try {
        const params: any = {};
        if (filters.mealId) params.mealId = filters.mealId;
        if (filters.foodOrderItemId)
          params.foodOrderItemId = filters.foodOrderItemId;
        if (filters.flightPreparationId)
          params.flightPreparationId = filters.flightPreparationId;
        if (filters.limit) params.limit = filters.limit;
        if (filters.offset) params.offset = filters.offset;

        const response = await apiClient.get<ConsumptionTrackingListResponse>(
          `/flights/${flightId}/consumption-tracking`,
          { params },
        );

        if (response.data.success) {
          set({
            records: response.data.data,
            total: response.data.total,
            isLoading: false,
          });
          return true;
        } else {
          throw new Error("Failed to fetch consumption records");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Unknown error occurred";
        set({ error: errorMessage, isLoading: false, records: [] });
        console.error("Error fetching consumption records:", error);
        return false;
      }
    },

    // Fetch a single consumption tracking record
    fetchConsumptionRecordById: async (flightId, recordId) => {
      set({ isLoading: true, error: null });

      try {
        const response = await apiClient.get<ConsumptionTrackingResponse>(
          `/flights/${flightId}/consumption-tracking/${recordId}`,
        );

        if (response.data.success) {
          set({
            selectedRecord: response.data.data,
            isLoading: false,
          });
          return true;
        } else {
          throw new Error("Failed to fetch consumption record");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Unknown error occurred";
        set({ error: errorMessage, isLoading: false, selectedRecord: null });
        console.error("Error fetching consumption record:", error);
        return false;
      }
    },

    // Create a new consumption tracking record
    createConsumptionRecord: async (flightId, data) => {
      set({ isCreating: true, error: null });

      try {
        const response = await apiClient.post<ConsumptionTrackingResponse>(
          `/flights/${flightId}/consumption-tracking`,
          data,
        );

        if (response.data.success) {
          // Add the new record to the list
          set((state) => ({
            records: [response.data.data, ...state.records],
            total: state.total + 1,
            isCreating: false,
          }));

          console.log(
            "Consumption record created successfully:",
            response.data.data,
          );
          return { success: true, record: response.data.data };
        } else {
          throw new Error("Failed to create consumption record");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Unknown error occurred";
        set({ error: errorMessage, isCreating: false });
        console.error("Error creating consumption record:", error);
        return { success: false };
      }
    },

    // Update an existing consumption tracking record
    updateConsumptionRecord: async (flightId, recordId, data) => {
      set({ isUpdating: true, error: null });

      try {
        const response = await apiClient.put<ConsumptionTrackingResponse>(
          `/flights/${flightId}/consumption-tracking/${recordId}`,
          data,
        );

        if (response.data.success) {
          // Update the record in the list
          set((state) => ({
            records: state.records.map((record) =>
              record.id === recordId ? response.data.data : record,
            ),
            selectedRecord:
              state.selectedRecord?.id === recordId
                ? response.data.data
                : state.selectedRecord,
            isUpdating: false,
          }));

          console.log("Consumption record updated successfully");
          return true;
        } else {
          throw new Error("Failed to update consumption record");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Unknown error occurred";
        set({ error: errorMessage, isUpdating: false });
        console.error("Error updating consumption record:", error);
        return false;
      }
    },

    // Delete a consumption tracking record
    deleteConsumptionRecord: async (flightId, recordId) => {
      set({ isDeleting: true, error: null });

      try {
        await apiClient.delete(
          `/flights/${flightId}/consumption-tracking/${recordId}`,
        );

        // Remove the record from the list
        set((state) => ({
          records: state.records.filter((record) => record.id !== recordId),
          total: state.total - 1,
          selectedRecord:
            state.selectedRecord?.id === recordId ? null : state.selectedRecord,
          isDeleting: false,
        }));

        console.log("Consumption record deleted successfully");
        return true;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Unknown error occurred";
        set({ error: errorMessage, isDeleting: false });
        console.error("Error deleting consumption record:", error);
        return false;
      }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset store
    resetStore: () =>
      set({
        records: [],
        selectedRecord: null,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        error: null,
        total: 0,
        currentFilters: {},
      }),
  }),
);
