import apiClient from "../../src/api/axiosClient";
import { userService } from "../../src/services/authService";

jest.mock("../../src/api/axiosClient");

describe("authService", () => {
  describe("getUserById", () => {
    it("returns user data when API call is successful", async () => {
      const mockUser = {
        id: "123",
        name: "Test User",
        role: "admin",
      };

      (apiClient.get as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          data: mockUser,
        },
      });

      const user = await userService.getUserById("123");
      expect(user).toEqual(mockUser);
      expect(apiClient.get).toHaveBeenCalledWith("/users/123", {
        headers: { "x-user-id": "123" },
      });
    });

    it("throws error when API call fails", async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        data: {
          success: false,
        },
      });

      await expect(userService.getUserById("123")).rejects.toThrow(
        "Failed to fetch user details",
      );
    });
  });
});
