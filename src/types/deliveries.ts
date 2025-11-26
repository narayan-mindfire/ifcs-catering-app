// src/types/deliveries.ts

// --- API Response Structure ---
export interface Delivery {
  id: string;
  flightId: string;
  fmId?: string;
  deliveryName: string; // This maps to "Delivery X" in UI

  // TSA Section
  tsaName?: string;
  tsaRacNumber?: string;
  tsaComment?: string;
  tsaSignature?: string;
  tsaSignatureTimestampDisplay?: string;

  // Crew Section
  crewName?: string;
  crewRacNumber?: string;
  crewComment?: string;
  crewSignature?: string;
  crewSignatureTimestampDisplay?: string;

  // Security Section
  securityName?: string;
  securityRacNumber?: string;
  securityComment?: string;
  securitySignature?: string;
  securitySignatureTimestampDisplay?: string;

  // Driver Section
  driverName?: string;
  driverRacNumber?: string;
  driverCompany?: string;
  driverSignature?: string;
  truckSeal?: string;
  dispatcherComment?: string;
  fullName?: string;
  signDate?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// --- UI Helper Interfaces (For Tabs) ---

export interface ContentPreparer {
  id: string;
  // Update: added 'driver' and 'crew'
  fieldPrefix: "tsa" | "security" | "driver" | "crew";
  fullName: string;
  // Update: added 'Driver' and 'Crew'
  type:
    | "Worker"
    | "Airline Representative"
    | "Third Party Security Guard"
    | "Driver"
    | "Crew";
  raicNumber: string;
  signature: string | null;
  signedAt: Date | null;
  note?: string;
}

export interface SecurityCompliance {
  isCompliant: boolean;
  confirmationText: string;
  signature: string | null;
  signedAt: Date | null;
  name?: string;
  raicNumber?: string;
}

export interface CrewCompliance {
  isCompliant: boolean;
  confirmationText: string;
  signature: string | null;
  signedAt: Date | null;
  name?: string;
  raicNumber?: string;
}

export interface DriversDeclaration {
  driverName: string;
  raicNumber: string;
  truckSeal: string;
  company: string;
  sealIntact: boolean;
  confirmationText: string;
  signature: string | null;
  signedAt: Date | null;
}
