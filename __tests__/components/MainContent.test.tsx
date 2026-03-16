import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { MainContent } from "../../src/components/dashboard/MainContent";
import { useTimerStore } from "../../src/store/useTimerStore";

// Mock useTimerStore
jest.mock("../../src/store/useTimerStore");

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

  beforeEach(() => {
    (useTimerStore as unknown as jest.Mock).mockReturnValue({
      shiftState: "OFF",
      totalWorkingTimeToday: 0,
      currentSessionDuration: 0,
      startShift: mockStartShift,
      endShift: mockEndShift,
      pauseShift: mockPauseShift,
      resumeShift: mockResumeShift,
      syncTime: mockSyncTime,
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
      totalWorkingTimeToday: 3600,
      currentSessionDuration: 60,
      startShift: mockStartShift,
      endShift: mockEndShift,
      pauseShift: mockPauseShift,
      resumeShift: mockResumeShift,
      syncTime: mockSyncTime,
    });

    const { getByText } = render(<MainContent />);
    expect(getByText("Start a Break")).toBeTruthy();
    expect(getByText("End Shift")).toBeTruthy();
  });

  it("shows End Shift modal when End Shift is clicked", () => {
    (useTimerStore as unknown as jest.Mock).mockReturnValue({
      shiftState: "ON",
      totalWorkingTimeToday: 3600,
      currentSessionDuration: 60,
      startShift: mockStartShift,
      endShift: mockEndShift,
      pauseShift: mockPauseShift,
      resumeShift: mockResumeShift,
      syncTime: mockSyncTime,
    });

    const { getByText, queryByText } = render(<MainContent />);
    fireEvent.press(getByText("End Shift"));
    
    expect(getByText("End Shift?")).toBeTruthy();
    expect(getByText("Yes, End My Shift!")).toBeTruthy();
  });
});
