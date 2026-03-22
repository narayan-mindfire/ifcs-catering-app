export type ShiftType = "MORNING" | "EVENING";
export type AttendanceStatusValue = "WORKING" | "BREAK" | "FINISHED";

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  firstStartAt: string | null;
  lastEndAt: string | null;
  totalWorkedMs: number;
  totalBreakMs: number;
  shiftType: ShiftType | null;
  currentStatus: AttendanceStatusValue;
  lastStatusChangeAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceResponse {
  success: boolean;
  data: AttendanceRecord;
  message?: string;
}
