import {
  CrewCompliance,
  Delivery,
  DriversDeclaration,
  SecurityCompliance,
} from "../types/deliveries";

export const getDriversDeclaration = (d: Delivery): DriversDeclaration => ({
  driverName: d.driverName || "",
  driverStaffId: d.driverStaffId || "",
  truckSeal: d.truckSeal || "",
  driverCompany: d.driverCompany || "",
  sealIntact: false,
  confirmationText:
    "I certify that a. the security of in-flight supplies is maintained during the transfer from in-flight supply facilies to aircraft b. in-flight supplies have been loaded into the aircraft in secure condition and handed over to the flight air crew or oman-air representative",
  signature: d.driverSignature || null,
  signedAt: d.driverSignatureTimestampDisplay
    ? new Date(d.driverSignatureTimestampDisplay)
    : null,
});

export const getCrewCompliance = (d: Delivery): CrewCompliance => ({
  isCompliant: false,
  confirmationText:
    "I certify that\n\n\ a.In-flight supplies have been loaded into the aircraft in secure condition, and all seals are in secure condition",
  signature: d.crewSignature || null,
  signedAt: d.crewSignatureTimestampDisplay
    ? new Date(d.crewSignatureTimestampDisplay)
    : null,
  airCrewRepresentative: d.airCrewRepresentative || "",
  crewName: d.crewName || "",
  staffNumber: d.crewStaffNumber || "",
});

export const getSecurityCompliance = (d: Delivery): SecurityCompliance => ({
  isCompliant: false,
  confirmationText:
    "The in-flight supplies have gone through the following procedures: a. implemented appropriate measures to monitor the activities of staff preparing in-flight supplies(i.e, supervision/CCTV), so it will be preventive to insert prohibited items within a product.\n b. tamper - evident seals used to secure catering, carts and containers are affixed via trained and authorized person and checked against authorized documentation.",
  signature: d.securitySignature || null,
  signedAt: d.securitySignatureTimestampDisplay
    ? new Date(d.securitySignatureTimestampDisplay)
    : null,
  provider: d.securityProvider || null,
  name: d.securityName || null,
  staffNumber: d.securityStaffNumber || null,
  position: d.securityPosition || null,
});
