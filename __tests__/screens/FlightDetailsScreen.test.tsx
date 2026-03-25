import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import React from "react";

import FlightDetailsScreen from "../../src/screens/FlightDetailsScreen";
import { useFlightStore } from "../../src/store/useFlightStore";

// Mock useFlightStore
jest.mock("../../src/store/useFlightStore");

// Mock sub-components
jest.mock("../../src/components/common/BreadCrumbs", () => ({
  BreadCrumb: () => null,
}));

// Mock tab components
jest.mock("../../src/screens/details/Preparations", () => ({
  PreparationsScreen: () => null,
}));
jest.mock("../../src/screens/details/Deliveries", () => () => null);

// Mock reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe("FlightDetailsScreen", () => {
  const mockSelectFlightById = jest.fn();
  const mockFetchFlightById = jest.fn();
  const mockNavigation = {
    navigate: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  };
  const mockRoute = {
    params: {
      flightId: "123",
      route: "MCT-DXB",
      flightNumber: "WY123",
      date: "2024-03-25T12:00:00Z",
    },
  };

  beforeEach(() => {
    (useFlightStore as unknown as jest.Mock).mockReturnValue({
      selectFlightById: mockSelectFlightById,
      fetchFlightById: mockFetchFlightById,
      selectedFlight: { id: "123", flightNumber: "WY123" },
    });
    jest.clearAllMocks();
  });

  it("renders correctly and selects flight on mount", () => {
    const { getByText } = render(
      <NavigationContainer>
        <FlightDetailsScreen
          navigation={mockNavigation as any}
          route={mockRoute as any}
        />
      </NavigationContainer>,
    );

    expect(mockSelectFlightById).toHaveBeenCalledWith("123");
    expect(mockFetchFlightById).toHaveBeenCalledWith("123");
    expect(getByText("WY123")).toBeTruthy();
    expect(getByText("MCT-DXB")).toBeTruthy();
  });
});
