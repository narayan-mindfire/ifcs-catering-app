import React from "react";
import { render } from "@testing-library/react-native";
import FlightDetailsScreen from "../../src/screens/FlightDetailsScreen";
import { useFlightStore } from "../../src/store/useFlightStore";
import { NavigationContainer } from "@react-navigation/native";

// Mock useFlightStore
jest.mock("../../src/store/useFlightStore");

// Mock sub-components
jest.mock("../../src/components/common/BreadCrumbs", () => ({
  BreadCrumb: () => null,
}));

// Mock tab components
jest.mock("../../src/screens/details/Preparations", () => ({
  PreparationsScreen: "PreparationsScreen",
}));
jest.mock("../../src/screens/details/Deliveries", () => "DeliveriesScreen");

describe("FlightDetailsScreen", () => {
  const mockSelectFlightById = jest.fn();

  beforeEach(() => {
    (useFlightStore as unknown as jest.Mock).mockReturnValue(mockSelectFlightById);
    jest.clearAllMocks();
  });

  const mockNavigation = {
    navigate: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
    emit: jest.fn(() => ({ defaultPrevented: false })),
  };

  const mockRoute = {
    params: {
      flightId: "123",
      flightNumber: "WY123",
      route: "MCT-DXB",
      date: "2024-03-16",
    },
  };

  it("renders correctly and selects flight on mount", () => {
    const { getByText } = render(
      <NavigationContainer>
        <FlightDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </NavigationContainer>
    );

    expect(mockSelectFlightById).toHaveBeenCalledWith("123");
    expect(getByText("WY123")).toBeTruthy();
    expect(getByText("MCT-DXB")).toBeTruthy();
  });
});
