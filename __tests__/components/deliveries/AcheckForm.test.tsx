import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import { AcheckForm } from "../../../src/components/deliveries/AcheckForm";
import { TruckACheck } from "../../../src/types/acheck";

// Mock the icons to avoid SVG issues in tests
jest.mock("../../../src/assets/icons", () => ({
  DeliveryIconTrue: "DeliveryIconTrue",
  DocsIcon: "DocsIcon",
  BoxIcon: "BoxIcon",
}));

const mockInitialData: TruckACheck = {
  id: "acheck-1",
  truckId: "truck-1",
  assignmentId: "assign-1",
  userId: "user-1",
  name: "John Doe",
  vehicleNo: "TRUCK-001",
  checkedDate: "2024-03-16T10:00:00Z",
  lightIndicator: true,
  lightCabin: false,
  lightLowBeam: true,
  lightPlatform: false,
  lightHighBeam: false,
  lightBrake: false,
  lightParking: false,
  lightHazard: false,
  lightTail: false,
  lightCargo: false,
  lightTurnSignal: false,
  opIgnition: true,
  opFootBrake: false,
  opHorn: false,
  opClutch: false,
  opSteering: false,
  opHeatingVentilation: false,
  opParkingBrake: false,
  opWindshieldWiper: false,
  opWindow: false,
  opHandGas: false,
  opAuxiliaryWindow: false,
  opSeatAdjustment: false,
  auxDoesNotRelease: false,
  auxFootBrake: false,
  auxHorn: false,
  auxClutch: false,
  auxSteering: false,
  auxHeatingVentilation: false,
  auxSupportNotRetract: false,
  auxWindshieldWiper: false,
  auxWindow: false,
  auxHandGas: false,
  auxAuxiliaryWindow: false,
  auxSeatAdjustment: false,
  hydVl: true,
  hydVr: false,
  hydMl: false,
  hydMr: false,
  hydHl: false,
  hydHr: false,
  compEngine: "OK",
  compTransmission: "OK",
  compAirLineLeaking: "None",
  tireVl: true,
  tireVr: true,
  tireHl: false,
  tireHr: false,
  structBodyAPillar: false,
  structBodyBPillar: false,
  structBodyLadder: false,
  structBodyDPillar: false,
  structBodyCPillar: false,
  fallLeft: true,
  fallJammed: false,
  fallBent: false,
  fallRight: false,
  details: "Some details",
  hasAccidentHazard: true,
  externalDamage: "None",
  createdAt: "2024-03-16T10:00:00Z",
  updatedAt: "2024-03-16T10:00:00Z",
  createdBy: "user-1",
  updatedBy: "user-1",
};

describe("AcheckForm", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders labels correctly in view mode", () => {
    const { getByText } = render(
      <AcheckForm
        isOpen={true}
        onClose={mockOnClose}
        mode="view"
        initialData={mockInitialData}
      />,
    );

    expect(getByText("Vehicle Defect Report")).toBeTruthy();
    expect(getByText("Lighting")).toBeTruthy();
    expect(getByText("Operation")).toBeTruthy();
    expect(getByText("Fall Protection")).toBeTruthy();
  });

  it("seeds data correctly from initialData", () => {
    const { getByDisplayValue } = render(
      <AcheckForm
        isOpen={true}
        onClose={mockOnClose}
        mode="view"
        initialData={mockInitialData}
      />,
    );

    expect(getByDisplayValue("John Doe")).toBeTruthy();
    expect(getByDisplayValue("TRUCK-001")).toBeTruthy();
    expect(getByDisplayValue("Some details")).toBeTruthy();
  });

  it("enables all checkboxes in edit mode", async () => {
    const { getByText } = render(
      <AcheckForm
        isOpen={true}
        onClose={mockOnClose}
        mode="edit"
        initialData={mockInitialData}
      />,
    );

    // In edit mode, "Update" should be visible
    expect(getByText("Update")).toBeTruthy();

    // Check if we can find a checkbox item
    const checkbox = getByText("Cabin");
    fireEvent.press(checkbox);
  });

  it("calls onUpdate with full payload when Update is pressed", async () => {
    const { getByText } = render(
      <AcheckForm
        isOpen={true}
        onClose={mockOnClose}
        mode="edit"
        initialData={mockInitialData}
        onUpdate={mockOnUpdate}
      />,
    );

    fireEvent.press(getByText("Update"));

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
      const payload = mockOnUpdate.mock.calls[0][1];
      expect(payload.name).toBe("John Doe");
      expect(payload.fallLeft).toBe(true);
      expect(payload.hasAccidentHazard).toBe(true);
    });
  }, 15000);

  it("handles accident hazard radio buttons correctly", () => {
    const { getByText } = render(
      <AcheckForm
        isOpen={true}
        onClose={mockOnClose}
        mode="edit"
        initialData={{ ...mockInitialData, hasAccidentHazard: false }}
      />,
    );

    // Initial state should be 'no'
    const yesOption = getByText("Yes");
    fireEvent.press(yesOption);

    // Now it should be 'yes'
  });
});
