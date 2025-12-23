import apiClient from "../api/axiosClient";
import {
  ConsumptionTrackingFilters,
  ConsumptionTrackingListResponse,
  ConsumptionTrackingRecord,
  ConsumptionTrackingResponse,
  CreateConsumptionTrackingInput,
  UpdateConsumptionTrackingInput,
} from "../types/consumption";
import { log } from "../utils/logger";

export const consumptionService = {
  getRecords: async (
    flightId: string,
    filters: ConsumptionTrackingFilters = {},
  ): Promise<{ data: ConsumptionTrackingRecord[]; total: number }> => {
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
      return {
        data: response.data.data,
        total: response.data.total,
      };
    }
    throw new Error("Failed to fetch consumption records");
  },

  getRecordById: async (
    flightId: string,
    recordId: string,
  ): Promise<ConsumptionTrackingRecord> => {
    const response = await apiClient.get<ConsumptionTrackingResponse>(
      `/flights/${flightId}/consumption-tracking/${recordId}`,
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to fetch consumption record");
  },

  createRecord: async (
    flightId: string,
    data: CreateConsumptionTrackingInput,
  ): Promise<ConsumptionTrackingRecord> => {
    const response = await apiClient.post<ConsumptionTrackingResponse>(
      `/flights/${flightId}/consumption-tracking`,
      data,
    );

    if (response.data.success) {
      log.info("Consumption record created successfully:", response.data.data);
      return response.data.data;
    }
    throw new Error("Failed to create consumption record");
  },

  updateRecord: async (
    flightId: string,
    recordId: string,
    data: UpdateConsumptionTrackingInput,
  ): Promise<ConsumptionTrackingRecord> => {
    const response = await apiClient.put<ConsumptionTrackingResponse>(
      `/flights/${flightId}/consumption-tracking/${recordId}`,
      data,
    );

    if (response.data.success) {
      log.info("Consumption record updated successfully");
      return response.data.data;
    }
    throw new Error("Failed to update consumption record");
  },

  deleteRecord: async (flightId: string, recordId: string): Promise<void> => {
    await apiClient.delete(
      `/flights/${flightId}/consumption-tracking/${recordId}`,
    );
    log.info("Consumption record deleted successfully");
  },
};
