import apiClient from "../api/axiosClient";
import { Memo, MemoTab } from "../types/memo";
import { log } from "../utils/logger";

const CURRENT_USER_ID = "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}

export const memoService = {
  getMemos: async (tab: MemoTab, search?: string): Promise<Memo[]> => {
    const viewParam = tab === "Inbox" ? "Inbox" : "Acknowledged";
    const params: Record<string, any> = {
      view: viewParam,
      limit: 100,
      offset: 0,
    };
    if (search && search.trim()) {
      params.search = search.trim();
    }
    const response = await apiClient.get("/memos", {
      params,
      headers: { "x-user-id": CURRENT_USER_ID },
    });
    log.info("Memos Response Data:", response.data);
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

  getMemoById: async (id: string): Promise<Memo> => {
    const response = await apiClient.get<ApiResponse<Memo>>(`/memos/${id}`, {
      headers: { "x-user-id": CURRENT_USER_ID },
    });
    log.info("MEMO: ", response.data.data);
    return response.data.data;
  },

  acknowledgeMemo: async (id: string): Promise<void> => {
    await apiClient.patch(
      `/memos/${id}/acknowledge`,
      { isAcknowledge: true },
      { headers: { "x-user-id": CURRENT_USER_ID } },
    );
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(
      `/memos/${id}/read`,
      { isRead: true },
      { headers: { "x-user-id": CURRENT_USER_ID } },
    );
  },
};
