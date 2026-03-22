import { create } from "zustand";

import { consumptionService } from "../services/consumptionService";
import {
  ConsumptionTrackingFilters,
  ConsumptionTrackingRecord,
  CreateConsumptionTrackingInput,
  UpdateConsumptionTrackingInput,
} from "../types/consumption";
import { log } from "../utils/logger";

interface ConsumptionTrackingStore {
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
  (set, _get) => ({
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

    fetchConsumptionRecords: async (flightId, filters = {}) => {
      set({ isLoading: true, error: null, currentFilters: filters });

      try {
        const { data, total } = await consumptionService.getRecords(
          flightId,
          filters,
        );
        log.error("Fetched Consumption Records:", data);
        set({
          records: data,
          total: total,
          isLoading: false,
        });
        return true;
      } catch (error: any) {
        const errorMessage =
          error.message ||
          (error.response?.data?.message && "Unknown error occurred");
        set({ error: errorMessage, isLoading: false, records: [] });
        log.error("Error fetching consumption records:", error);
        return false;
      }
    },

    // Fetch a single consumption tracking record
    fetchConsumptionRecordById: async (flightId, recordId) => {
      set({ isLoading: true, error: null });

      try {
        const record = await consumptionService.getRecordById(
          flightId,
          recordId,
        );

        set({
          selectedRecord: record,
          isLoading: false,
        });
        return true;
      } catch (error: any) {
        const errorMessage =
          error.message ||
          (error.response?.data?.message && "Unknown error occurred");
        set({ error: errorMessage, isLoading: false, selectedRecord: null });
        log.error("Error fetching consumption record:", error);
        return false;
      }
    },

    // Create a new consumption tracking record
    createConsumptionRecord: async (flightId, data) => {
      set({ isCreating: true, error: null });

      try {
        const newRecord = await consumptionService.createRecord(flightId, data);

        set((state) => ({
          records: [newRecord, ...state.records],
          total: state.total + 1,
          isCreating: false,
        }));

        log.info("Created Consumption Record:", newRecord);

        return { success: true, record: newRecord };
      } catch (error: any) {
        const errorMessage =
          error.message ||
          (error.response?.data?.message && "Unknown error occurred");
        set({ error: errorMessage, isCreating: false });
        log.error("Error creating consumption record:", error);
        return { success: false };
      }
    },

    // Update an existing consumption tracking record
    updateConsumptionRecord: async (flightId, recordId, data) => {
      set({ isUpdating: true, error: null });

      try {
        const updatedRecord = await consumptionService.updateRecord(
          flightId,
          recordId,
          data,
        );

        set((state) => ({
          records: state.records.map((record) =>
            record.id === recordId ? updatedRecord : record,
          ),
          selectedRecord:
            state.selectedRecord?.id === recordId
              ? updatedRecord
              : state.selectedRecord,
          isUpdating: false,
        }));

        return true;
      } catch (error: any) {
        const errorMessage =
          error.message ||
          (error.response?.data?.message && "Unknown error occurred");
        set({ error: errorMessage, isUpdating: false });
        log.error("Error updating consumption record:", error);
        return false;
      }
    },

    // Delete a consumption tracking record
    deleteConsumptionRecord: async (flightId, recordId) => {
      set({ isDeleting: true, error: null });

      try {
        await consumptionService.deleteRecord(flightId, recordId);

        set((state) => ({
          records: state.records.filter((record) => record.id !== recordId),
          total: state.total - 1,
          selectedRecord:
            state.selectedRecord?.id === recordId ? null : state.selectedRecord,
          isDeleting: false,
        }));

        return true;
      } catch (error: any) {
        const errorMessage =
          error.message ||
          (error.response?.data?.message && "Unknown error occurred");
        set({ error: errorMessage, isDeleting: false });
        log.error("Error deleting consumption record:", error);
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
