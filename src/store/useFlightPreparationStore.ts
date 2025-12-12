import { create } from "zustand";
import apiClient from "../api/axiosClient";
import {
  PreparationItem,
  PreparationDetailData,
  PreparationFlagUpdatePayload,
  PrintData,
  AddUserSignaturePayload,
  AddUserSignatureResponse,
} from "../types/preparations";

// Define the shape based on your API response
export interface UserSignature {
  id: string;
  deliveryId: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userType: string;
  userOrganization: string;
  userBadgeNumber: string | null;
  signature: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface FlightPreparationState {
  preparations: PreparationItem[];
  preparationDetail: PreparationDetailData | null;
  userSignatures: UserSignature[]; // Added state to store the list

  isLoading: boolean;
  isPrinting: boolean;
  isPrepLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  fetchPreparations: (flightId: string) => Promise<void>;
  fetchPreparationById: (
    flightId: string,
    preparationId: string,
  ) => Promise<void>;
  updatePreparationFlag: (
    flightId: string,
    preparationId: string,
    payload: PreparationFlagUpdatePayload,
  ) => Promise<boolean>;
  printPreparation: (
    flightId: string,
  ) => Promise<{ success: boolean; fileUrl?: string; error?: string }>;
  clearPreparationDetail: () => void;

  // Signature methods
  checkUserSignature: (
    flightId: string,
    deliveryId: string,
    userId: string,
  ) => Promise<boolean>;
  addUserSignature: (
    flightId: string,
    deliveryId: string,
    userId: string,
    signature: string,
  ) => Promise<boolean>;
}

export const useFlightPreparationStore = create<FlightPreparationState>(
  (set, get) => ({
    preparations: [],
    preparationDetail: null,
    userSignatures: [], // Initialize empty
    isLoading: false,
    isPrepLoading: false,
    isUpdating: false,
    error: null,
    isPrinting: false,

    fetchPreparations: async (flightId: string) => {
      console.log("Fetching preparations for flight:", flightId);
      const callFlight =
        flightId === "a990a562-e77e-4461-82ad-bbcd003ae4b1"
          ? "eaedd455-3e21-4c74-8a78-24989b0e82a8"
          : flightId;
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.get<ApiResponse<PreparationItem[]>>(
          `/flights/${callFlight}/preparations`,
          {
            params: { includeContent: true },
          },
        );

        if (response.data.success) {
          set({
            preparations: response.data.data || [],
            isLoading: false,
          });
        } else {
          set({
            error: response.data.message || "Failed to fetch preparations",
            isLoading: false,
          });
        }
      } catch (err: any) {
        console.error("Fetch Preparations Error:", err);
        set({
          error:
            err.response?.data?.message ||
            "Network error fetching preparations",
          isLoading: false,
        });
      }
    },

    fetchPreparationById: async (flightId: string, preparationId: string) => {
      set({ isPrepLoading: true, error: null });
      const callFlight =
        flightId === "a990a562-e77e-4461-82ad-bbcd003ae4b1"
          ? "eaedd455-3e21-4c74-8a78-24989b0e82a8"
          : flightId;
      try {
        const response = await apiClient.get<
          ApiResponse<PreparationDetailData>
        >(`/flights/${callFlight}/preparations/${preparationId}`);
        if (response.data.success) {
          set({
            preparationDetail: response.data.data,
            isPrepLoading: false,
          });
        } else {
          set({
            error:
              response.data.message || "Failed to fetch preparation details",
            isPrepLoading: false,
          });
        }
      } catch (err: any) {
        console.error("Fetch Detail Error:", err);
        set({
          error:
            err.response?.data?.message || "Network error fetching details",
          isPrepLoading: false,
        });
      }
    },

    updatePreparationFlag: async (flightId, preparationId, payload) => {
      set({ isUpdating: true, error: null });
      const callFlight =
        flightId === "a990a562-e77e-4461-82ad-bbcd003ae4b1"
          ? "eaedd455-3e21-4c74-8a78-24989b0e82a8"
          : flightId;
      try {
        const response = await apiClient.patch<ApiResponse<PreparationItem>>(
          `/flights/${callFlight}/preparation-flags/${preparationId}`,
          payload,
        );

        if (response.data.success) {
          const updatedItem = response.data.data;
          set((state) => ({
            preparations: state.preparations.map((item) =>
              item.id === preparationId ? { ...item, ...updatedItem } : item,
            ),
            isUpdating: false,
          }));
          return true;
        } else {
          set({ isUpdating: false, error: response.data.message });
          return false;
        }
      } catch (err: any) {
        set({
          isUpdating: false,
          error: err.response?.data?.message || "Network error during update",
        });
        return false;
      }
    },

    printPreparation: async (flightId: string) => {
      const callFlight =
        flightId === "a990a562-e77e-4461-82ad-bbcd003ae4b1"
          ? "eaedd455-3e21-4c74-8a78-24989b0e82a8"
          : flightId;
      set({ isPrinting: true, error: null });
      try {
        const response = await apiClient.post<ApiResponse<PrintData>>(
          `/flights/${callFlight}/preparations/print`,
        );

        set({ isPrinting: false });

        if (response.data.success && response.data.data?.fileUrl) {
          return { success: true, fileUrl: response.data.data.fileUrl };
        } else {
          return {
            success: false,
            error: response.data.message || "Failed to generate print file",
          };
        }
      } catch (err: any) {
        set({
          error:
            err.response?.data?.message || "Network error generating print",
          isPrinting: false,
        });
        return { success: false, error: err.message };
      }
    },

    clearPreparationDetail: () => {
      set({ preparationDetail: null });
    },

    // Check if user has signature for this delivery AND update state
    checkUserSignature: async (
      flightId: string,
      deliveryId: string,
      userId: string,
    ): Promise<boolean> => {
      try {
        const callFlight =
          flightId === "a990a562-e77e-4461-82ad-bbcd003ae4b1"
            ? "eaedd455-3e21-4c74-8a78-24989b0e82a8"
            : flightId;
        console.log("flight id: ", callFlight);
        console.log("delivery id: ", deliveryId);
        console.log("user id: ", userId);

        const response = await apiClient.get<any>(
          `/flights/${callFlight}/deliveries/user/signatures`,
          {
            params: {
              // deliveryId, // Commented out per your request
              userId,
            },
          },
        );

        // Check success and update state with the array data
        if (response.data.success && response.data.data) {
          const dataArray = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data];
          console.log("User signature found, updating state:", dataArray);
          set({ userSignatures: dataArray });
          return true;
        }

        set({ userSignatures: [] });
        return false;
      } catch (err: any) {
        console.error("Check User Signature Error:", err);
        set({ userSignatures: [] });
        return false;
      }
    },

    // Add user signature
    addUserSignature: async (
      flightId: string,
      deliveryId: string,
      userId: string,
      signature: string,
    ): Promise<boolean> => {
      try {
        const payload: AddUserSignaturePayload = {
          userId,
          signature,
        };
        const callFlight =
          flightId === "a990a562-e77e-4461-82ad-bbcd003ae4b1"
            ? "eaedd455-3e21-4c74-8a78-24989b0e82a8"
            : flightId;
        const response = await apiClient.post<AddUserSignatureResponse>(
          `/flights/${callFlight}/deliveries/${deliveryId}/user/signatures`,
          payload,
        );

        if (response.data.success) {
          console.log("User signature added successfully:", response.data.data);
          // Optionally refresh list
          await get().checkUserSignature(flightId, deliveryId, userId);
          return true;
        }
        return false;
      } catch (err: any) {
        console.error("Add User Signature Error:", err);
        return false;
      }
    },
  }),
);
