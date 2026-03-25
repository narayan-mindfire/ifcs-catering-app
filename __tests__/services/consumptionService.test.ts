import apiClient from "../../src/api/axiosClient";
import { consumptionService } from "../../src/services/consumptionService";

jest.mock("../../src/api/axiosClient");

describe("consumptionService", () => {
  const flightId = "flight123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getRecords should fetch records successfully", async () => {
    const mockResponse = {
      data: {
        success: true,
        data: [{ id: "rec1", flightId }],
        total: 1,
      },
    };
    (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await consumptionService.getRecords(flightId);

    expect(apiClient.get).toHaveBeenCalledWith(
      `/flights/${flightId}/consumption-tracking`,
      { params: {} },
    );
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it("createRecord should post data successfully", async () => {
    const input = { mealId: "meal1", quantity: 10 };
    const mockResponse = {
      data: {
        success: true,
        data: { id: "recnew", ...input },
      },
    };
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await consumptionService.createRecord(
      flightId,
      input as any,
    );

    expect(apiClient.post).toHaveBeenCalledWith(
      `/flights/${flightId}/consumption-tracking`,
      input,
    );
    expect(result.id).toBe("recnew");
  });

  it("deleteRecord should call delete endpoint", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({
      data: { success: true },
    });

    await consumptionService.deleteRecord(flightId, "rec1");

    expect(apiClient.delete).toHaveBeenCalledWith(
      `/flights/${flightId}/consumption-tracking/rec1`,
    );
  });
});
