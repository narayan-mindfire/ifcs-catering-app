import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { MainContent } from "../../src/components/dashboard/MainContent";
import { useTimerStore } from "../../src/store/useTimerStore";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useTaskStore } from "../../src/store/useTaskStore";
import { useRoute } from "@react-navigation/native";

// Mock useTimerStore
jest.mock("../../src/store/useTimerStore");
// Mock useAuthStore
jest.mock("../../src/store/useAuthStore");
// Mock useTaskStore
jest.mock("../../src/store/useTaskStore");
// Mock useRoute
jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(),
}));

// Mock icons
jest.mock("../../src/assets/icons", () => ({
  RedirectDarkIcon: "RedirectDarkIcon",
}));

// Mock DateTimePicker
jest.mock("@react-native-community/datetimepicker", () => "DateTimePicker");

describe("MainContent", () => {
  const mockStartShift = jest.fn();
  const mockEndShift = jest.fn();
  const mockPauseShift = jest.fn();
  const mockResumeShift = jest.fn();
  const mockSyncTime = jest.fn();
  const mockFetchTasks = jest.fn();
  const mockFetchStatus = jest.fn();
  const mockFetchHistory = jest.fn();

  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {},
    });
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: "user-123" },
    });
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      tasks: [],
      fetchTasks: mockFetchTasks,
    });
    (useTimerStore as unknown as jest.Mock).mockReturnValue({
      shiftState: "OFF",
      totalWorkedMs: 0,
      totalBreakMs: 0,
      currentSessionDuration: 0,
      currentBreakSessionDuration: 0,
      startShift: mockStartShift,
      endShift: mockEndShift,
      pauseShift: mockPauseShift,
      resumeShift: mockResumeShift,
      syncTime: mockSyncTime,
      fetchStatus: mockFetchStatus,
      fetchHistory: mockFetchHistory,
    });
    jest.clearAllMocks();
  });

  it("renders correctly in OFF state", () => {
    const { getByText } = render(<MainContent />);
    expect(getByText("Start Shift")).toBeTruthy();
    expect(getByText("My Tasks")).toBeTruthy();
  });

  it("renders correctly in ON state", () => {
    (useTimerStore as unknown as jest.Mock).mockReturnValue({
      shiftState: "ON",
      totalWorkedMs: 3600000,
      totalBreakMs: 0,
      currentSessionDuration: 60,
      currentBreakSessionDuration: 0,
      startShift: mockStartShift,
      endShift: mockEndShift,
      pauseShift: mockPauseShift,
      resumeShift: mockResumeShift,
      syncTime: mockSyncTime,
      fetchStatus: mockFetchStatus,
      fetchHistory: mockFetchHistory,
    });

    const { getByText } = render(<MainContent />);
    expect(getByText("Start a Break")).toBeTruthy();
    expect(getByText("End Shift")).toBeTruthy();
  });

  it("shows End Shift modal when End Shift is clicked", () => {
    (useTimerStore as unknown as jest.Mock).mockReturnValue({
      shiftState: "ON",
      totalWorkedMs: 3600000,
      totalBreakMs: 0,
      currentSessionDuration: 60,
      currentBreakSessionDuration: 0,
      startShift: mockStartShift,
      endShift: mockEndShift,
      pauseShift: mockPauseShift,
      resumeShift: mockResumeShift,
      syncTime: mockSyncTime,
      fetchStatus: mockFetchStatus,
      fetchHistory: mockFetchHistory,
    });

    const { getByText, queryByText } = render(<MainContent />);
    fireEvent.press(getByText("End Shift"));
    
    expect(getByText("End Shift?")).toBeTruthy();
    expect(getByText("Yes, End My Shift!")).toBeTruthy();
  });
});
