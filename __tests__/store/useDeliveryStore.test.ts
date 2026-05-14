import { deliveryService } from "../../src/services/deliveryService";
import { useDeliveryStore } from "../../src/store/useDeliveryStore";
import { Delivery } from "../../src/types/deliveries";

jest.mock("../../src/services/deliveryService");

describe("useDeliveryStore", () => {
  const mockDelivery: Delivery = {
    id: "del-123",
    name: "Standard Delivery",
    flightId: "flight-456",
    status: "pending",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    signatures: [],
  };

  beforeEach(() => {
    useDeliveryStore.setState({
      deliveries: [],
      selectedDeliveryId: null,
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  it("has correct initial state", () => {
    const state = useDeliveryStore.getState();
    expect(state.deliveries).toEqual([]);
    expect(state.selectedDeliveryId).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("successfully fetches deliveries", async () => {
    const mockDeliveries = [mockDelivery];
    (deliveryService.getDeliveries as jest.Mock).mockResolvedValue(
      mockDeliveries,
    );

    await useDeliveryStore.getState().fetchDeliveries("flight-456");

    const state = useDeliveryStore.getState();
    expect(state.deliveries).toEqual(mockDeliveries);
    expect(state.selectedDeliveryId).toBe(mockDelivery.id);
    expect(state.isLoading).toBe(false);
    expect(deliveryService.getDeliveries).toHaveBeenCalledWith(
      "flight-456",
      undefined,
    );
  });

  it("handles fetch error", async () => {
    (deliveryService.getDeliveries as jest.Mock).mockRejectedValue(
      new Error("API Error"),
    );

    await useDeliveryStore.getState().fetchDeliveries("flight-456");

    const state = useDeliveryStore.getState();
    expect(state.error).toBe("Failed to fetch deliveries");
    expect(state.isLoading).toBe(false);
    expect(state.deliveries).toEqual([]);
  });

  it("successfully creates a delivery", async () => {
    (deliveryService.createDelivery as jest.Mock).mockResolvedValue(
      mockDelivery,
    );

    await useDeliveryStore
      .getState()
      .createDelivery("flight-456", "New Delivery");

    const state = useDeliveryStore.getState();
    expect(state.deliveries).toContainEqual(mockDelivery);
    expect(state.selectedDeliveryId).toBe(mockDelivery.id);
    expect(deliveryService.createDelivery).toHaveBeenCalledWith(
      "flight-456",
      "New Delivery",
    );
  });

  it("selects a delivery", () => {
    useDeliveryStore.setState({ deliveries: [mockDelivery] });
    useDeliveryStore.getState().selectDelivery(mockDelivery.id);
    expect(useDeliveryStore.getState().selectedDeliveryId).toBe(
      mockDelivery.id,
    );
  });

  it("successfully adds a signature", async () => {
    const updatedDelivery = { ...mockDelivery, status: "signed" };
    (deliveryService.addSignature as jest.Mock).mockResolvedValue(
      updatedDelivery,
    );
    useDeliveryStore.setState({ deliveries: [mockDelivery] });

    await useDeliveryStore
      .getState()
      .addSignature("flight-456", "del-123", "driver", "sig-data");

    const state = useDeliveryStore.getState();
    expect(state.deliveries[0].status).toBe("signed");
    expect(deliveryService.addSignature).toHaveBeenCalledWith(
      "flight-456",
      "del-123",
      "driver",
      "sig-data",
      undefined,
    );
  });

  it("successfully deletes a delivery", async () => {
    useDeliveryStore.setState({
      deliveries: [mockDelivery],
      selectedDeliveryId: mockDelivery.id,
    });
    (deliveryService.deleteDelivery as jest.Mock).mockResolvedValue(undefined);

    await useDeliveryStore.getState().deleteDelivery("flight-456", "del-123");

    const state = useDeliveryStore.getState();
    expect(state.deliveries).toEqual([]);
    expect(state.selectedDeliveryId).toBeNull();
    expect(deliveryService.deleteDelivery).toHaveBeenCalledWith(
      "flight-456",
      "del-123",
    );
  });
});
