import { create } from "zustand";
import { Memo, MemoTab } from "../types/memo";
import { MOCK_MEMOS } from "../const/memosData";

interface MemoState {
  memos: Memo[];
  activeMemo: Memo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMemos: () => Promise<void>;
  fetchMemoById: (id: string) => Promise<void>;
  addMemo: (memo: Memo) => void; // <--- NEW ACTION
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
    return new Promise((resolve) => {
      setTimeout(() => {
        // If memos are already loaded in state, don't overwrite with mock defaults if we added new ones
        const currentMemos = get().memos;
        if (currentMemos.length === 0) {
          set({ memos: MOCK_MEMOS, isLoading: false });
        } else {
          set({ isLoading: false });
        }
        resolve();
      }, 800);
    });
  },

  fetchMemoById: async (id: string) => {
    set({ isLoading: true, error: null, activeMemo: null });
    return new Promise((resolve) => {
      setTimeout(() => {
        // Search in current state first (to find newly added memos)
        const allMemos = get().memos.length > 0 ? get().memos : MOCK_MEMOS;
        const memo = allMemos.find((m) => m.id === id);

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

  addMemo: (newMemo: Memo) => {
    set((state) => ({
      memos: [newMemo, ...state.memos],
    }));
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
    // Logic: In a real app, 'Sent' logic would be based on senderID.
    // For this demo, we will just return all memos for Inbox to see the one we created.
    if (tab === "Inbox") return memos;
    return [];
  },
}));
