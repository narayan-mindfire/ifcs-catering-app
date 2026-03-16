import {
  getCrewCompliance,
  getDriversDeclaration,
  getSecurityCompliance,
} from "../../src/utils/deliveriesHelper";

describe("deliveriesHelper", () => {
  const mockDelivery: any = {
    driverName: "John Driver",
    driverStaffId: "S123",
    truckSeal: "SEAL001",
    driverCompany: "Logistics Co",
    driverSignature: "sig123",
    driverSignatureTimestampDisplay: "2023-10-27T10:00:00Z",
    crewName: "Jane Crew",
    crewStaffNumber: "C456",
    crewSignature: "sig456",
    crewSignatureTimestampDisplay: "2023-10-27T10:30:00Z",
    securityName: "Sam Security",
    securityStaffNumber: "SEC789",
    securitySignature: "sig789",
    securitySignatureTimestampDisplay: "2023-10-27T11:00:00Z",
  };

  it("getDriversDeclaration should map delivery data correctly", () => {
    const result = getDriversDeclaration(mockDelivery);
    expect(result.driverName).toBe(mockDelivery.driverName);
    expect(result.signature).toBe(mockDelivery.driverSignature);
    expect(result.signedAt).toBeInstanceOf(Date);
  });

  it("getCrewCompliance should map delivery data correctly", () => {
    const result = getCrewCompliance(mockDelivery);
    expect(result.crewName).toBe(mockDelivery.crewName);
    expect(result.staffNumber).toBe(mockDelivery.crewStaffNumber);
    expect(result.signature).toBe(mockDelivery.crewSignature);
  });

  it("getSecurityCompliance should map delivery data correctly", () => {
    const result = getSecurityCompliance(mockDelivery);
    expect(result.name).toBe(mockDelivery.securityName);
    expect(result.staffNumber).toBe(mockDelivery.securityStaffNumber);
    expect(result.signature).toBe(mockDelivery.securitySignature);
  });
});
