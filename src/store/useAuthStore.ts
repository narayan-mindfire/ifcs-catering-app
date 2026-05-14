/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";

import { User } from "@/types/user";
import { log } from "@/utils/logger";

import apiClient from "../api/axiosClient";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  expoPushToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  loginWithSSO: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  registerPushToken: () => Promise<void>;
  restoreSession: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  expoPushToken: null,

  login: async (username, password) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });
      const { token, user } = response.data.data;
      if (token) {
        await SecureStore.setItemAsync("userToken", token);
        if (user) {
          await SecureStore.setItemAsync("userData", JSON.stringify(user));
        }
        set({ token, user: user || null, isLoading: false });

        get().registerPushToken();
      }
    } catch (error) {
      set({ isLoading: false, token: null, user: null });
      log.error("Login Error:", error);
      throw error;
    }
  },

  loginWithSSO: async (idToken) => {
    try {
      set({ isLoading: true });
      const response = await apiClient.post("/auth/microsoft", { idToken });
      const { token, user } = response.data.data;
      if (token) {
        await SecureStore.setItemAsync("userToken", token);
        if (user) {
          await SecureStore.setItemAsync("userData", JSON.stringify(user));
        }
        set({ token, user: user || null, isLoading: false });
        get().registerPushToken();
      }
    } catch (error) {
      set({ isLoading: false });
      log.error("SSO Login Error:", error);
      throw error;
    }
  },

  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const userData = await SecureStore.getItemAsync("userData");

      if (token) {
        const user = userData ? JSON.parse(userData) : null;
        set({ token, user, isLoading: false });

        // Refresh user profile in background to ensure up-to-date info
        get().fetchUser();

        // Refresh push token in background
        get().registerPushToken();
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      log.error("Restore Session Error:", error);
      set({ isLoading: false });
    }
  },

  fetchUser: async () => {
    try {
      const response = await apiClient.get("/users/me");
      if (response.data.success) {
        const user = response.data.data;
        set({ user });
        await SecureStore.setItemAsync("userData", JSON.stringify(user));
      }
    } catch (error: any) {
      log.error("Fetch User Error:", error);
      if (error.response?.status === 401) {
        get().logout();
      }
    }
  },

  registerPushToken: async () => {
    try {
      if (!Device.isDevice) return;

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const pushToken = tokenData.data;

      set({ expoPushToken: pushToken });

      await apiClient.post("/notifications/register", {
        pushToken,
        appId: "ifcs-catering",
        platform: Platform.OS,
        deviceName: Device.deviceName || "Unknown Device",
      });
    } catch (error) {
      log.error("Push registration background error:", error);
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      const pushToken = get().expoPushToken;
      if (pushToken) {
        try {
          await apiClient.delete("/notifications/unregister", {
            data: { pushToken },
          });
        } catch (e) {
          /* ignore */
        }
      }
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userData");
      set({ user: null, token: null, expoPushToken: null, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
