import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text, View } from "react-native";

import { ErrorBoundary } from "../../../src/components/common/ErrorBoundary";

jest.mock("../../../src/assets/icons", () => ({
  InfoIcon: "View",
}));

const CrashingComponent = () => {
  throw new Error("Intentional Test Crash");
};

describe("ErrorBoundary", () => {
  // Prevent console.error from cluttering the test output during intentional crashes
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it("renders children when there is no error", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Normal Content</Text>
      </ErrorBoundary>,
    );

    expect(getByText("Normal Content")).toBeTruthy();
  });

  it("renders fallback UI when a child crashes", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <CrashingComponent />
      </ErrorBoundary>,
    );

    expect(getByText("Oops! Something went wrong.")).toBeTruthy();
    expect(getByText("Intentional Test Crash")).toBeTruthy();
  });

  it("resets state when 'Try Again' is pressed", () => {
    const { getByText, queryByText, rerender } = render(
      <ErrorBoundary>
        <CrashingComponent />
      </ErrorBoundary>,
    );

    expect(getByText("Oops! Something went wrong.")).toBeTruthy();

    // Change children to something that doesn't crash
    rerender(
      <ErrorBoundary>
        <Text>Recovered Content</Text>
      </ErrorBoundary>,
    );

    // Now press Try Again to reset the error state
    fireEvent.press(getByText("Try Again"));

    expect(getByText("Recovered Content")).toBeTruthy();
    expect(queryByText("Oops! Something went wrong.")).toBeNull();
  });

  it("renders custom fallback if provided", () => {
    const CustomFallback = <Text>Custom Error UI</Text>;
    const { getByText } = render(
      <ErrorBoundary fallback={CustomFallback}>
        <CrashingComponent />
      </ErrorBoundary>,
    );

    expect(getByText("Custom Error UI")).toBeTruthy();
  });
});
