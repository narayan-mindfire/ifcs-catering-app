import { flightPreparationService } from "../../src/services/flightPreparationService";
import { useFlightPreparationStore } from "../../src/store/useFlightPreparationStore";
import { PreparationItem, Truck } from "../../src/types/preparations";

jest.mock("../../src/services/flightPreparationService");

describe("useFlightPreparationStore", () => {
  const mockPreparation: PreparationItem = {
    id: "prep-123",
    name: "Prep 1",
    status: "pending",
    isSealRequired: true,
    isLockRequired: false,
    isTrackConsumption: true,
  } as any;

  const mockTruck: Truck = {
    id: "truck-123",
    truckNo: "T123",
  } as any;

  beforeEach(() => {
    useFlightPreparationStore.setState({
      preparations: [],
      trucks: [],
      preparationDetail: null,
      userSignatures: [],
      isLoading: false,
      isPrepLoading: false,
      isUpdating: false,
      error: null,
      isPrinting: false,
    });
    jest.clearAllMocks();
  });

  it("has correct initial state", () => {
    const state = useFlightPreparationStore.getState();
    expect(state.preparations).toEqual([]);
    expect(state.trucks).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it("successfully fetches preparations", async () => {
    (flightPreparationService.getPreparations as jest.Mock).mockResolvedValue({
      preparations: [mockPreparation],
      trucks: [mockTruck],
    });

    await useFlightPreparationStore.getState().fetchPreparations("flight-456");

    const state = useFlightPreparationStore.getState();
    expect(state.preparations).toEqual([mockPreparation]);
    expect(state.trucks).toEqual([mockTruck]);
    expect(state.isLoading).toBe(false);
  });

  it("handles fetch preparations error", async () => {
    (flightPreparationService.getPreparations as jest.Mock).mockRejectedValue(new Error("Network error"));

    await useFlightPreparationStore.getState().fetchPreparations("flight-456");

    const state = useFlightPreparationStore.getState();
    expect(state.error).toBe("Network error");
    expect(state.isLoading).toBe(false);
  });

  it("successfully updates preparation flag", async () => {
    const updatedItem = { id: "prep-123", status: "completed" };
    (flightPreparationService.updatePreparationFlag as jest.Mock).mockResolvedValue(updatedItem);
    useFlightPreparationStore.setState({ preparations: [mockPreparation] });

    const success = await useFlightPreparationStore.getState().updatePreparationFlag(
      "flight-456",
      "prep-123",
      { status: "completed" } as any
    );

    const state = useFlightPreparationStore.getState();
    expect(success).toBe(true);
    expect(state.preparations[0].status).toBe("completed");
  });

  it("successfully checks user signature", async () => {
    const mockSignatures = [{ id: "sig-1", signature: "data" }];
    (flightPreparationService.getUserSignatures as jest.Mock).mockResolvedValue(mockSignatures);

    const hasSignature = await useFlightPreparationStore.getState().checkUserSignature("flight-456", "del-123");

    expect(hasSignature).toBe(true);
    expect(useFlightPreparationStore.getState().userSignatures).toEqual(mockSignatures);
  });

  it("successfully deletes user signature", async () => {
    useFlightPreparationStore.setState({ userSignatures: [{ id: "sig-1" } as any] });
    (flightPreparationService.deleteUserSignature as jest.Mock).mockResolvedValue(undefined);

    const success = await useFlightPreparationStore.getState().deleteUserSignature("flight-456", "sig-1");

    expect(success).toBe(true);
    expect(useFlightPreparationStore.getState().userSignatures).toEqual([]);
  });

  it("clears preparation detail", () => {
    useFlightPreparationStore.setState({ preparationDetail: {} as any });
    useFlightPreparationStore.getState().clearPreparationDetail();
    expect(useFlightPreparationStore.getState().preparationDetail).toBeNull();
  });
});
