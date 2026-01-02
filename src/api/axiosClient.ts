import axios from "axios";

import { log } from "../utils/logger";
const apiClient = axios.create({
  // baseURL: "https://worrisome-overmodestly-nisha.ngrok-free.dev/api/v1", //sambit
  // baseURL: "https://uniterative-nonvocally-retta.ngrok-free.dev/api/v1", //sagarika
  baseURL: "https://caesural-antonina-apogeotropic.ngrok-free.dev/api/v1", //jyoti
  // baseURL: "https://oman.stg.api.ifcs.aero/api/v1",
  // baseURL: "https://uniterative-nonvocally-retta.ngrok-free.dev/api/v1",
  // baseURL: "http:localhost:3000/api/v1",
  // baseURL: "https://optimally-metazoal-jenae.ngrok-free.dev/api/v1",

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
