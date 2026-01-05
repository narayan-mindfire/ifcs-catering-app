import { create } from "zustand";

interface ScannerStore {
  onScan: ((data: string) => void) | null;
  setOnScan: (cb: (data: string) => void) => void;
  clearOnScan: () => void;
}

export const useScannerStore = create<ScannerStore>((set) => ({
  onScan: null,
  setOnScan: (cb) => set({ onScan: cb }),
  clearOnScan: () => set({ onScan: null }),
}));
