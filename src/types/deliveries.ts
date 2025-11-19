export interface Delivery {
  id: string;
  deliveryNumber: number;
  contentPreparers: ContentPreparer[];
  securityCompliance: SecurityCompliance | null;
  crewCompliance: CrewCompliance | null;
  driversDeclaration: DriversDeclaration | null;
  securityDeclaration: SecurityDeclaration | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentPreparer {
  id: string;
  fullName: string;
  type: "Worker" | "Airline Representative" | "Third Party Security Guard";
  raicNumber: string;
  signature: string | null;
  signedAt: Date | null;
  additionalRequirement?: string;
  note?: string;
}

export interface SecurityCompliance {
  isCompliant: boolean;
  confirmationText: string;
  signature: string | null;
  signedAt: Date | null;
}

export interface CrewCompliance {
  isCompliant: boolean;
  confirmationText: string;
  signature: string | null;
  signedAt: Date | null;
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

export interface SecurityDeclaration {
  section: "Single" | "Double";
  provider: SecurityPerson | null;
  handler: SecurityPerson | null;
}

export interface SecurityPerson {
  name: string;
  staffName: string;
  staffNumber: string;
  position: string;
  signature: string | null;
  signedAt: Date | null;
}
