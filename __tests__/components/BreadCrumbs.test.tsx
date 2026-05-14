import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import { BreadCrumb } from "../../src/components/common/BreadCrumbs";

// Mock useNavigation
const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockGoBack,
      canGoBack: mockCanGoBack,
    }),
  };
});

describe("BreadCrumb", () => {
  const items = [{ label: "Home", onPress: jest.fn() }, { label: "Settings" }];

  it("renders all labels correctly", () => {
    const { getByText } = render(
      <NavigationContainer>
        <BreadCrumb items={items} />
      </NavigationContainer>,
    );

    expect(getByText("Home")).toBeTruthy();
    expect(getByText("Settings")).toBeTruthy();
  });

  it("calls onBackPress when provided and back button is pressed", () => {
    const onBackPress = jest.fn();
    const { getByText } = render(
      <NavigationContainer>
        <BreadCrumb items={items} onBackPress={onBackPress} />
      </NavigationContainer>,
    );

    fireEvent.press(getByText("←"));
    expect(onBackPress).toHaveBeenCalledTimes(1);
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  it("calls navigation.goBack when back button is pressed and no onBackPress provided", () => {
    const { getByText } = render(
      <NavigationContainer>
        <BreadCrumb items={items} />
      </NavigationContainer>,
    );

    fireEvent.press(getByText("←"));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it("calls item.onPress when a breadcrumb item is clicked", () => {
    const { getByText } = render(
      <NavigationContainer>
        <BreadCrumb items={items} />
      </NavigationContainer>,
    );

    fireEvent.press(getByText("Home"));
    expect(items[0].onPress).toHaveBeenCalledTimes(1);
  });
});
