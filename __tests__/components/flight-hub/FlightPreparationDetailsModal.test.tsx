import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { FlightPreparationDetailsModal } from "../../../src/components/flight-hub/FlightPreparationDetailsModal";
import { useFlightPreparationStore } from "../../../src/store/useFlightPreparationStore";
import { useConsumptionTrackingStore } from "../../../src/store/useConsumptionStore";
import { useDeliveryStore } from "../../../src/store/useDeliveryStore";
import { useAuthStore } from "../../../src/store/useAuthStore";

// Mock stores
jest.mock("../../../src/store/useFlightPreparationStore");
jest.mock("../../../src/store/useConsumptionStore");
jest.mock("../../../src/store/useDeliveryStore");
jest.mock("../../../src/store/useAuthStore");

// Mock icons
jest.mock("../../../src/assets/icons", () => ({
  ImageIcon: () => null,
}));

// Mock sub-components as null or simple views
jest.mock("../../../src/components/flight-hub/StatusRow", () => ({ StatusRow: () => null }));
jest.mock("../../../src/components/flight-hub/CartVisulaizer", () => ({ CartVisualizer: () => null }));
jest.mock("../../../src/components/flight-hub/ContainerVisualizer", () => ({ ContainerVisualizer: () => null }));
jest.mock("../../../src/components/flight-hub/OvenVisualizer", () => ({ OvenVisualizer: () => null }));
jest.mock("../../../src/components/preparation/ConsumptionTrackingModal", () => ({ ConsumptionModal: () => null }));
jest.mock("../../../src/components/preparation/LockNumberModal", () => ({ LockNumberModal: () => null }));
jest.mock("../../../src/components/preparation/SealNumberModal", () => ({ SealNumberModal: () => null }));
jest.mock("../../../src/components/common/ConfirmationModal", () => ({ ConfirmationModal: () => null }));
jest.mock("../../../src/components/flight-hub/SharedComponents", () => ({ SignatureModal: () => null }));

describe("FlightPreparationDetailsModal", () => {
  const mockFetchPreparationById = jest.fn();
  const mockFetchConsumptionRecords = jest.fn();
  const mockFetchDeliveries = jest.fn();

  beforeEach(() => {
    (useFlightPreparationStore as unknown as jest.Mock).mockReturnValue({
      preparations: [],
      preparationDetail: {
        id: "p1",
        name: "Test Prep",
        equipment: "Atlas Tray",
        aircraftConfigGalleyPosition: { galleyPosition: "G1" },
        packingStandard: { items: [], containers: [] }
      },
      fetchPreparationById: mockFetchPreparationById,
      isPrepLoading: false,
      isUpdating: false,
    });
    (useConsumptionTrackingStore as unknown as jest.Mock).mockReturnValue({
      records: [],
      fetchConsumptionRecords: mockFetchConsumptionRecords,
    });
    (useDeliveryStore as unknown as jest.Mock).mockReturnValue({
      deliveries: [],
      fetchDeliveries: mockFetchDeliveries,
    });
    (useAuthStore as unknown as jest.Mock).mockReturnValue({ userId: "u1" });
    jest.clearAllMocks();
  });

  it("renders correctly and fetches data on mount", async () => {
    const { getByText } = render(
      <FlightPreparationDetailsModal
        visible={true}
        onClose={jest.fn()}
        flightId="f1"
        preparationId="p1"
        isLocked={false}
        isSealed={false}
        isPrepared={false}
        lockRequired={false}
        sealRequired={false}
      />
    );

    expect(mockFetchPreparationById).toHaveBeenCalledWith("f1", "p1");
    expect(mockFetchDeliveries).toHaveBeenCalledWith("f1");
    expect(getByText("Flight Preparation Plan Details")).toBeTruthy();
  });

  it("closes when close button is pressed", () => {
    const mockOnClose = jest.fn();
    const { getByText } = render(
      <FlightPreparationDetailsModal
        visible={true}
        onClose={mockOnClose}
        flightId="f1"
        preparationId="p1"
        isLocked={false}
        isSealed={false}
        isPrepared={false}
        lockRequired={false}
        sealRequired={false}
      />
    );

    fireEvent.press(getByText("✕"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
