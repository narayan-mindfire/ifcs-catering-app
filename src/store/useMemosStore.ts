import { create } from "zustand";
import { Memo, MemoTab } from "../types/memo";
import { MOCK_MEMOS } from "../const/memosData";

interface MemoState {
  memos: Memo[];
  activeMemo: Memo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMemos: () => Promise<void>; // Removed flightId param
  fetchMemoById: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  toggleImportant: (id: string) => Promise<void>;
  acknowledgeMemo: (id: string) => Promise<void>;

  // Selectors
  getMemosByTab: (tab: MemoTab) => Memo[];
}

export const useMemoStore = create<MemoState>((set, get) => ({
  memos: [],
  activeMemo: null,
  isLoading: false,
  error: null,

  fetchMemos: async () => {
    set({ isLoading: true, error: null });

    // Simulate API Call for User's Memos
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, you'd pass userId here.
        // For now, we return ALL mock data assuming it belongs to the logged-in user.
        set({ memos: MOCK_MEMOS, isLoading: false });
        resolve();
      }, 800);
    });
  },

  fetchMemoById: async (id: string) => {
    set({ isLoading: true, error: null, activeMemo: null });

    return new Promise((resolve) => {
      setTimeout(() => {
        // Check local state first, then fallback to mock data
        const memo =
          get().memos.find((m) => m.id === id) ||
          MOCK_MEMOS.find((m) => m.id === id);

        if (memo) {
          if (!memo.isRead) {
            get().markAsRead(id);
            set({ activeMemo: { ...memo, isRead: true } });
          } else {
            set({ activeMemo: memo });
          }
        } else {
          set({ error: "Memo not found" });
        }
        set({ isLoading: false });
        resolve();
      }, 500);
    });
  },

  markAsRead: async (id: string) => {
    set((state) => ({
      memos: state.memos.map((m) => (m.id === id ? { ...m, isRead: true } : m)),
    }));
  },

  toggleImportant: async (id: string) => {
    set((state) => ({
      memos: state.memos.map((m) =>
        m.id === id ? { ...m, isImportant: !m.isImportant } : m,
      ),
      activeMemo:
        state.activeMemo?.id === id
          ? { ...state.activeMemo, isImportant: !state.activeMemo.isImportant }
          : state.activeMemo,
    }));
  },

  acknowledgeMemo: async (id: string) => {
    set({ isLoading: true });
    return new Promise((resolve) => {
      setTimeout(() => {
        set((state) => ({
          memos: state.memos.map((m) =>
            m.id === id ? { ...m, isAcknowledged: true } : m,
          ),
          activeMemo:
            state.activeMemo?.id === id
              ? { ...state.activeMemo, isAcknowledged: true }
              : state.activeMemo,
          isLoading: false,
        }));
        resolve();
      }, 600);
    });
  },

  getMemosByTab: (tab: MemoTab) => {
    const { memos } = get();
    const currentUserId = "user-123";

    switch (tab) {
      case "Inbox":
        return memos.filter((m) => !m.isDraft && m.sender.id !== currentUserId);
      case "Draft":
        return memos.filter((m) => m.isDraft && m.sender.id === currentUserId);
      case "Sent":
        return memos.filter((m) => !m.isDraft && m.sender.id === currentUserId);
      case "Acknowledged By Me":
        return memos.filter((m) => m.isAcknowledged);
      default:
        return [];
    }
  },
}));
