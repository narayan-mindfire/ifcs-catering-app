import { Memo, MemoTab } from "@/types/memo";

import apiClient from "../api/axiosClient";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}

export const memoService = {
  getMemos: async (
    userId: string,
    tab: MemoTab,
    search?: string,
    limit = 20,
    offset = 0,
  ): Promise<Memo[]> => {
    const viewParam = tab === "Inbox" ? "Inbox" : "Acknowledged";
    const params: Record<string, any> = {
      view: viewParam,
      limit,
      offset,
    };
    if (search && search.trim()) {
      params.search = search.trim();
    }
    const response = await apiClient.get("/memos", {
      params,
      headers: { "x-user-id": userId },
    });
    return response.data.data.map((item: any) => {
      if (item.memo) {
        return {
          ...item.memo,
          isRead: item.isRead,
          sender: item.sender,
          recipients: item.recipients || [],
          isAcknowledged: item.memo.status === "Sent" && tab === "Acknowledged",
        };
      }
      return item;
    });
  },

  getMemoById: async (userId: string, id: string): Promise<Memo> => {
    const response = await apiClient.get<ApiResponse<Memo>>(`/memos/${id}`, {
      headers: { "x-user-id": userId },
    });
    return response.data.data;
  },

  acknowledgeMemo: async (userId: string, id: string): Promise<void> => {
    await apiClient.patch(
      `/memos/${id}/acknowledge`,
      { isAcknowledge: true },
      { headers: { "x-user-id": userId } },
    );
  },

  markAsRead: async (userId: string, id: string): Promise<void> => {
    await apiClient.patch(
      `/memos/${id}/read`,
      { isRead: true },
      { headers: { "x-user-id": userId } },
    );
  },
};
