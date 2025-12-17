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
