import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import { ValidationModal } from "../../../src/components/preparation/ValidationModal";

jest.mock("../../../src/assets/icons", () => ({
  InfoIcon: () => null,
}));

describe("ValidationModal", () => {
  it("renders correctly with message when visible", () => {
    const { getByText } = render(
      <ValidationModal
        visible={true}
        message="Please seal first"
        onClose={jest.fn()}
      />,
    );

    expect(getByText("Please seal first")).toBeTruthy();
    expect(getByText("Action Required")).toBeTruthy();
  });

  it("calls onClose when OK is pressed", () => {
    const mockOnClose = jest.fn();
    const { getByText } = render(
      <ValidationModal visible={true} message="Test" onClose={mockOnClose} />,
    );

    fireEvent.press(getByText("OK"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
