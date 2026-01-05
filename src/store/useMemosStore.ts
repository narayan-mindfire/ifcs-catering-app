import { create } from "zustand";

import { memoService } from "../services/memoService";
import { Memo, MemoTab } from "../types/memo";

interface MemoState {
  memos: Memo[];
  activeMemo: Memo | null;
  isLoading: boolean;
  error: string | null;

  fetchMemos: (userId: string, tab: MemoTab, search?: string) => Promise<void>;
  fetchMemoById: (id: string, userId: string) => Promise<void>;
  acknowledgeMemo: (id: string, userId: string) => Promise<void>;
  markAsRead: (id: string, userId: string) => Promise<void>;
}

export const useMemoStore = create<MemoState>((set, get) => ({
  memos: [],
  activeMemo: null,
  isLoading: false,
  error: null,

  fetchMemos: async (userId: string, tab: MemoTab, search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const flattenedMemos = await memoService.getMemos(userId, tab, search);
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

  fetchMemoById: async (userId: string, id: string) => {
    set({ isLoading: true, error: null, activeMemo: null });
    try {
      const memo = await memoService.getMemoById(userId, id);
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

  acknowledgeMemo: async (userId: string, id: string) => {
    try {
      await memoService.acknowledgeMemo(userId, id);

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

  markAsRead: async (userId: string, id: string) => {
    try {
      await memoService.markAsRead(userId, id);

      const currentActive = get().activeMemo;
      if (currentActive && currentActive.id === id) {
        set({
          activeMemo: { ...currentActive, isRead: true },
        });
      }

      set((state) => ({
        memos: state.memos.map((m) =>
          m.id === id ? { ...m, isRead: true } : m,
        ),
      }));
    } catch (err: any) {
      console.error("Mark as Read Error:", err);
    }
  },
}));
