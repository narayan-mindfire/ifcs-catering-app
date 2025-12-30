export interface SpotCheckFailPayload {
  flightId: string;
  preparationId: string;

  route: string;
  loadingPlanId: string | undefined;
  aircraftRegistration: string;
  flightNumber: string;
  equipmentItemName: string;

  remarks: string;
  reason: string;

  images: string[];
}

export interface SpotCheckResponse {
  success: boolean;
  message: string;
  data?: any;
}
