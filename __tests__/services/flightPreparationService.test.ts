import apiClient from "../../src/api/axiosClient";
import { flightPreparationService } from "../../src/services/flightPreparationService";

jest.mock("../../src/api/axiosClient");
jest.mock("../../src/utils/logger");

describe("flightPreparationService", () => {
  const flightId = "flight1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getPreparations should return items on success", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { success: true, data: [{ id: "p1" }] }
    });

    const result = await flightPreparationService.getPreparations(flightId);

    expect(result.preparations).toHaveLength(1);
    expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining("preparations"), expect.any(Object));
  });

  it("updatePreparationFlag should call patch", async () => {
    const payload = { hasSeal: true };
    (apiClient.patch as jest.Mock).mockResolvedValue({
      data: { success: true, data: { id: "p1", ...payload } }
    });

    const result = await flightPreparationService.updatePreparationFlag(flightId, "p1", payload as any);

    expect(apiClient.patch).toHaveBeenCalled();
    expect(result.id).toBe("p1");
  });

  it("getUserSignatures should handle both array and object responses", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { success: true, data: { id: "s1" } }
    });

    const result = await flightPreparationService.getUserSignatures(flightId, "u1");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("s1");
  });
});
