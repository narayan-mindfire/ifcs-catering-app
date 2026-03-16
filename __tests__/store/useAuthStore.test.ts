import { userService } from "../../src/services/authService";
import { useAuthStore } from "../../src/store/useAuthStore";

jest.mock("../../src/services/authService");

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  it("has correct initial state", () => {
    const state = useAuthStore.getState();
    expect(state.userId).toBe("019b8a3e-3efa-74ba-bf47-9f8ff42dbdb9");
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("successfully fetches user", async () => {
    const mockUser = {
      id: "019b8a3e-3efa-74ba-bf47-9f8ff42dbdb9",
      name: "Logged In User",
      role: "operator",
    };

    (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

    await useAuthStore.getState().fetchUser();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("handles fetch error", async () => {
    const errorMessage = "User not found";
    (userService.getUserById as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    await useAuthStore.getState().fetchUser();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
