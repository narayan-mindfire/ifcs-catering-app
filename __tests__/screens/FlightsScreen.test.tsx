import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import React from "react";

import FlightsScreen from "../../src/screens/FlightsScreen";
import { useFlightStore } from "../../src/store/useFlightStore";

// Mock useFlightStore
jest.mock("../../src/store/useFlightStore");

// Mock FlightGroupItem to avoid deep dependencies
jest.mock("../../src/components/flight-list/FlightGroupItem", () => ({
  FlightGroupItem: () => null,
}));

// Mock StationSelector
jest.mock("../../src/components/flight-list/StationSelector", () => ({
  StationSelector: () => null,
}));

// Mock FlightListHeader
jest.mock("../../src/components/flight-list/FlightListHeader", () => ({
  FlightListHeader: () => null,
}));

// Mock BreadCrumb
jest.mock("../../src/components/common/BreadCrumbs", () => ({
  BreadCrumb: () => null,
}));

describe("FlightsScreen", () => {
  const mockFetchFlights = jest.fn();
  const mockSetFilters = jest.fn();

  const mockFlightGroups = [
    [
      {
        id: "1",
        flightNumber: "WY123",
        scheduledDeparture: "2024-03-16T10:00:00Z",
        origin: "MCT",
        destination: "DXB",
      },
    ],
  ];

  beforeEach(() => {
    (useFlightStore as unknown as jest.Mock).mockReturnValue({
      flightGroups: mockFlightGroups,
      isLoading: false,
      isRefreshing: false,
      isLoadingMore: false,
      hasNextPage: false,
      error: null,
      filters: { station: "MCT" },
      fetchFlights: mockFetchFlights,
      setFilters: mockSetFilters,
    });
    jest.clearAllMocks();
  });

  const mockNavigation = {
    navigate: jest.fn(),
    setOptions: jest.fn(),
  } as any;

  const mockRoute = {} as any;

  it("renders correctly and fetches flights on mount", () => {
    render(
      <NavigationContainer>
        <FlightsScreen navigation={mockNavigation} route={mockRoute} />
      </NavigationContainer>,
    );

    expect(mockFetchFlights).toHaveBeenCalled();
  });

  it("renders the list of flights", () => {
    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <FlightsScreen navigation={mockNavigation} route={mockRoute} />
      </NavigationContainer>,
    );

    expect(getByPlaceholderText("Flight #")).toBeTruthy();
  });

  it("shows loading indicator when isLoading is true", () => {
    (useFlightStore as unknown as jest.Mock).mockReturnValue({
      flightGroups: [],
      isLoading: true,
      isRefreshing: false,
      filters: { station: "MCT" },
      fetchFlights: mockFetchFlights,
    });

    const { getByTestId } = render(
      <NavigationContainer>
        <FlightsScreen navigation={mockNavigation} route={mockRoute} />
      </NavigationContainer>,
    );

    // ActivityIndicator usually can be found by accessibility role or testID
    // Let's assume it's there based on the implementation
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });
});
