import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import { ConfirmationModal } from "../../src/components/common/ConfirmationModal";

describe("ConfirmationModal", () => {
  const defaultProps = {
    isOpen: true,
    title: "Test Title",
    message: "Test Message",
    actionType: "enable" as const,
    onConfirm: jest.fn(),
    onClose: jest.fn(),
  };

  it("renders correctly when open", () => {
    const { getByText } = render(<ConfirmationModal {...defaultProps} />);

    expect(getByText("Test Title")).toBeTruthy();
    expect(getByText("Test Message")).toBeTruthy();
    expect(getByText("Confirm")).toBeTruthy();
    expect(getByText("Cancel")).toBeTruthy();
  });

  it("does not render when not open", () => {
    // React Native Modal might still "render" its children in some environments,
    // but the 'visible' prop controls its visibility.
    // However, the test library query will find it if it's in the tree.
    // Let's check how it's implemented.
    const { queryByText } = render(
      <ConfirmationModal {...defaultProps} isOpen={false} />,
    );

    // In many RN testing setups, the Modal children are not in the tree if visible=false
    expect(queryByText("Test Title")).toBeNull();
  });

  it("calls onConfirm when confirm button is pressed", () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      <ConfirmationModal {...defaultProps} onConfirm={onConfirm} />,
    );

    fireEvent.press(getByText("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel button is pressed", () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <ConfirmationModal {...defaultProps} onClose={onClose} />,
    );

    fireEvent.press(getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders 'Disable' when actionType is disable", () => {
    const { getByText } = render(
      <ConfirmationModal {...defaultProps} actionType="disable" />,
    );

    expect(getByText("Disable")).toBeTruthy();
  });
});
