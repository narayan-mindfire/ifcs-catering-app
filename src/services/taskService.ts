import { TaskResponse, UnifiedTask } from "@/types/task";

import apiClient from "../api/axiosClient";

export const taskService = {
  getTasks: async (userId: string, date?: string): Promise<UnifiedTask[]> => {
    const params: Record<string, any> = {};
    if (date) {
      params.date = date;
    }

    const response = await apiClient.get<TaskResponse>("/users/me/tasks", {
      params,
      headers: { "x-user-id": userId },
    });

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
