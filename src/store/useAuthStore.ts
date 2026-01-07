import { create } from "zustand";

import { userService } from "../services/authService";
import { User } from "../types/user";

const HARDCODED_USER_ID = "019b8a3e-3efa-74ba-bf46-877dca7aebd4";

interface AuthStore {
  userId: string;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  userId: HARDCODED_USER_ID,
  user: null,
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.getUserById(HARDCODED_USER_ID);
      set({ user, isLoading: false });
    } catch (e: any) {
      set({
        error: e.message || "Failed to fetch user",
        isLoading: false,
      });
    }
  },
}));
