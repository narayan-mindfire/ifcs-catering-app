import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import React from "react";

import MemosScreen from "../../src/screens/MemosScreen";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useMemoStore } from "../../src/store/useMemosStore";

// Mock stores
jest.mock("../../src/store/useMemosStore");
jest.mock("../../src/store/useAuthStore");

// Mock RefreshControl on react-native directly to avoid interop issues
jest.mock("react-native", () => {
  const rn = jest.requireActual("react-native");
  const RefreshControl = (props: any) => null;
  RefreshControl.displayName = "RefreshControl";
  rn.RefreshControl = RefreshControl;
  return rn;
});

// Mock icons — factory must be self-contained since jest.mock is hoisted
jest.mock("../../src/assets/icons", () => {
  const mockIcon = (name: string) => {
    const Icon = (props: any) => null;
    Icon.displayName = name;
    return Icon;
  };
  return {
    TrayIconActive: mockIcon("TrayIconActive"),
    TrayIcon: mockIcon("TrayIcon"),
    CheckIconActive: mockIcon("CheckIconActive"),
    CheckIcon: mockIcon("CheckIcon"),
    SparkleIcon: mockIcon("SparkleIcon"),
    DocsIconDark: mockIcon("DocsIconDark"),
    NoMemoIcon: mockIcon("NoMemoIcon"),
    SquaresIcon: mockIcon("SquaresIcon"),
    ListChecksIcon: mockIcon("ListChecksIcon"),
  };
});

// Mock BreadCrumb
jest.mock("../../src/components/common/BreadCrumbs", () => ({
  BreadCrumb: () => null,
}));

describe("MemosScreen", () => {
  const mockFetchMemos = jest.fn();

  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: "user123" },
    });
    (useMemoStore as unknown as jest.Mock).mockReturnValue({
      memos: [],
      fetchMemos: mockFetchMemos,
      isLoading: false,
    });
    jest.clearAllMocks();
  });

  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockRoute = {};

  it("renders correctly and fetches memos on mount", () => {
    render(
      <NavigationContainer>
        <MemosScreen
          navigation={mockNavigation as any}
          route={mockRoute as any}
        />
      </NavigationContainer>,
    );

    expect(mockFetchMemos).toHaveBeenCalled();
  });

  it("shows empty state when no memos found", () => {
    const { getByText } = render(
      <NavigationContainer>
        <MemosScreen
          navigation={mockNavigation as any}
          route={mockRoute as any}
        />
      </NavigationContainer>,
    );

    expect(getByText("No Memos Found")).toBeTruthy();
  });
});
