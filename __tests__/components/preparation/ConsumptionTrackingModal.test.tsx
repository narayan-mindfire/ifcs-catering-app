import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import { ConsumptionModal } from "../../../src/components/preparation/ConsumptionTrackingModal";
import { useConsumptionTrackingStore } from "../../../src/store/useConsumptionStore";

jest.mock("../../../src/store/useConsumptionStore");
jest.mock("../../../src/assets/icons", () => ({
  ImageIcon: () => null,
}));
jest.mock("../../../src/utils/logger");
jest.mock("../../../src/components/common/AppButton", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    AppButton: (props: any) => (
      <TouchableOpacity
        testID={`button-${props.title}`}
        onPress={props.onPress}
        disabled={props.disabled}
      >
        <Text>{props.title}</Text>
      </TouchableOpacity>
    ),
  };
});

describe("ConsumptionModal", () => {
  const mockItem = {
    id: "item1",
    name: "Standard Meal",
    quantity: 10,
    picture: null,
    isDynamic: false,
  };

  const mockLocation = {
    galley: "G1",
    stowage: "S1",
    carrier: "C1",
  };

  const mockCreateRecord = jest.fn();
  const mockUpdateRecord = jest.fn();

  beforeEach(() => {
    (useConsumptionTrackingStore as unknown as jest.Mock).mockReturnValue({
      createConsumptionRecord: mockCreateRecord,
      updateConsumptionRecord: mockUpdateRecord,
      isCreating: false,
      isUpdating: false,
    });
    jest.clearAllMocks();
  });

  it("renders correctly when visible", () => {
    const { getByText, getByPlaceholderText } = render(
      <ConsumptionModal
        visible={true}
        onClose={jest.fn()}
        item={mockItem as any}
        flightId="f1"
        preparationId="p1"
        locationInfo={mockLocation}
      />,
    );

    expect(getByText("Standard Meal")).toBeTruthy();
    expect(getByText("10")).toBeTruthy(); // Total Qty
    expect(getByPlaceholderText("#")).toBeTruthy();
  });

  it("validates input and prevents saving if quantity exceeds total", async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <ConsumptionModal
        visible={true}
        onClose={jest.fn()}
        item={mockItem as any}
        flightId="f1"
        preparationId="p1"
        locationInfo={mockLocation}
      />,
    );

    const input = getByPlaceholderText("#");
    fireEvent.changeText(input, "15");

    expect(getByText("Max: 10")).toBeTruthy();

    const saveButton = getByTestId("button-Confirm");
    expect(
      saveButton.props.disabled ||
        saveButton.props.accessibilityState?.disabled,
    ).toBe(true);
  });

  // it("calls createConsumptionRecord on save", async () => {
  //   mockCreateRecord.mockResolvedValue({ success: true });

  //   const { getByPlaceholderText, getByText, getByTestId } = render(
  //     <ConsumptionModal
  //       visible={true}
  //       onClose={jest.fn()}
  //       item={mockItem as any}
  //       flightId="f1"
  //       preparationId="p1"
  //       locationInfo={mockLocation}
  //     />,
  //   );

  //   const input = getByPlaceholderText("#");
  //   fireEvent.changeText(input, "5");

  //   const saveButton = getByTestId("button-Confirm");
  //   fireEvent.press(saveButton);

  //   await waitFor(() => {
  //     expect(mockCreateRecord).toHaveBeenCalledWith(
  //       "f1",
  //       expect.objectContaining({
  //         returnedQty: 5,
  //         consumedQty: 5,
  //       }),
  //     );
  //   });
  // });

  it("calls updateConsumptionRecord on save when existingRecord is provided", async () => {
    mockUpdateRecord.mockResolvedValue(true);

    const mockExistingRecord = {
      id: "rec1",
      returnedQty: 3,
      consumedQty: 7,
      qty: 10,
    };

    const { getByPlaceholderText, getByTestId } = render(
      <ConsumptionModal
        visible={true}
        onClose={jest.fn()}
        item={mockItem as any}
        existingRecord={mockExistingRecord as any}
        flightId="f1"
        preparationId="p1"
        locationInfo={mockLocation}
      />,
    );

    const input = getByPlaceholderText("#");
    fireEvent.changeText(input, "4");

    const updateButton = getByTestId("button-Update");
    fireEvent.press(updateButton);

    await waitFor(() => {
      expect(mockUpdateRecord).toHaveBeenCalledWith(
        "f1",
        "rec1",
        expect.objectContaining({
          returnedQty: 4,
          consumedQty: 6,
        }),
      );
    });
  });
});
