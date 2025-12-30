import { create } from "zustand";

import { spotCheckService } from "../services/spotcheckService";
import { SpotCheckFailPayload } from "../types/spotcheck";
import { log } from "../utils/logger";

interface SpotCheckStore {
  isLoading: boolean;
  error: string | null;

  markAsPassed: (flightId: string, preparationId: string) => Promise<boolean>;
  markAsFailed: (payload: SpotCheckFailPayload) => Promise<boolean>;
}

export const useSpotCheckStore = create<SpotCheckStore>((set) => ({
  isLoading: false,
  error: null,

  markAsPassed: async (flightId, preparationId) => {
    set({ isLoading: true, error: null });
    try {
      await spotCheckService.submitPass(flightId, preparationId);
      log.info("Store: Spot Check PASSED");
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
      log.info("Store: Spot Check FAILED Submitted");
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return false;
    }
  },
}));
