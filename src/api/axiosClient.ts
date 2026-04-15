import axios from "axios";
import * as SecureStore from "expo-secure-store";

import { log } from "../utils/logger";
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,

  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "any-value",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("userToken");
    log.info("Attaching token to request:", token ? "Yes" : "No");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    log.info("--- AXIOS REQUEST DEBUG ---");
    log.info("Method:", config.method);
    // log.info("Base URL:", config.baseURL);
    log.info("URL:", config.url);
    // log.info("Headers:", config.headers);
    // log.info("Params:", config.params);
    // log.info("Body:", config.data);
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    // log.error("--- AXIOS RESPONSE DEBUG ---");
    // log.error("Status:", response.status);
    // log.error("Data:", response.data);
    return response;
  },
  (error) => {
    log.error("--- AXIOS ERROR DEBUG ---");
    if (error.response) {
      log.error("Status:", error.response.status);
      log.error("Data:", error.response.data);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
