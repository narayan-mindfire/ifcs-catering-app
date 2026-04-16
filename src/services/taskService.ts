import apiClient from "../api/axiosClient";
import { TaskResponse, UnifiedTask } from "../types/task";
import { log } from "../utils/logger";

export const taskService = {
  getTasks: async (userId: string, date?: string): Promise<UnifiedTask[]> => {
    const params: Record<string, any> = {};
    if (date) {
      params.date = date;
    }

    log.info(`Fetching tasks for user ${userId} on date ${date || "today"}`);

    const response = await apiClient.get<TaskResponse>("/users/me/tasks", {
      params,
      headers: { "x-user-id": userId },
    });

    log.info("Tasks API Response:", response.data);

    if (response.data.success) {
      return response.data.data;
    }

    return [];
  },

  patchTaskCompletion: async (
    taskId: string,
    userId: string,
    expectedCompletionTime?: string,
    actualCompletionTime?: string,
  ): Promise<{ success: boolean; data?: UnifiedTask }> => {
    log.info(`Patching task completion for task ${taskId}`);

    const response = await apiClient.patch<{
      success: boolean;
      data: UnifiedTask;
    }>(
      `/tasks/${taskId}/completion`,
      {
        ...(expectedCompletionTime && { expectedCompletionTime }),
        ...(actualCompletionTime && { actualCompletionTime }),
      },
      {
        headers: { "x-user-id": userId },
      },
    );

    return response.data;
  },
};
