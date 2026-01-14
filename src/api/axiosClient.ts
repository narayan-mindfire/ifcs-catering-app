import axios from "axios";

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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    log.info("--- AXIOS ERROR DEBUG ---");
    if (error.response) {
      log.info("Status:", error.response.status);
      log.info("Data:", error.response.data);
    } else if (error.request) {
      log.info("Request made but NO RESPONSE received.");
      log.info("Request details:", error.request);
    } else {
      log.info("Error Message:", error.message);
    }
    log.info("Config:", error.config);

    return Promise.reject(error);
  },
);

export default apiClient;
