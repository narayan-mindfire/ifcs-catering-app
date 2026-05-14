import apiClient from "../../src/api/axiosClient";
import { destinationService } from "../../src/services/destinationService";

jest.mock("../../src/api/axiosClient");

describe("destinationService", () => {
  it("getDestinations should call api with correct params", async () => {
    const mockData = { success: true, data: [], total: 0 };
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await destinationService.getDestinations("MCT", 1, 10);

    expect(apiClient.get).toHaveBeenCalledWith("/destinations", {
      params: expect.objectContaining({
        search: "MCT",
        page: 1,
        limit: 10,
      }),
    });
    expect(result).toBe(mockData);
  });
});
