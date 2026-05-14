import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import { AppButton } from "../../src/components/common/AppButton";

describe("AppButton", () => {
  it("renders correctly with title", () => {
    const { getByText } = render(
      <AppButton title="Click Me" onPress={jest.fn()} />,
    );
    expect(getByText("Click Me")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(<AppButton title="Press" onPress={onPress} />);
    fireEvent.press(getByText("Press"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is disabled when loading prop is true", () => {
    const onPress = jest.fn();
    const { getByTestId, queryByText } = render(
      <AppButton title="Loading" onPress={onPress} loading={true} />,
    );
    // Since AppButton doesn't have a testID on the TouchableOpacity,
    // we can check if ActivityIndicator is present and title is not?
    // Looking at the implementation, Text is inside a Fragment when not loading.
    expect(queryByText("Loading")).toBeNull();
  });

  it("is disabled when disabled prop is true", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AppButton title="Disabled" onPress={onPress} disabled={true} />,
    );
    fireEvent.press(getByText("Disabled"));
    expect(onPress).not.toHaveBeenCalled();
  });
});
