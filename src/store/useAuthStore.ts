/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";

import apiClient from "../api/axiosClient";
import { User } from "../types/user";
import { log } from "../utils/logger";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  expoPushToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerPushToken: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  expoPushToken: null,

  login: async (username, password) => {
    try {
      set({ isLoading: true });
      log.info("Attempting login for user:", username);
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });
      log.info("Login response received:", response.data);
      const { token, user } = response.data.data;
      log.info("Login successful, token and user extracted.", token, user);
      if (token) {
        log.info("Login successful, saving token and user data.");
        await SecureStore.setItemAsync("userToken", token);

        log.info(
          "Token saved. Updating state and registering push token in background.",
        );
        set({ token, user: user || null, isLoading: false });

        log.info("Starting push token registration in background.");
        get().registerPushToken();
      }
    } catch (error) {
      set({ isLoading: false, token: null, user: null });
      log.error("Login Error:", error);
      throw error;
    }
  },

  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        log.info("Token found, restoring session...");
        set({ token });
        set({ isLoading: false });
        get().registerPushToken();
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      log.error("Restore Session Error:", error);
      set({ isLoading: false });
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
      log.info("Expo push token retrieved.");
      const pushToken = tokenData.data;

      set({ expoPushToken: pushToken });

      // If this fails (e.g. 401), the internal catch handles it without affecting login state
      log.info("Registering push token with backend.");
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
      set({ user: null, token: null, expoPushToken: null, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
