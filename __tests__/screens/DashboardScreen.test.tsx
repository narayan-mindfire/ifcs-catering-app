import React from "react";
import { render } from "@testing-library/react-native";
import DashboardScreen from "../../src/screens/DashboardScreen";
import { useAuthStore } from "../../src/store/useAuthStore";

// Mock useAuthStore
jest.mock("../../src/store/useAuthStore");

// Mock sub-components
jest.mock("../../src/components/dashboard/Sidebar", () => ({
  Sidebar: () => null,
}));
jest.mock("../../src/components/dashboard/MainContent", () => ({
  MainContent: () => null,
}));
jest.mock("../../src/components/common/UserDropdown", () => ({
  UserDropdown: () => null,
}));

describe("DashboardScreen", () => {
  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { firstName: "John", lastName: "Doe" },
    });
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { toJSON } = render(<DashboardScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it("sets up the layout with Sidebar and MainContent", () => {
    // Since we mock components as null, we just check if it doesn't crash
    // and correctly accesses auth store
    render(<DashboardScreen />);
    expect(useAuthStore).toHaveBeenCalled();
  });
});
