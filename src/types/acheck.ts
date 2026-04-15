export interface AcheckFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DefectReportData) => void;
}

export interface DefectReportData {
  name: string;
  vehicleNo: string;
  date: string;
  lighting: Record<string, boolean>;
  operation: Record<string, boolean>;
  auxiliaryDrive: Record<string, boolean>;
  hydraulicsFailAt: Record<string, boolean>;
  engine: string;
  transmission: string;
  tires: Record<string, boolean>;
  compressedAirLineLeaking: string;
  bodyDamage: Record<string, boolean>;
  fallProtection: Record<string, boolean>;
  details: string;
  accidentHazard: "yes" | "no" | null;
  externalDamage: string;
}
