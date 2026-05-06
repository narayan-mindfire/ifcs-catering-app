import { create } from "zustand";

import { spotCheckService } from "../services/spotcheckService";
import {
  SpotCheckFailPayload,
  SpotCheckLog,
  SpotCheckPassPayload,
} from "../types/spotcheck";
import { log } from "../utils/logger";

interface SpotCheckStore {
  isLoading: boolean;
  error: string | null;
  spotCheckLogs: SpotCheckLog[];
  isLogsLoading: boolean;

  markAsPassed: (payload: SpotCheckPassPayload) => Promise<boolean>;
  markAsFailed: (payload: SpotCheckFailPayload) => Promise<boolean>;
  fetchSpotCheckLogs: (userId: string) => Promise<void>;
}

export const useSpotCheckStore = create<SpotCheckStore>((set) => ({
  isLoading: false,
  error: null,
  spotCheckLogs: [],
  isLogsLoading: false,

  markAsPassed: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await spotCheckService.submitPass(payload);
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return false;
    }
  },

  markAsFailed: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await spotCheckService.submitFail(payload);
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return false;
    }
  },

  fetchSpotCheckLogs: async (userId: string) => {
    set({ isLogsLoading: true, error: null });
    try {
      const logs = await spotCheckService.getSpotCheckLogs(userId);
      set({ spotCheckLogs: logs, isLogsLoading: false });
    } catch (err: any) {
      log.error("Fetch Spot Check Logs Error:", err);
      set({ isLogsLoading: false });
    }
  },
}));
