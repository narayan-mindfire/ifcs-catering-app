import { create } from "zustand";
import { Memo, MemoTab } from "../types/memo";
import { memoService } from "../services/memoService";

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
      const flattenedMemos = await memoService.getMemos(tab, search);
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
      const memo = await memoService.getMemoById(id);
      set({
        activeMemo: memo,
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
      await memoService.acknowledgeMemo(id);

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
      await memoService.markAsRead(id);

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
