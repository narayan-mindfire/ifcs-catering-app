import apiClient from "../../src/api/axiosClient";
import { deliveryService } from "../../src/services/deliveryService";

jest.mock("../../src/api/axiosClient");
jest.mock("../../src/utils/logger");

describe("deliveryService", () => {
  const flightId = "flight123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getDeliveries should use the exact flightId in the request URL", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { success: true, data: [] },
    });
    const specificFlightId = "test-flight-id-456";

    await deliveryService.getDeliveries(specificFlightId);

    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining(`/flights/${specificFlightId}/deliveries`),
      expect.any(Object),
    );
  });

  it("addSignature should clean signature and post data", async () => {
    const signature = "data:image/png;base64,abc123";
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { success: true, data: { id: "d1" } },
    });

    await deliveryService.addSignature(
      flightId,
      "d1",
      "driver",
      signature,
      "Test comment",
    );

    expect(apiClient.post).toHaveBeenCalledWith(
      expect.stringContaining("type=driver"),
      expect.objectContaining({
        signature: "abc123",
        comment: "Test comment",
      }),
    );
  });

  it("deleteDelivery should call delete endpoint", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({
      data: { success: true },
    });

    await deliveryService.deleteDelivery(flightId, "d1");

    expect(apiClient.delete).toHaveBeenCalled();
  });
});
