import { create } from "zustand";
import { Memo, MemoTab } from "../types/memo";
import apiClient from "../api/axiosClient";

const CURRENT_USER_ID = "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}

interface MemoState {
  memos: Memo[];
  activeMemo: Memo | null;
  isLoading: boolean;
  error: string | null;

  fetchMemos: (tab: MemoTab, search?: string) => Promise<void>;
  fetchMemoById: (id: string) => Promise<void>;
  acknowledgeMemo: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

export const useMemoStore = create<MemoState>((set, get) => ({
  memos: [],
  activeMemo: null,
  isLoading: false,
  error: null,

  fetchMemos: async (tab: MemoTab, search?: string) => {
    set({ isLoading: true, error: null });
    try {
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
      const flattenedMemos = response.data.data.map((item: any) => {
        if (item.memo) {
          return {
            ...item.memo,
            isRead: item.isRead,
            sender: item.sender,
            recipients: item.recipients || [],
            isAcknowledged:
              item.memo.status === "Sent" && tab === "Acknowledged By Me",
          };
        }

        return item;
      });

      set({
        memos: flattenedMemos,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("Fetch Memos Error:", err);
      set({
        error: "Failed to fetch memos",
        isLoading: false,
        memos: [],
      });
    }
  },

  fetchMemoById: async (id: string) => {
    set({ isLoading: true, error: null, activeMemo: null });
    try {
      const response = await apiClient.get<ApiResponse<Memo>>(`/memos/${id}`, {
        headers: { "x-user-id": CURRENT_USER_ID },
      });
      console.log("MEMO: ", response.data.data);
      set({
        activeMemo: response.data.data,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("Fetch Memo Detail Error:", err);
      set({
        error: "Failed to load memo details",
        isLoading: false,
      });
    }
  },

  acknowledgeMemo: async (id: string) => {
    try {
      await apiClient.patch(
        `/memos/${id}/acknowledge`,
        { isAcknowledge: true },
        { headers: { "x-user-id": CURRENT_USER_ID } },
      );

      const currentActive = get().activeMemo;
      if (currentActive && currentActive.id === id) {
        set({
          activeMemo: { ...currentActive, isAcknowledged: true },
        });
      }
      set((state) => ({
        memos: state.memos.filter((m) => m.id !== id),
      }));
    } catch (err: any) {
      console.error("Acknowledge Error:", err);
      throw err;
    }
  },

  markAsRead: async (id: string) => {
    try {
      await apiClient.patch(
        `/memos/${id}/read`,
        { isRead: true },
        { headers: { "x-user-id": CURRENT_USER_ID } },
      );

      // Update the active memo's read status
      const currentActive = get().activeMemo;
      if (currentActive && currentActive.id === id) {
        set({
          activeMemo: { ...currentActive, isRead: true },
        });
      }

      // Update the memo in the memos list
      set((state) => ({
        memos: state.memos.map((m) =>
          m.id === id ? { ...m, isRead: true } : m,
        ),
      }));
    } catch (err: any) {
      console.error("Mark as Read Error:", err);
      // Don't throw - marking as read is not critical
    }
  },
}));
