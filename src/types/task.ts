export type TaskSourceType =
  | "MEMO"
  | "DISPATCH"
  | "PRODUCTION"
  | "PORTIONING"
  | "DELIVERY"
  | "COMPLIANCE"
  | "SPOT_CHECK";

export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "SCHEDULED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface TaskDetails {
  flightId?: string;
  flightNo?: string;
  takeOffTime?: string;
  aircraftReg?: string;
  truckNo?: string;
  loadingBay?: string;
  reachBayAt?: string;
  jobType?: string;
  timeToLoad?: string;
  galleysToLoad?: number;
  route?: string;
  assignedStaff?: {
    driver?: { id: string; name: string };
    loader?: Array<{ id: string; name: string }>;
  };
}

export interface UnifiedTask {
  id: string;
  sourceId: string;
  sourceType: TaskSourceType;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  startTime: string; // ISO Date string
  endTime: string; // ISO Date string
  metadata?: {
    memoId?: string;
    flightId?: string;
    [key: string]: any;
  };
  taskDetails?: TaskDetails;
  createdAt: string;
  updatedAt: string;
}

export interface TaskResponse {
  success: boolean;
  data: UnifiedTask[];
}
