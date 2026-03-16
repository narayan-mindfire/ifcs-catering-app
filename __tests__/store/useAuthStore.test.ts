import * as SecureStore from "expo-secure-store";
import apiClient from "../../src/api/axiosClient";
import { useAuthStore } from "../../src/store/useAuthStore";

jest.mock("../../src/api/axiosClient");
jest.mock("expo-secure-store");
jest.mock("expo-device", () => ({ isDevice: false }));
jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      expoPushToken: null,
    });
    jest.clearAllMocks();
  });

  it("has correct initial state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it("successfully logs in", async () => {
    const mockUser = { id: "user123", firstName: "Test", lastName: "User" };
    const mockToken = "fake-token";
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { success: true, data: { token: mockToken, user: mockUser } },
    });

    await useAuthStore.getState().login("testuser", "password");

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("userToken", mockToken);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "userData",
      JSON.stringify(mockUser),
    );
  });

  it("restores session from SecureStore", async () => {
    const mockUser = { id: "user123", firstName: "Test" };
    const mockToken = "saved-token";
    (SecureStore.getItemAsync as jest.Mock).mockImplementation((key) => {
      if (key === "userToken") return Promise.resolve(mockToken);
      if (key === "userData") return Promise.resolve(JSON.stringify(mockUser));
      return Promise.resolve(null);
    });

    // Mock fetchUser to not fail
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { success: true, data: mockUser },
    });

    await useAuthStore.getState().restoreSession();

    const state = useAuthStore.getState();
    expect(state.token).toBe(mockToken);
    expect(state.user).toEqual(mockUser);
  });

  it("handles logout", async () => {
    useAuthStore.setState({ token: "active-token", user: { id: "1" } as any });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("userToken");
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("userData");
  });
});
