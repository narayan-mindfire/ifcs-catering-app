export interface SpotCheckFailPayload {
  flightId: string;
  preparationId: string;
  userId: string; // Required by API

  // Compliance / API Fields
  route: string;
  loadingPlanId: string | undefined;
  aircraftRegistration: string;
  flightNumber: string;
  equipmentItemName: string;
  container?: string; // Optional per API
  equipmentItemId?: string; // Optional per API

  remarks: string;
  reason: string;

  images: string[];
}

export interface SpotCheckPassPayload {
  flightId: string;
  preparationId: string;
  userId: string;
  container?: string;
}

export interface SpotCheckResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface SpotCheckLog {
  id: string;
  flightPreparationId: string;
  flightId: string;
  isPass: boolean;
  container: string;
  createdAt: string;

  // Flight Info
  flightNumber: string;
  designator: string;
  route: string;
  departure: string;
  arrival: string;
  scheduledDeparture: string;
  status: string;

  // Prep Info
  galley: string;
  stowage: string;
  category: string;
  carrier: string;
  preparationName: string;
  preparationCode: string;
  position: string;
  equipment: string;
  loadingPlan: string;
}

export interface SpotCheckLogsResponse {
  success: boolean;
  message: string;
  data: SpotCheckLog[];
  metadata: {
    pagination: {
      total: number;
      limit: number;
      offset: number;
    };
  };
}
