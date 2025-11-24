import { create } from "zustand";
import { FlightPreparation, UpdateFlagPayload } from "../types/preparations";

const BASE_URL = "https://your-api.com/api/v1";

interface FlightPreparationState {
  preparations: FlightPreparation[];
  isLoading: boolean;
  error: string | null;

  fetchPreparations: (flightId: string) => Promise<void>;
  updatePreparationFlag: (
    flightId: string,
    preparationId: string,
    payload: UpdateFlagPayload,
  ) => Promise<void>;
}

export const useFlightPreparationStore = create<FlightPreparationState>(
  (set, get) => ({
    preparations: [],
    isLoading: false,
    error: null,

    fetchPreparations: async (flightId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `${BASE_URL}/flights/${flightId}/preparations?includeContent=true`,
        );
        const data = await response.json();

        if (response.ok) {
          set({ preparations: data });
        } else {
          set({ error: data.message || "Failed to fetch preparations" });
        }
      } catch (err) {
        set({ error: `Network error, ${err}` });
      } finally {
        set({ isLoading: false });
      }
    },

    updatePreparationFlag: async (flightId, preparationId, payload) => {
      try {
        const response = await fetch(
          `${BASE_URL}/flights/${flightId}/preparation-flags/${preparationId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        const jsonResponse = await response.json();

        if (response.ok && jsonResponse.success) {
          const updatedItem = jsonResponse.data;

          set((state) => ({
            preparations: state.preparations.map((item) =>
              item.id === preparationId ? { ...item, ...updatedItem } : item,
            ),
          }));

          console.log("Flag updated successfully");
        } else {
          console.error("Update failed:", jsonResponse.message);
        }
      } catch (err) {
        console.error("Network error during patch:", err);
      }
    },
  }),
);
