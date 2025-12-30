import { SpotCheckFailPayload, SpotCheckResponse } from "../types/spotcheck";
import { log } from "../utils/logger";

export const spotCheckService = {
  submitPass: async (
    flightId: string,
    preparationId: string,
  ): Promise<SpotCheckResponse> => {
    log.info(`[SpotCheckService] Submitting PASS for Prep: ${preparationId}`);

    // --- REAL IMPLEMENTATION (Uncomment when API ready) ---
    // const response = await apiClient.patch<SpotCheckResponse>(
    //   `/flights/${flightId}/preparations/${preparationId}/spot-check`,
    //   { status: 'Passed' }
    // );
    // return response.data;

    await new Promise((r) => setTimeout(r, 800)); // Mock delay
    return Promise.resolve({ success: true, message: "Spot check passed" });
  },

  submitFail: async (
    payload: SpotCheckFailPayload,
  ): Promise<SpotCheckResponse> => {
    log.info("================= SPOT CHECK FAIL PAYLOAD =================");
    log.info(`Flight: ${payload.flightNumber} | Route: ${payload.route}`);
    log.info(`Reason: ${payload.reason}`);
    log.info(`Equipment: ${payload.equipmentItemName}`);
    log.info(`Images Count: ${payload.images.length}`);
    log.info("===========================================================");

    // --- REAL IMPLEMENTATION (Uncomment when API ready) ---
    /*
    const formData = new FormData();
    formData.append('flightId', payload.flightId);
    formData.append('preparationId', payload.preparationId);
    formData.append('route', payload.route);
    formData.append('loadingPlan', payload.loadingPlan);
    formData.append('aircraftRegistration', payload.aircraftRegistration);
    formData.append('flightNumber', payload.flightNumber);
    formData.append('equipmentItemName', payload.equipmentItemName);
    formData.append('remarks', payload.remarks);
    formData.append('reason', payload.reason);

    payload.images.forEach((imageUri) => {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      
      // @ts-ignore
      formData.append('images', { uri: imageUri, name: filename, type });
    });

    const response = await apiClient.post<SpotCheckResponse>(
      `/flights/${flightId}/compliance/spot-check-fail`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
    */

    await new Promise((r) => setTimeout(r, 1500)); // Mock delay
    return Promise.resolve({
      success: true,
      message: "Compliance record created",
    });
  },
};
