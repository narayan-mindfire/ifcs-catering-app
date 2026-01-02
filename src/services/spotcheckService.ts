import ImageResizer from "react-native-image-resizer";

import apiClient from "../api/axiosClient";
import {
  SpotCheckFailPayload,
  SpotCheckLog,
  SpotCheckLogsResponse,
  SpotCheckPassPayload,
  SpotCheckResponse,
} from "../types/spotcheck";
import { log } from "../utils/logger";

export const spotCheckService = {
  submitPass: async (
    payload: SpotCheckPassPayload,
  ): Promise<SpotCheckResponse> => {
    log.info(
      `[SpotCheckService] Submitting PASS for Prep: ${payload.preparationId}`,
    );

    try {
      const response = await apiClient.post<SpotCheckResponse>(
        `/flights/${payload.flightId}/preparations/${payload.preparationId}/spot-check/pass`,
        {
          userId: payload.userId,
          container: payload.container,
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to submit Pass");
    }
  },

  submitFail: async (
    payload: SpotCheckFailPayload,
  ): Promise<SpotCheckResponse> => {
    log.info("================= SPOT CHECK FAIL PAYLOAD =================");
    log.info(`Reason: ${payload.reason} | Remarks: ${payload.remarks}`);
    log.info(`Images Count: ${payload.images.length}`);

    const formData = new FormData();

    // Required API Fields
    formData.append("userId", payload.userId);
    formData.append("reason", payload.reason);
    formData.append("remarks", payload.remarks);

    // Optional/Compliance Fields
    if (payload.container) formData.append("container", payload.container);
    if (payload.equipmentItemId)
      formData.append("equipmentItemId", payload.equipmentItemId);
    formData.append("equipmentItemName", payload.equipmentItemName);
    formData.append("route", payload.route);
    formData.append("flightNumber", payload.flightNumber);
    if (payload.loadingPlanId)
      formData.append("loadingPlan", payload.loadingPlanId);
    formData.append("aircraftRegistration", payload.aircraftRegistration);

    log.info("Starting image compression...");

    for (let index = 0; index < payload.images.length; index++) {
      const imageUri = payload.images[index];

      try {
        log.info(`[Image ${index + 1}] Compressing: ${imageUri}`);

        const resizedImage = await ImageResizer.createResizedImage(
          imageUri,
          1200,
          1200,
          "JPEG",
          85,
          0,
          undefined,
          false,
          { mode: "contain", onlyScaleDown: true },
        );

        const filename = `compliance_${index}_${Date.now()}.jpg`;

        const imageFile = {
          uri: resizedImage.uri,
          name: filename,
          type: "image/jpeg",
        };

        log.info(`[Image ${index + 1}] Compressed successfully`);
        log.info(`[Image ${index + 1}] Original: ${imageUri}`);
        log.info(`[Image ${index + 1}] Compressed: ${resizedImage.uri}`);
        log.info(
          `[Image ${index + 1}] New size: ${(resizedImage.size / 1024).toFixed(2)} KB`,
        );

        // @ts-ignore
        formData.append("images", imageFile);
      } catch (compressionError) {
        log.error(`[Image ${index + 1}] Compression failed:`, compressionError);

        log.info(`[Image ${index + 1}] Using original (uncompressed)`);
        const filename = imageUri.split("/").pop() || `photo_${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const ext = match ? match[1].toLowerCase() : "jpg";
        const type =
          ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;

        const imageFile = {
          uri: imageUri,
          name: filename,
          type: type,
        };

        // @ts-ignore
        formData.append("images", imageFile);
      }
    }

    log.info("Image compression completed");
    log.info("===========================================================");

    try {
      log.info("Uploading to API...");

      const response = await apiClient.post<SpotCheckResponse>(
        `/flights/${payload.flightId}/preparations/${payload.preparationId}/spot-check/fail`,
        formData,
        {
          headers: {
            Accept: "application/json",
          },
          transformRequest: (data) => {
            return data;
          },
          timeout: 60000,
        },
      );

      log.info("Upload successful!", response.data);
      return response.data;
    } catch (error: any) {
      log.error("--- AXIOS ERROR DEBUG ---");

      if (error.code === "ECONNABORTED") {
        log.error("Request made but NO RESPONSE received.");
        log.error("Request details:", JSON.stringify(error.request, null, 2));
        log.error("Config:", JSON.stringify(error.config, null, 2));
      }

      log.error("Submit Fail Error:", error.message || error);

      throw new Error(
        error.response?.data?.message ||
          (error.code === "ECONNABORTED"
            ? "Upload timed out. Please check your internet connection and try again with fewer images."
            : "Failed to submit spot check failure. Please try again."),
      );
    }
  },

  getSpotCheckLogs: async (
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<SpotCheckLog[]> => {
    const response = await apiClient.get<SpotCheckLogsResponse>(
      "/spot-check/logs",
      {
        params: { userId, limit, offset },
      },
    );

    if (response.data.success) {
      return response.data.data || [];
    }
    return [];
  },
};
