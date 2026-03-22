import { create } from "zustand";

import { taskService } from "../services/taskService";
import { UnifiedTask } from "../types/task";
import { log } from "../utils/logger";

interface TaskState {
  tasks: UnifiedTask[];
  isLoading: boolean;
  error: string | null;

  fetchTasks: (userId: string, date?: string) => Promise<void>;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
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

  clearTasks: () => {
    set({ tasks: [], error: null, isLoading: false });
  },
}));
