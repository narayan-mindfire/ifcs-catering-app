export interface PreparationItem {
  position: string;
  nameDisplay: string;
  equipment: string;
  preparedBy: string;

  id: string;
  flightId: string;
  storageId: string;
  code: string;
  name: string;
  priority: number;
  date: string;

  isContentPrepared: boolean;
  isDynamicLoadingIncomplete: boolean;
  assemblyProcessFlag: string;
  loadedTruckFlag: string;
  isLockRequired: boolean;
  isSealRequired: boolean;
  isTrackConsumption: boolean;
  weight: number;
  availableWeight: number;
  quantity: number;
  sealTagNumber: string;
  lockTagNumber: string;
  truckId?: string | null;
  dispatchAssignmentId?: string | null;

  qrCodeUrl: string;
  dynamicLoadingQrCodeUrl: string;
  labelUrl: string;
  report: string;

  createdAt: string;
  updatedAt: string;

  packingStandardId: string;
  parentStorageId: string;
  galleyConfigurationId: string;
  galleyCode: string;
  galleyPosition: string;
  positionRap: string;
  rotationCode: string;
  direction: string;
  qrCode: string;
  dynamicLoadingQrCode: string;
  galleyNumber: string;
  door: string;
  stowage: string;
  carrier: string;
  doorNumber: string;
  trucks?: Truck[];
  aircraftConfigGalleyPosition?: AircraftConfigGalleyPosition;
  packingStandard?: PackingStandard;
}

export interface PreparationFlagUpdatePayload {
  action: "assembly" | "seal" | "lock" | "load" | "prepared";
  assemblyProcessFlag?: boolean;
  sealTagNumber?: number | string | null;
  lockTagNumber?: number | string | null;
  loadedTruckFlag?: boolean;
  isContentPrepared?: boolean;
  truckId?: string;
  dispatchAssignmentId?: string;
}

export interface PromptModalState {
  isOpen: boolean;
  rowIndex: number | null;
  actionIndex: number | null;
  actionName: string;
  isBlocked: boolean;
  isCompleted: boolean;
}

//****************************ADD DYNAMIC LOADING****************************************/
export interface Meal {
  id: string;
  fmId: string;
  mealCode: string;
  name: string;
  nameShort: string;
  mealType: string | null;
  mealDescription: string | null;
  isActive: boolean;
  isTrackConsumption: boolean;
  dynamicLoadingPriority: number | null;
  picture?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MealResponse {
  success: boolean;
  message: string;
  data: Meal[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface MealFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
  mealCode?: string;
  mealType?: string;
  isActive?: boolean;
}

export interface ProvisionItem {
  id: string;
  fmId: string;
  code: string;
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
  picture?: string | null;
  type: string;
  typeCabin: string | null;
  typeService: string | null;
  weight: string | null;
  preparedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProvisionResponse {
  success: boolean;
  message: string;
  data: ProvisionItem[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface ProvisionFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
  code?: string;
  type?: string;
  typeCabin?: string;
  typeService?: string;
  isActive?: boolean;
  isEquipment?: boolean;
  isFood?: boolean;
}

//****************************PREPARATION DETAIL****************************************/
export interface FlightPreparationModalProps {
  open: boolean;
  onClose: () => void;
  isLocked: boolean;
  isSealed: boolean;
  isCompleted: boolean;
  preparationId: string;
  flightId: string;
  isLockRequired: boolean;
  isConsumptionMode: boolean;
}

export interface EquipmentItem {
  id: string;
  name: string;
  type: string | null;
  picture?: string | null;
  pictureOpen: string | null;
  pictureClosed: string | null;
}

export interface PackingStandardContainer {
  id: string;
  name: string;
  isFront?: boolean;
  isRear?: boolean;
  equipmentItem: EquipmentItem;
  items: PackingStandardItem[];
}

export interface PackingStandardItem {
  id: string;

  fmId?: string | null;
  itemId?: string | null;

  packingStandardId?: string | null;
  provisionId?: string | null;
  nestedPackingStandardId?: string | null;
  mealItemId?: string | null;

  name?: string | null;
  code?: string | null;
  description?: string | null;

  isContainer?: boolean;
  isDynamic: boolean;
  isTrackConsumption: boolean;

  quantity?: number | null;

  isFront: boolean;
  isRear: boolean;

  position?: string | null;
  picture?: string | null;

  foodOrderItemId?: string;
  mealId?: string;
  flightPreparationDynamicItemId?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface AircraftConfigGalleyPosition {
  id: string;
  fmId: string | null;
  aircraftConfigId: string;
  aircraftConfigGalleyId: string | null;
  picture?: string | null;
  pictureName: string | null;
  galleyPosition: string;
  containerNumber: string;
  position: string | null;
}

export interface PackingStandard {
  id: string;
  name: string;
  equipmentItem: EquipmentItem;
  items: PackingStandardItem[];
  containers: PackingStandardContainer[];
}

export interface AssignedStaff {
  userId: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface DispatchAssignment {
  id: string;
  flightId: string;
  truckId: string;
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
  assignedStaff: AssignedStaff[];
}

export interface Truck {
  id: string;
  assetName: string;
  vehicleNumber: string;
  assetCategory: string;
  dispatchAssignments: DispatchAssignment[];
}

export interface PreparationDetailData {
  id: string;
  flightId: string;
  name: string;
  nameDisplay: string | null;
  code: string;
  position: string;
  positionRap: string | null;
  rotationCode: string;
  direction: string;
  weight: string | number | null;
  galleyCode: string | null;
  galleyPosition: string | null;
  preparedBy: string;
  sealedBy?: string | null;
  lockedBy?: string | null;
  preparedByUser?: any;
  sealedByUser?: any;
  lockedByUser?: any;
  assemblyProcessedByUser?: any;
  loadTruckByUser?: any;
  priority: number | null;
  equipment: string;
  sealTagNumber: string | null;
  lockTagNumber?: string | null;
  assemblyProcessFlag: string | null;
  loadedTruckFlag: boolean | string | null;
  equipmentItemType?: string;
  labelUrl: string | null;
  isRear: boolean;
  isFront: boolean;
  truck: any;
  qrCodeUrl: string | null;
  aircraftConfigGalleyPosition: AircraftConfigGalleyPosition;
  door: string | null;
  galleyNumber: string | null;
  doorNumber: string | null;
  stowage: string | null;
  carrier: string | null;
  packingStandard: PackingStandard;
  isTrackConsumption: boolean;
  isContentPrepared?: boolean;
  trucks?: Truck[];
  storageId?: string | null;
  date?: string | null;
  isDynamicLoadingIncomplete?: boolean;
  isLockRequired?: boolean | null;
  isSealRequired?: boolean | null;
  quantity?: number | null;
}

export interface PreparationDetailResponse {
  success: boolean;
  message: string;
  data:
    | {
        preparation: PreparationDetailData | PreparationDetailData[];
        trucks: Truck[];
      }
    | PreparationDetailData
    | null;
}

//****************************PREPARATION STORE STATE****************************************/
export interface PreparationPrintResponse {
  success: boolean;
  fileUrl: string;
  fileKey: string;
  bucket: string;
}
export interface PreparationStoreState {
  preparations: PreparationItem[];
  preparationDetail: PreparationDetailData | null;
  meals: Meal[];
  mealsMeta: MealResponse["meta"] | null;
  provisions: ProvisionItem[];
  provisionsMeta: ProvisionResponse["meta"] | null;
  isLoading: boolean;
  error: string | null;
  fetchData: (flightId: string) => Promise<void>;
  updateFlag: (
    flightId: string,
    preparationId: string,
    payload: PreparationFlagUpdatePayload,
  ) => Promise<void>;
  fetchMeals: (filters?: MealFilters) => Promise<void>;
  fetchProvisions: (filters?: ProvisionFilters) => Promise<void>;
  fetchDataById: (flightId: string, preparationId: string) => Promise<void>;
  printPreparation: (
    preparationId: string,
  ) => Promise<PreparationPrintResponse>;
}

export interface PrintData {
  success: boolean;
  fileUrl: string;
  fileKey: string;
  bucket: string;
}

//****************************PREPARATION INFO COMPONENTS****************************************/

export interface CartProps {
  cabinetFrameImg?: string | null;
  drawers?: PackingStandardContainer[];
  numberOfDrawers: number;
  defaultOpenDrawer?: number | null;
  onDrawerClick: (
    drawerIndex: number | null,
    drawerData: PackingStandardContainer | null,
  ) => void;
}

export interface DrawerProps {
  isOpen: boolean;
  onClick: () => void;
  drawer?: PackingStandardContainer | null;
  position: { top: number };
  drawerName?: string;
}

export interface ContainerProps {
  cabinetFrameImg?: string | null;
  drawersData: PackingStandardContainer[];
  numberOfDrawers?: number;
  defaultOpenDrawer?: number | null;
  onDrawerClick: (drawerIndex: number | null) => void;
}
export type CompletedActionsState = {
  [key: string]: number[];
};

export interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionName: string;
  isBlocked: boolean;
  isCompleted: boolean;
}

export interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

export interface SealNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sealNumber: number) => void;
  title?: string;
}

export interface StatusRowProps {
  isLocked: boolean;
  isSealed: boolean;
  isCompleted: boolean;
  isLockRequired: boolean;
}

export interface Status {
  label: string;
  icon: string;
  isActive: boolean;
}

export interface DynamicLoadingModalProps {
  onClose: () => void;
}

export type SelectedItemData = Meal | ProvisionItem;

export interface UserSignature {
  id: string;
  userId: string;
  deliveryId: string;
  signature: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSignatureResponse {
  success: boolean;
  message: string;
  data: UserSignature[];
  meta?: {
    pagination: {
      limit: number;
      offset: number;
    };
  };
}

export interface AddUserSignaturePayload {
  userId: string;
  signature: string;
}

export interface AddUserSignatureResponse {
  success: boolean;
  message: string;
  data: UserSignature;
}
