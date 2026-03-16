import apiClient from "../../src/api/axiosClient";
import { memoService } from "../../src/services/memoService";

jest.mock("../../src/api/axiosClient");
jest.mock("../../src/utils/logger");

describe("memoService", () => {
  const userId = "user1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getMemos should fetch and map memos", async () => {
    const mockData = {
      data: [
        {
          memo: { id: "m1", status: "Sent" },
          isRead: false,
          sender: "System",
        }
      ]
    };
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await memoService.getMemos(userId, "Inbox");

    expect(apiClient.get).toHaveBeenCalledWith("/memos", expect.objectContaining({
      headers: { "x-user-id": userId }
    }));
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("m1");
  });

  it("acknowledgeMemo should call patch endpoint", async () => {
    (apiClient.patch as jest.Mock).mockResolvedValue({ data: { success: true } });

    await memoService.acknowledgeMemo(userId, "m1");

    expect(apiClient.patch).toHaveBeenCalledWith(
      "/memos/m1/acknowledge",
      { isAcknowledge: true },
      { headers: { "x-user-id": userId } }
    );
  });
});
