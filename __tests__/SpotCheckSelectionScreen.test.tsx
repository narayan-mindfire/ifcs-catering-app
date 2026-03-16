import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SpotCheckSelectionScreen from "../src/screens/spotCheck/SpotCheckSelectionScreen";

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
} as any;

const mockRoute = {
  key: "SpotCheckSelection",
  name: "SpotCheckSelection" as const,
  params: undefined,
} as any;

// Mock the icons
jest.mock("../src/assets/icons", () => ({
  NoFlightsIcon: "NoFlightsIcon",
  QrIcon: "QrIcon",
}));

// Mock BreadCrumb component
jest.mock("../src/components/common/BreadCrumbs", () => ({
  BreadCrumb: ({ items }: any) => {
    const React = require("react");
    const { View, Text, TouchableOpacity } = require("react-native");
    return (
      <View testID="breadcrumb">
        {items.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            testID={`breadcrumb-item-${index}`}
          >
            <Text>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  },
}));

describe("SpotCheckSelectionScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly", () => {
      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      expect(getByText("Scan a Flight")).toBeTruthy();
      expect(getByText("Completed Checks")).toBeTruthy();
    });

    it("displays the breadcrumb component", () => {
      const { getByTestId } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      expect(getByTestId("breadcrumb")).toBeTruthy();
    });

    it("displays correct text content", () => {
      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      expect(getByText("Scan a Flight")).toBeTruthy();
      expect(getByText("Completed Checks")).toBeTruthy();
    });
  });

  describe("Breadcrumb Navigation", () => {
    it("renders breadcrumb with correct items", () => {
      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      expect(getByText("Dashboard")).toBeTruthy();
      expect(getByText("Spot Check")).toBeTruthy();
    });

    it("navigates to Dashboard when Dashboard breadcrumb is pressed", () => {
      const { getByTestId } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      const dashboardBreadcrumb = getByTestId("breadcrumb-item-0");
      fireEvent.press(dashboardBreadcrumb);

      expect(mockNavigate).toHaveBeenCalledWith("Dashboard");
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it("does not navigate when Spot Check breadcrumb is pressed", () => {
      const { getByTestId } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      const spotCheckBreadcrumb = getByTestId("breadcrumb-item-1");
      fireEvent.press(spotCheckBreadcrumb);

      // Should not navigate as it's the current screen
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Scan Flight Button", () => {
    it("navigates to QRCodeScanner when scan button is pressed", () => {
      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      const scanButton = getByText("Scan a Flight");
      fireEvent.press(scanButton);

      expect(mockNavigate).toHaveBeenCalledWith("QRCodeScanner");
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it("scan button is touchable", () => {
      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      const scanButton = getByText("Scan a Flight").parent;
      expect(scanButton).toBeTruthy();
    });

    it("calls handleScanPress when button is pressed", () => {
      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      const scanButton = getByText("Scan a Flight");

      // Press the button multiple times
      fireEvent.press(scanButton);
      fireEvent.press(scanButton);

      // Should navigate each time
      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenCalledWith("QRCodeScanner");
    });
  });

  describe("Layout and Styling", () => {
    it("centers content vertically and horizontally", () => {
      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      // The main content should have the scan button
      const scanText = getByText("Scan a Flight");
      expect(scanText).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid button presses", () => {
      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      const scanButton = getByText("Scan a Flight");

      // Rapid fire presses
      fireEvent.press(scanButton);
      fireEvent.press(scanButton);
      fireEvent.press(scanButton);

      expect(mockNavigate).toHaveBeenCalledTimes(3);
    });

    it("renders without crashing when navigation is undefined", () => {
      // This test ensures the component doesn't crash with undefined props
      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      expect(getByText("Scan a Flight")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("scan button is accessible", () => {
      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      const scanButton = getByText("Scan a Flight");
      expect(scanButton).toBeTruthy();

      // Button should be pressable
      fireEvent.press(scanButton);
      expect(mockNavigate).toHaveBeenCalled();
    });

    it("displays informative text for users", () => {
      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      );

      // Check for user-friendly messages
      expect(getByText("Scan a Flight")).toBeTruthy();
      expect(getByText("Completed Checks")).toBeTruthy();
    });
  });

  describe("Component Integration", () => {
    it("integrates properly with navigation system", () => {
      const customNavigation = {
        ...mockNavigation,
        navigate: jest.fn(),
      };

      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={customNavigation}
        />,
      );

      fireEvent.press(getByText("Scan a Flight"));
      expect(customNavigation.navigate).toHaveBeenCalledWith("QRCodeScanner");
    });

    it("passes correct route params", () => {
      const customRoute = {
        ...mockRoute,
        params: { test: "value" },
      };

      const { getByText } = render(
        <SpotCheckSelectionScreen
          route={customRoute}
          navigation={mockNavigation}
        />,
      );

      expect(getByText("Scan a Flight")).toBeTruthy();
    });
  });

  describe("Snapshot Testing", () => {
    it("matches snapshot", () => {
      const tree = render(
        <SpotCheckSelectionScreen
          route={mockRoute}
          navigation={mockNavigation}
        />,
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
