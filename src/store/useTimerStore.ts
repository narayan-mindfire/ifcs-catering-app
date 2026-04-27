import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { attendanceService } from "../services/attendanceService";
import { getISOStringWithOffset } from "../utils/dateFormatter";
import { log } from "../utils/logger";

type ShiftState = "OFF" | "ON" | "BREAK";

interface TimerStoreState {
  shiftState: ShiftState;
  totalWorkedMs: number;
  totalBreakMs: number;
  lastStatusChangeAt: string | null;
  shiftType: string | null;
  currentSessionDuration: number;
  currentBreakSessionDuration: number;
  isLoading: boolean;
  error: string | null;

  fetchStatus: () => Promise<void>;
  fetchHistory: (date: string) => Promise<void>;
  startShift: () => Promise<void>;
  pauseShift: () => Promise<void>;
  resumeShift: () => Promise<void>;
  endShift: () => Promise<void>;
  syncTime: () => void;
  resetTimer: () => void;
}

const mapBackendStatus = (status: string | undefined): ShiftState => {
  switch (status) {
    case "WORKING":
      return "ON";
    case "BREAK":
      return "BREAK";
    default:
      return "OFF";
  }
};

export const useTimerStore = create<TimerStoreState>()(
  persist(
    (set, get) => ({
      shiftState: "OFF",
      totalWorkedMs: 0,
      totalBreakMs: 0,
      lastStatusChangeAt: null,
      shiftType: null,
      currentSessionDuration: 0,
      currentBreakSessionDuration: 0,
      isLoading: false,
      error: null,

      fetchStatus: async () => {
        set({ isLoading: true });
        try {
          const response = await attendanceService.getStatus();
          if (response.success && response.data) {
            const data = response.data;
            set({
              shiftState: mapBackendStatus(data.currentStatus),
              totalWorkedMs: data.totalWorkedMs,
              totalBreakMs: data.totalBreakMs || 0,
              lastStatusChangeAt: data.lastStatusChangeAt,
              shiftType: data.shiftType,
              isLoading: false,
            });
          } else {
            set({
              shiftState: "OFF",
              totalWorkedMs: 0,
              totalBreakMs: 0,
              isLoading: false,
            });
          }
        } catch (err) {
          log.error("Fetch status error:", err);
          set({ isLoading: false });
        }
      },

      fetchHistory: async (date: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await attendanceService.getHistory(date);
          if (response.success && response.data) {
            const data = response.data;
            set({
              totalWorkedMs: data.totalWorkedMs,
              totalBreakMs: data.totalBreakMs || 0,
              shiftType: data.shiftType,
              isLoading: false,
              // history usually means finished, so we don't start the real-time counter
              shiftState: "OFF",
              lastStatusChangeAt: null,
            });
          } else {
            set({
              totalWorkedMs: 0,
              totalBreakMs: 0,
              shiftType: null,
              isLoading: false,
              shiftState: "OFF",
              lastStatusChangeAt: null,
            });
          }
        } catch (err) {
          log.error("Fetch history error:", err);
          set({
            totalWorkedMs: 0,
            totalBreakMs: 0,
            shiftType: null,
            isLoading: false,
            shiftState: "OFF",
            lastStatusChangeAt: null,
          });
        }
      },

      startShift: async () => {
        set({ isLoading: true });
        try {
          const startTime = getISOStringWithOffset(new Date());
          const response = await attendanceService.startShift(startTime);
          if (response.success) {
            const data = response.data;
            set({
              shiftState: "ON",
              lastStatusChangeAt: data.lastStatusChangeAt,
              totalWorkedMs: data.totalWorkedMs,
              totalBreakMs: data.totalBreakMs || 0,
              shiftType: data.shiftType,
              isLoading: false,
            });
          }
        } catch (err) {
          log.error("Start shift error:", err);
          set({ isLoading: false });
        }
      },

      pauseShift: async () => {
        set({ isLoading: true });
        try {
          const response = await attendanceService.startBreak();
          if (response.success) {
            const data = response.data;
            set({
              shiftState: "BREAK",
              lastStatusChangeAt: data.lastStatusChangeAt,
              totalWorkedMs: data.totalWorkedMs,
              totalBreakMs: data.totalBreakMs || 0,
              currentSessionDuration: 0,
              isLoading: false,
            });
          }
        } catch (err) {
          log.error("Pause shift error:", err);
          set({ isLoading: false });
        }
      },

      resumeShift: async () => {
        set({ isLoading: true });
        try {
          const response = await attendanceService.endBreak();
          if (response.success) {
            const data = response.data;
            set({
              shiftState: "ON",
              lastStatusChangeAt: data.lastStatusChangeAt,
              totalWorkedMs: data.totalWorkedMs,
              totalBreakMs: data.totalBreakMs || 0,
              currentBreakSessionDuration: 0,
              isLoading: false,
            });
          }
        } catch (err) {
          log.error("Resume shift error:", err);
          set({ isLoading: false });
        }
      },

      endShift: async () => {
        set({ isLoading: true });
        try {
          const response = await attendanceService.endShift();
          if (response.success) {
            const data = response.data;
            set({
              shiftState: "OFF",
              lastStatusChangeAt: null,
              totalWorkedMs: data.totalWorkedMs,
              totalBreakMs: data.totalBreakMs || 0,
              currentSessionDuration: 0,
              currentBreakSessionDuration: 0,
              isLoading: false,
            });
          }
        } catch (err) {
          log.error("End shift error:", err);
          set({ isLoading: false });
        }
      },

      syncTime: () => {
        const { shiftState, lastStatusChangeAt } = get();
        if (!lastStatusChangeAt) {
          set({ currentSessionDuration: 0, currentBreakSessionDuration: 0 });
          return;
        }

        const startTimeMs = new Date(lastStatusChangeAt).getTime();
        const elapsedSeconds = Math.floor((Date.now() - startTimeMs) / 1000);
        const duration = Math.max(0, elapsedSeconds);

        if (shiftState === "ON") {
          set({
            currentSessionDuration: duration,
            currentBreakSessionDuration: 0,
          });
        } else if (shiftState === "BREAK") {
          set({
            currentSessionDuration: 0,
            currentBreakSessionDuration: duration,
          });
        } else {
          set({ currentSessionDuration: 0, currentBreakSessionDuration: 0 });
        }
      },

      resetTimer: () => {
        set({
          shiftState: "OFF",
          totalWorkedMs: 0,
          totalBreakMs: 0,
          lastStatusChangeAt: null,
          shiftType: null,
          currentSessionDuration: 0,
          currentBreakSessionDuration: 0,
          error: null,
        });
      },
    }),
    {
      name: "timer-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        shiftState: state.shiftState,
        totalWorkedMs: state.totalWorkedMs,
        totalBreakMs: state.totalBreakMs,
        lastStatusChangeAt: state.lastStatusChangeAt,
        shiftType: state.shiftType,
      }),
    },
  ),
);
