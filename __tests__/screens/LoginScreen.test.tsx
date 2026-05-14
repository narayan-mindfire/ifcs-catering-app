import { render, waitFor } from "@testing-library/react-native";
import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import React from "react";
import { Alert } from "react-native";

import LoginScreen from "../../src/screens/Auth/LoginScreen";
import { useAuthStore } from "../../src/store/useAuthStore";

// Mock dependencies
jest.mock("expo-auth-session");
jest.mock("expo-crypto");
jest.mock("../../src/store/useAuthStore");
jest.spyOn(Alert, "alert");

jest.mock("../../src/assets/icons", () => ({
  MicrosoftLogo: "View",
  ImageIcon: "View",
}));

// Polyfill atob for Jest environment if missing
if (typeof global.atob === "undefined") {
  global.atob = (str: string) => Buffer.from(str, "base64").toString("binary");
}

const mockLoginWithSSO = jest.fn().mockResolvedValue(undefined);

(useAuthStore as unknown as jest.Mock).mockReturnValue({
  login: jest.fn(),
  loginWithSSO: mockLoginWithSSO,
  isLoading: false,
});

describe("LoginScreen Nonce Verification", () => {
  const mockNonce = "test-nonce-123456";

  beforeEach(() => {
    jest.clearAllMocks();
    (Crypto.randomUUID as jest.Mock).mockReturnValue(mockNonce);
    (AuthSession.useAutoDiscovery as jest.Mock).mockReturnValue({});
  });

  const createMockIdToken = (payload: object) => {
    const header = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" }),
    ).toString("base64");
    const body = Buffer.from(JSON.stringify(payload))
      .toString("base64")
      .replace(/=/g, ""); // Remove padding for base64url-like
    return `${header}.${body}.signature`;
  };

  it("calls loginWithSSO when nonces match", async () => {
    const idToken = createMockIdToken({ nonce: mockNonce });

    (AuthSession.useAuthRequest as jest.Mock).mockReturnValue([
      {}, // request
      { type: "success", params: { id_token: idToken } }, // response
      jest.fn(), // promptAsync
    ]);

    render(<LoginScreen />);

    // The useEffect should trigger automatically on mount because of the mocked response
    await waitFor(() => {
      expect(mockLoginWithSSO).toHaveBeenCalledWith(idToken);
    });
    expect(Alert.alert).not.toHaveBeenCalledWith(
      "Security Error",
      expect.anything(),
    );
  });

  it("shows error alert and does not call loginWithSSO when nonces mismatch", async () => {
    const idToken = createMockIdToken({ nonce: "malicious-nonce" });

    (AuthSession.useAuthRequest as jest.Mock).mockReturnValue([
      {},
      { type: "success", params: { id_token: idToken } },
      jest.fn(),
    ]);

    render(<LoginScreen />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Security Error",
        expect.stringContaining("Nonce mismatch"),
      );
    });
    expect(mockLoginWithSSO).not.toHaveBeenCalled();
  });

  it("handles missing id_token gracefully (if auth-session returns code instead)", async () => {
    (AuthSession.useAuthRequest as jest.Mock).mockReturnValue([
      {},
      { type: "success", params: { code: "some-auth-code" } },
      jest.fn(),
    ]);

    render(<LoginScreen />);

    await waitFor(() => {
      expect(mockLoginWithSSO).toHaveBeenCalledWith("some-auth-code");
    });
  });
});
