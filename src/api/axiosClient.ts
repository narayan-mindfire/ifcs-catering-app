import axios from "axios";
const apiClient = axios.create({
  baseURL: process.env.EXPO_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("--- AXIOS ERROR DEBUG ---");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else if (error.request) {
      console.log("Request made but NO RESPONSE received.");
      console.log("Request details:", error.request);
    } else {
      console.log("Error Message:", error.message);
    }
    console.log("Config:", error.config);

    return Promise.reject(error);
  },
);

export default apiClient;
