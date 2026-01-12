import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ShiftState = "OFF" | "ON" | "BREAK";

interface TimerStoreState {
  shiftState: ShiftState;
  totalWorkingTimeToday: number;
  lastSessionStartTime: number | null;

  currentSessionDuration: number;

  startShift: () => void;
  pauseShift: () => void;
  resumeShift: () => void;
  endShift: () => void;
  syncTime: () => void;
}

export const useTimerStore = create<TimerStoreState>()(
  persist(
    (set, get) => ({
      shiftState: "OFF",
      totalWorkingTimeToday: 0,
      lastSessionStartTime: null,
      currentSessionDuration: 0,

      startShift: () => {
        set({
          shiftState: "ON",
          lastSessionStartTime: Date.now(),
          currentSessionDuration: 0,
        });
      },

      pauseShift: () => {
        const { lastSessionStartTime, totalWorkingTimeToday } = get();
        if (lastSessionStartTime) {
          const sessionSeconds = Math.floor(
            (Date.now() - lastSessionStartTime) / 1000,
          );
          set({
            shiftState: "BREAK",
            totalWorkingTimeToday: totalWorkingTimeToday + sessionSeconds,
            lastSessionStartTime: null,
            currentSessionDuration: 0,
          });
        } else {
          set({ shiftState: "BREAK" });
        }
      },

      resumeShift: () => {
        set({
          shiftState: "ON",
          lastSessionStartTime: Date.now(),
          currentSessionDuration: 0,
        });
      },

      endShift: () => {
        set({
          shiftState: "OFF",
          totalWorkingTimeToday: 0,
          lastSessionStartTime: null,
          currentSessionDuration: 0,
        });
      },

      syncTime: () => {
        const { shiftState, lastSessionStartTime } = get();
        if (shiftState === "ON" && lastSessionStartTime) {
          const elapsedSeconds = Math.floor(
            (Date.now() - lastSessionStartTime) / 1000,
          );
          set({ currentSessionDuration: elapsedSeconds });
        }
      },
    }),
    {
      name: "timer-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        shiftState: state.shiftState,
        totalWorkingTimeToday: state.totalWorkingTimeToday,
        lastSessionStartTime: state.lastSessionStartTime,
      }),
    },
  ),
);
