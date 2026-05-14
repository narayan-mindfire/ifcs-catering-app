import { create } from "zustand";

import { memoService } from "@/services/memoService";
import { Memo, MemoTab } from "@/types/memo";
import { log } from "@/utils/logger";

interface MemoState {
  memos: Memo[];
  activeMemo: Memo | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  offset: number;
  hasMore: boolean;

  fetchMemos: (
    userId: string,
    tab: MemoTab,
    search?: string,
    loadMore?: boolean,
  ) => Promise<void>;
  fetchMemoById: (userId: string, id: string) => Promise<void>;
  acknowledgeMemo: (userId: string, id: string) => Promise<void>;
  markAsRead: (userId: string, id: string) => Promise<void>;
}

export const useMemoStore = create<MemoState>((set, get) => ({
  memos: [],
  activeMemo: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  offset: 0,
  hasMore: true,

  fetchMemos: async (
    userId: string,
    tab: MemoTab,
    search?: string,
    loadMore = false,
  ) => {
    const limit = 50;
    const currentOffset = loadMore ? get().offset : 0;

    if (loadMore) {
      set({ isLoadingMore: true });
    } else {
      set({
        isLoading: true,
        error: null,
        offset: 0,
        hasMore: true,
        memos: [], // Clear existing memos on fresh fetch
      });
    }

    try {
      const flattenedMemos = await memoService.getMemos(
        userId,
        tab,
        search,
        limit,
        currentOffset,
      );

      set((state) => ({
        memos: loadMore ? [...state.memos, ...flattenedMemos] : flattenedMemos,
        isLoading: false,
        isLoadingMore: false,
        offset: currentOffset + limit,
        hasMore: flattenedMemos.length === limit,
      }));
    } catch (err: any) {
      log.error("Fetch Memos Error:", err);
      set({
        error: "Failed to fetch memos",
        isLoading: false,
        isLoadingMore: false,
        memos: loadMore ? get().memos : [],
        hasMore: false,
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
      log.error("Fetch Memo Detail Error:", err);
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
      log.error("Acknowledge Error:", err);
      throw err;
    }
  },

  markAsRead: async (userId: string, id: string) => {
    try {
      await memoService.markAsRead(userId, id);

      const currentActive = get().activeMemo;
      if (currentActive && currentActive.id === id) {
        const updatedRecipients = currentActive.recipients?.map((r: any) =>
          r.userId === userId ? { ...r, isRead: true } : r,
        );
        set({
          activeMemo: {
            ...currentActive,
            isRead: true,
            recipients: updatedRecipients,
          },
        });
      }

      set((state) => ({
        memos: state.memos.map((m) =>
          m.id === id ? { ...m, isRead: true } : m,
        ),
      }));
    } catch (err: any) {
      log.error("Mark as Read Error:", err);
    }
  },
}));
