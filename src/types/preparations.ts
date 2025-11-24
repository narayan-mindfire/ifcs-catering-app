export type PreparationAction = "seal" | "assembly" | "load";

export interface FlightPreparation {
  id: string;
  flightId: string;
  packingStandardId?: string;
  storageId?: string;
  parentStorageId?: string;
  galleyConfigurationId?: string;

  isContentPrepared?: boolean;
  isTrackConsumption?: boolean;
  isDynamicLoadingIncomplete?: boolean;

  name?: string;
  nameDisplay?: string;
  code?: string;
  position?: string;
  positionRap?: string;
  rotationCode?: string;
  direction?: string;

  weight?: number;
  availableWeight?: number;

  galleyCode?: string;
  galleyPosition?: string;

  preparedBy?: string;
  priority?: number;
  equipment?: string;
  quantity?: number;

  date?: string;

  qrCode?: string;
  qrCodeUrl?: string;
  dynamicLoadingQrCode?: string;
  dynamicLoadingQrCodeUrl?: string;
  labelUrl?: string;

  report?: string;
  sealTagNumber?: string;

  assemblyProcessFlag?: string;
  loadedTruckFlag?: string;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateFlagPayload {
  action: PreparationAction;
  sealTagNumber?: string | number;
}
