import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { taskService } from "@/services/taskService";
import { UnifiedTask } from "@/types/task";
import { log } from "@/utils/logger";

interface TaskState {
  tasks: UnifiedTask[];
  selectedTaskId: string | null;
  taskStepsStatus: Record<string, Record<string, boolean>>;
  taskTimerState: Record<
    string,
    {
      accumulatedTime: number;
      startTime: number | null;
      isTimerRunning: boolean;
    }
  >;
  isLoading: boolean;
  error: string | null;

  fetchTasks: (userId: string, date?: string) => Promise<void>;
  setSelectedTaskId: (id: string | null) => void;
  setStepStatus: (taskId: string, stepId: string, status: boolean) => void;
  setTaskTimer: (
    taskId: string,
    accumulatedTime: number,
    isTimerRunning: boolean,
    startTime?: number | null,
  ) => void;
  syncTaskCompletion: (
    taskId: string,
    userId: string,
    expected?: string,
    actual?: string,
  ) => Promise<void>;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      selectedTaskId: null,
      taskStepsStatus: {},
      taskTimerState: {},
      isLoading: false,
      error: null,

      fetchTasks: async (userId: string, date?: string) => {
        set({ isLoading: true, error: null });
        try {
          const tasks = await taskService.getTasks(userId, date);
          set({ tasks, isLoading: false });
        } catch (err: any) {
          log.error("Fetch Tasks Error:", err);
          set({
            error: "Failed to fetch tasks",
            isLoading: false,
            tasks: [],
          });
        }
      },

      setSelectedTaskId: (id: string | null) => {
        set({ selectedTaskId: id });
      },

      setStepStatus: (taskId: string, stepId: string, status: boolean) => {
        set((state) => ({
          taskStepsStatus: {
            ...state.taskStepsStatus,
            [taskId]: {
              ...(state.taskStepsStatus[taskId] || {}),
              [stepId]: status,
            },
          },
        }));
      },

      setTaskTimer: (taskId, accumulatedTime, isTimerRunning, startTime) => {
        set((state) => ({
          taskTimerState: {
            ...state.taskTimerState,
            [taskId]: {
              accumulatedTime,
              isTimerRunning,
              startTime:
                startTime !== undefined
                  ? startTime
                  : isTimerRunning
                    ? Date.now()
                    : null,
            },
          },
        }));
      },

      syncTaskCompletion: async (taskId, userId, expected, actual) => {
        set({ isLoading: true, error: null });
        try {
          const response = await taskService.patchTaskCompletion(
            taskId,
            userId,
            expected,
            actual,
          );
          if (response.success && response.data) {
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === taskId ? { ...t, ...response.data } : t,
              ),
              isLoading: false,
            }));
          } else {
            set({ isLoading: false, error: "Failed to sync task completion" });
          }
        } catch (err: any) {
          log.error("Sync Task Completion Error:", err);
          set({ isLoading: false, error: "Failed to sync task completion" });
        }
      },

      clearTasks: () => {
        set({
          tasks: [],
          selectedTaskId: null,
          taskStepsStatus: {},
          taskTimerState: {},
          error: null,
          isLoading: false,
        });
      },
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        taskStepsStatus: state.taskStepsStatus,
        taskTimerState: state.taskTimerState,
        selectedTaskId: state.selectedTaskId,
      }),
    },
  ),
);
