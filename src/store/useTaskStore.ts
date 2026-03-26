import { create } from "zustand";

import { taskService } from "../services/taskService";
import { UnifiedTask } from "../types/task";
import { log } from "../utils/logger";

interface TaskState {
  tasks: UnifiedTask[];
  selectedTaskId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchTasks: (userId: string, date?: string) => Promise<void>;
  setSelectedTaskId: (id: string | null) => void;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  selectedTaskId: null,
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

  clearTasks: () => {
    set({ tasks: [], selectedTaskId: null, error: null, isLoading: false });
  },
}));
