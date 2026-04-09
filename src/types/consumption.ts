export interface ConsumptionTrackingRecord {
  id: string;
  flightId: string;
  departureStation?: string;
  flightNumber?: string;
  flightNumberSuffix?: string;
  seatNumber?: string;
  mealCode?: string;
  cabin?: string;
  passengerName?: string;
  mealName?: string;
  addQty: number;
  consumedQty: number;
  qty: number;
  returnedQty: number;
  createdAt: string;
  updatedAt: string;
  flightPrepPackingStandardId?: string;
  flightPrepPackingStandardItemId?: string;
  flightPrepProvisionItemId?: string;
  flightPreparationId?: string;
  flightPreparationDynamicItemId?: string;
  foodOrderItemId?: string;
  mealId?: string;
  // Position
  labelPosition?: string | null;
  galleyPosition?: string | null;
  stowage?: string | null;
  containerNumber?: string | null;
  drawerName?: string | null;
  itemPosition?: string | null;
  loadingPlanValue?: string | null;
  isFront?: boolean | null;
  isRear?: boolean | null;
}

export interface CreateConsumptionTrackingInput {
  flightPrepPackingStandardId?: string;
  flightPrepPackingStandardItemId?: string;
  flightPrepProvisionItemId?: string;
  flightPreparationId?: string;
  flightPreparationDynamicItemId?: string;
  foodOrderItemId?: string;
  mealId?: string;
  addQty: number;
  consumedQty: number;
  qty: number;
  returnedQty: number;
  // Position
  labelPosition?: string | null;
  galleyPosition?: string | null;
  stowage?: string | null;
  containerNumber?: string | null;
  drawerName?: string | null;
  itemPosition?: string | null;
  loadingPlanValue?: string | null;
  isFront?: boolean | null;
  isRear?: boolean | null;
}

export interface UpdateConsumptionTrackingInput {
  flightPrepPackingStandardId?: string;
  flightPrepPackingStandardItemId?: string;
  flightPrepProvisionItemId?: string;
  flightPreparationId?: string;
  flightPreparationDynamicItemId?: string;
  foodOrderItemId?: string;
  mealId?: string;
  addQty?: number;
  consumedQty?: number;
  qty?: number;
  returnedQty?: number;
  // Position
  labelPosition?: string | null;
  galleyPosition?: string | null;
  stowage?: string | null;
  containerNumber?: string | null;
  drawerName?: string | null;
  itemPosition?: string | null;
  loadingPlanValue?: string | null;
  isFront?: boolean | null;
  isRear?: boolean | null;
}

export interface ConsumptionTrackingListResponse {
  success: boolean;
  data: ConsumptionTrackingRecord[];
  total: number;
  limit: number;
  offset: number;
}

export interface ConsumptionTrackingResponse {
  success: boolean;
  data: ConsumptionTrackingRecord;
}

export interface ConsumptionTrackingFilters {
  mealId?: string;
  foodOrderItemId?: string;
  flightPreparationId?: string;
  limit?: number;
  offset?: number;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errors?: {
    field: string;
    message: string;
  }[];
  error?: {
    code: string;
    message: string;
    details: any;
  };
}
