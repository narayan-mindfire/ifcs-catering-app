import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { taskService } from "../services/taskService";
import { UnifiedTask } from "../types/task";
import { log } from "../utils/logger";

interface TaskState {
  tasks: UnifiedTask[];
  selectedTaskId: string | null;
  taskStepsStatus: Record<string, Record<string, boolean>>;
  isLoading: boolean;
  error: string | null;

  fetchTasks: (userId: string, date?: string) => Promise<void>;
  setSelectedTaskId: (id: string | null) => void;
  setStepStatus: (taskId: string, stepId: string, status: boolean) => void;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      selectedTaskId: null,
      taskStepsStatus: {},
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

      clearTasks: () => {
        set({
          tasks: [],
          selectedTaskId: null,
          taskStepsStatus: {},
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
        selectedTaskId: state.selectedTaskId,
      }),
    },
  ),
);
