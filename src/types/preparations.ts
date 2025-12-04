export type PreparationAction = "seal" | "assembly" | "load";

export interface PreparationApiResponse {
  success: boolean;
  message: string;
  data: Preparation[];
}

export interface UpdateFlagPayload {
  action: PreparationAction;
  sealTagNumber?: string | number;
}

export interface Preparation {
  id: string;
  flightId: string;
  packingStandardId: string | null;
  storageId: string | null;
  parentStorageId: string | null;
  galleyConfigurationId: string | null;
  isContentPrepared: boolean;
  isTrackConsumption: boolean;
  isDynamicLoadingIncomplete: boolean;
  name: string | null;
  nameDisplay: string | null;
  code: string | null;
  position: string | null;
  positionRap: string | null;
  rotationCode: string | null;
  direction: string | null;
  weight: number | null;
  availableWeight: number | null;
  galleyCode: string | null;
  galleyPosition: string | null;
  preparedBy: string | null;
  priority: number | null;
  equipment: string | null;
  quantity: number | null;
  date: string | null;
  qrCode: string | null;
  qrCodeUrl: string | null;
  dynamicLoadingQrCode: string | null;
  dynamicLoadingQrCodeUrl: string | null;
  labelUrl: string | null;
  report: string | null;
  sealTagNumber: string | null;
  assemblyProcessFlag: string | null;
  loadedTruckFlag: string | null;
  createdAt: string;
  updatedAt: string;
  door?: string | null;
}

export interface ProvisionItemDetail {
  id: string;
  fmId: string | null;
  code: string | null;
  name: string;
  nameShort: string | null;
  description: string | null;
  note: string | null;
  isActive: boolean;
  isEquipment: boolean;
  isFood: boolean;
  isTrackConsumption: boolean;
  isDeadhead: boolean;
  isDynamic: boolean;
  picture: string | null;
  type: string | null;
  typeCabin: string | null;
  typeService: string | null;
  weight: string | null;
  preparedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PackingStandardItemDef {
  id: string;
  fmId: string | null;
  packingStandardId: string | null;
  provisionId: string | null;
  name: string | null;
  isContainer: boolean;
  isDynamic: boolean;
  isTrackConsumption: boolean;
  quantity: number | null;
  isFront: boolean;
  isRear: boolean;
  position: string | null;
  picture: string | null;
  createdAt: string;
  updatedAt: string;
  provisionItem: ProvisionItemDetail | null;
  mealItem: ProvisionItemDetail | null;
}

export interface ItemContentMapped {
  id: string;
  name: string;
  quantity: number;
  packingStandardItemPicture: string | null;
  provisionItemPicture: string | null;
  packingStandardItemDef: PackingStandardItemDef | null;
}

export interface RecursivePackingStandardNode {
  packingStandard: {
    id: string;
    fmId: string | null;
    parentId: string | null;
    equipmentItemId: string | null;
    name: string;
    dateStart: string | null;
    dateEnd: string | null;
    preparedBy: string | null;
    labelText: string | null;
    labelTextRear: string | null;
    report: string | null;
    picture: string | null;
    calendarDateSelected: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  equipmentItem: {
    id: string;
    fmId: string | null;
    equipmentCategoryId: string | null;
    categoryClientId: string | null;
    name: string;
    nameShort: string | null;
    isDouble: boolean;
    codeS: string | null;
    weight: string | null;
    weightCapacity: string | null;
    hasDrawer: boolean;
    isactive: boolean;
    isDynamic: boolean;
    type: string | null;
    drawerCount: number | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  equipmentCategory: {
    id: string;
    fmId: string | null;
    name: string;
    contains: string | null;
    hasDrawer: boolean;
    hasLabel: boolean;
    hasLock: boolean;
    hasRear: boolean;
    hasSeal: boolean;
    picture: string | null;
    pictureOpen: string | null;
    pictureClosed: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  contents: ItemContentMapped[];
  children: RecursivePackingStandardNode[];
}

export interface PreparationDetailData {
  id: string;
  fmId: string | null;
  door: string | null;
  flightId: string;
  packingStandardId: string | null;
  storageId: string | null;
  parentStorageId: string | null;
  galleyConfigurationId: string | null;
  isContentPrepared: boolean;
  isTrackConsumption: boolean;
  isDynamicLoadingIncomplete: boolean;
  name: string | null;
  nameDisplay: string | null;
  code: string | null;
  position: string | null;
  positionRap: string | null;
  rotationCode: string | null;
  direction: string | null;
  weight: string | null;
  availableWeight: string | null;
  galleyCode: string | null;
  galleyPosition: string | null;
  preparedBy: string | null;
  priority: number | null;
  equipment: string | null;
  quantity: number | null;
  date: string | null;
  qrCode: string | null;
  qrCodeUrl: string | null;
  dynamicLoadingQrCode: string | null;
  dynamicLoadingQrCodeUrl: string | null;
  labelUrl: string | null;
  report: string | null;
  sealTagNumber: string | null;
  assemblyProcessFlag: string | null;
  loadedTruckFlag: string | null;
  createdAt: string;
  updatedAt: string;
  aircraftPosition: {
    id: string;
    fmId: string | null;
    aircraftConfigId: string | null;
    aircraftConfigGalleyId: string | null;
    picture: string | null;
    pictureName: string | null;
    galleyPosition: string | null;
    containerNumber: string | null;
    position: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  calculatedPosition: string | null;
  packingStandard: RecursivePackingStandardNode | null;
}

export interface PreparationFlagUpdatePayload {
  action: "assembly" | "seal" | "load";
  assemblyProcessFlag?: string;
  sealTagNumber?: string;
  loadedTruckFlag?: string;
}
