export interface Delivery {
  id: string;
  flightId: string;
  fmId?: string;
  deliveryName: string;

  tsaName?: string;
  tsaRacNumber?: string;
  tsaComment?: string;
  tsaSignature?: string;
  tsaSignatureTimestampDisplay?: string;

  crewName?: string;
  crewRacNumber?: string;
  crewComment?: string;
  crewSignature?: string;
  crewSignatureTimestampDisplay?: string;

  securityName?: string;
  securityRacNumber?: string;
  securityComment?: string;
  securitySignature?: string;
  securitySignatureTimestampDisplay?: string;

  driverName?: string;
  driverRacNumber?: string;
  driverCompany?: string;
  driverSignature?: string;
  truckSeal?: string;
  dispatcherComment?: string;
  fullName?: string;
  signDate?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ContentPreparer {
  id: string;
  fieldPrefix: "security" | "driver" | "crew";
  fullName: string;
  type:
    | "Worker"
    | "Security Personnel"
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
