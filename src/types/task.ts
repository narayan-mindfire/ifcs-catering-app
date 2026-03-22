export type TaskSourceType =
  | "MEMO"
  | "DISPATCH"
  | "PRODUCTION"
  | "PORTIONING"
  | "DELIVERY"
  | "COMPLIANCE"
  | "SPOT_CHECK";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

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
  createdAt: string;
  updatedAt: string;
}

export interface TaskResponse {
  success: boolean;
  data: UnifiedTask[];
}
