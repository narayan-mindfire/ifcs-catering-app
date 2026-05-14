import apiClient from "../../src/api/axiosClient";
import { spotCheckService } from "../../src/services/spotcheckService";

jest.mock("../../src/api/axiosClient");
jest.mock("../../src/utils/logger");
jest.mock("react-native-image-resizer", () => ({
  createResizedImage: jest
    .fn()
    .mockResolvedValue({ uri: "resized-uri", size: 1024 }),
}));

describe("spotCheckService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submitPass should call post endpoint", async () => {
    const payload = { flightId: "f1", preparationId: "p1", userId: "u1" };
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { success: true },
    });

    await spotCheckService.submitPass(payload as any);

    expect(apiClient.post).toHaveBeenCalledWith(
      expect.stringContaining("spot-check/pass"),
      expect.objectContaining({ userId: "u1" }),
    );
  });

  it("getSpotCheckLogs should return logs", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { success: true, data: [{ id: "l1" }] },
    });

    const result = await spotCheckService.getSpotCheckLogs("u1");

    expect(result).toHaveLength(1);
    expect(apiClient.get).toHaveBeenCalledWith(
      "/spot-check/logs",
      expect.any(Object),
    );
  });
});
