import apiClient from "../../src/api/axiosClient";
import { documentService } from "../../src/services/documentService";

jest.mock("../../src/api/axiosClient");

describe("documentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getFolders should fetch root folders by default", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { success: true, data: [] },
    });

    await documentService.getFolders();

    expect(apiClient.get).toHaveBeenCalledWith(
      "/documents/folders",
      expect.objectContaining({
        params: expect.objectContaining({ limit: 100 }),
      }),
    );
  });

  it("getFolderFiles should fetch files for folder", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { success: true, data: [] },
    });

    await documentService.getFolderFiles("f1");

    expect(apiClient.get).toHaveBeenCalledWith(
      "/documents/folders/f1/files",
      expect.any(Object),
    );
  });

  it("getDownloadUrl should return url from response", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { success: true, data: { url: "http://test.com" } },
    });

    const url = await documentService.getDownloadUrl("file1");

    expect(url).toBe("http://test.com");
  });
});
