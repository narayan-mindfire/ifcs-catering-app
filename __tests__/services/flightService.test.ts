import apiClient from "../../src/api/axiosClient";
import { flightService } from "../../src/services/flightService";

jest.mock("../../src/api/axiosClient");

describe("flightService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getFlights should map api response to FlightServiceResponse", async () => {
    const mockResponse = {
      data: {
        data: [{ id: "f1" }],
        meta: {
          pagination: {
            hasNextPage: true,
            page: 1,
            total: 100
          }
        }
      }
    };
    (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await flightService.getFlights({ page: 1, limit: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(100);
    expect(result.meta.hasNextPage).toBe(true);
  });

  it("getFlightById should return data on success", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { success: true, data: [{ id: "f1" }] }
    });

    const result = await flightService.getFlightById("f1");
    expect(result).toHaveLength(1);
  });
});
