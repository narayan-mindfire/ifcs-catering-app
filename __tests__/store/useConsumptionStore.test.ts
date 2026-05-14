import { consumptionService } from "../../src/services/consumptionService";
import { useConsumptionTrackingStore } from "../../src/store/useConsumptionStore";
import { ConsumptionTrackingRecord } from "../../src/types/consumption";

jest.mock("../../src/services/consumptionService");

describe("useConsumptionTrackingStore", () => {
  const mockRecord: ConsumptionTrackingRecord = {
    id: "rec-123",
    flightId: "flight-456",
    itemCode: "ITEM-01",
    itemName: "Coffee",
    quantity: 10,
    unit: "cups",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    useConsumptionTrackingStore.getState().resetStore();
    jest.clearAllMocks();
  });

  it("has correct initial state", () => {
    const state = useConsumptionTrackingStore.getState();
    expect(state.records).toEqual([]);
    expect(state.selectedRecord).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("successfully fetches records", async () => {
    (consumptionService.getRecords as jest.Mock).mockResolvedValue({
      data: [mockRecord],
      total: 1,
    });

    const success = await useConsumptionTrackingStore
      .getState()
      .fetchConsumptionRecords("flight-456");

    const state = useConsumptionTrackingStore.getState();
    expect(success).toBe(true);
    expect(state.records).toEqual([mockRecord]);
    expect(state.total).toBe(1);
    expect(state.isLoading).toBe(false);
  });

  it("handles fetch records error", async () => {
    (consumptionService.getRecords as jest.Mock).mockRejectedValue(
      new Error("API Error"),
    );

    const success = await useConsumptionTrackingStore
      .getState()
      .fetchConsumptionRecords("flight-456");

    const state = useConsumptionTrackingStore.getState();
    expect(success).toBe(false);
    expect(state.error).toBe("API Error");
    expect(state.records).toEqual([]);
  });

  it("successfully creates a record", async () => {
    (consumptionService.createRecord as jest.Mock).mockResolvedValue(
      mockRecord,
    );

    const result = await useConsumptionTrackingStore
      .getState()
      .createConsumptionRecord("flight-456", {
        itemCode: "ITEM-01",
        quantity: 10,
      } as any);

    const state = useConsumptionTrackingStore.getState();
    expect(result.success).toBe(true);
    expect(result.record).toEqual(mockRecord);
    expect(state.records).toContainEqual(mockRecord);
    expect(state.total).toBe(1);
  });

  it("successfully updates a record", async () => {
    const updatedRecord = { ...mockRecord, quantity: 20 };
    (consumptionService.updateRecord as jest.Mock).mockResolvedValue(
      updatedRecord,
    );
    useConsumptionTrackingStore.setState({ records: [mockRecord] });

    const success = await useConsumptionTrackingStore
      .getState()
      .updateConsumptionRecord("flight-456", "rec-123", {
        quantity: 20,
      } as any);

    const state = useConsumptionTrackingStore.getState();
    expect(success).toBe(true);
    expect(state.records[0].quantity).toBe(20);
  });

  it("successfully deletes a record", async () => {
    useConsumptionTrackingStore.setState({ records: [mockRecord], total: 1 });
    (consumptionService.deleteRecord as jest.Mock).mockResolvedValue(true);

    const success = await useConsumptionTrackingStore
      .getState()
      .deleteConsumptionRecord("flight-456", "rec-123");

    const state = useConsumptionTrackingStore.getState();
    expect(success).toBe(true);
    expect(state.records).toEqual([]);
    expect(state.total).toBe(0);
  });

  it("clears error", () => {
    useConsumptionTrackingStore.setState({ error: "Some error" });
    useConsumptionTrackingStore.getState().clearError();
    expect(useConsumptionTrackingStore.getState().error).toBeNull();
  });
});
