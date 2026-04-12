export interface Delivery {
  id: string;
  flightId: string;
  fmId?: string | null;
  deliveryName: string;
  truckId?: string | null;
  dispatchAssignmentId?: string | null;

  /** SECURITY FIELDS (Backend names) */
  securityProvider?: string | null;
  securityName?: string | null;
  securityStaffNumber?: string | null;
  securityPosition?: string | null;
  securityRacNumber?: string | null;
  securityComment?: string | null;
  securitySignature?: string | null;
  securitySignatureTimestampDisplay?: string | null;

  /** CREW FIELDS (Backend names) */
  airCrewRepresentative?: string | null;
  crewName?: string | null;
  crewStaffNumber?: string | null;
  crewRacNumber?: string | null;
  crewComment?: string | null;
  crewSignature?: string | null;
  crewSignatureTimestampDisplay?: string | null;

  /** DRIVER FIELDS (Backend names) */
  driverName?: string | null;
  driverStaffId?: string | null;
  driverCompany?: string | null;
  truckSeal?: string | null;
  driverSignature?: string | null;
  driverId?: string | null;
  driverRacNumber?: string | null;
  driverSignatureTimestampDisplay?: string | null;

  /** TSA FIELDS (Third-party security) */
  tsaName?: string | null;
  tsaRacNumber?: string | null;
  tsaComment?: string | null;
  tsaSignature?: string | null;
  tsaSignatureTimestampDisplay?: string | null;

  /** OTHER FIELDS */
  dispatcherComment?: string | null;
  fullName?: string | null;
  signDate?: string | null;
  sedeSector?: string | null;
  sedeSuppliesStaffSignature?: string | null;
  crdeStaffSignature?: string | null;

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
  staffNumber?: string;
  signature: string | null;
  signedAt: Date | null;
  note?: string;
}

export interface SecurityCompliance {
  isCompliant?: boolean;
  confirmationText?: string;
  signature?: string | null;
  signedAt?: Date | null;
  provider?: string | null;
  name?: string | null;
  staffNumber?: string | null;
  position?: string | null;
}

export interface CrewCompliance {
  isCompliant?: boolean;
  confirmationText?: string;
  signature?: string | null;
  signedAt?: Date | null;
  airCrewRepresentative?: string;
  crewName?: string;
  staffNumber?: string;
}

export interface DriversDeclaration {
  driverName?: string;
  driverStaffId?: string;
  truckSeal?: string;
  driverCompany?: string;
  sealIntact?: boolean;
  confirmationText?: string;
  signature?: string | null;
  signedAt?: Date | null;
}
