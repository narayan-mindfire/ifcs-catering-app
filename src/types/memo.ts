// Matches the "view" query parameter in the API
export type MemoTab = "Inbox" | "Draft" | "Acknowledged" | "Sent";

export type MemoStatus = "Draft" | "Sent";

export type MemoPriority = "Low" | "Medium" | "High";

export interface MemoAttachment {
  id: string;
  memoId: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  mimeType: string;
}

export interface MemoRecipient {
  userId: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  acknowledgedAt: string | null; // API returns ISO string date
  isAcknowledge: boolean; // Note: JSON key is "isAcknowledge" (singular)
  isRead: boolean; // Added based on actual data
}

export interface MemoSender {
  id: string;
  firstName: string;
  lastName: string;
  picture: string | null;
}

// Derived from actual data: "versions": [...]
export interface MemoVersion {
  id: string;
  version: string;
  createdAt: string;
}

export interface Memo {
  id: string;
  groupId: string; // Added: Present in actual data
  version: string; // Added: Present in actual data ("1.0")
  subject: string;
  note: string;
  priority: number; // 1, 2, 3
  status: MemoStatus;
  flightId: string | null;
  createdByUserId: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string

  // New field found in actual data payload
  versions?: MemoVersion[];

  // Joins
  sender?: MemoSender;
  attachments?: MemoAttachment[];
  recipients?: MemoRecipient[];

  // UI Helpers / Contextual Fields
  // 'isRead' appears at the root in the API Spec (likely for Inbox view),
  // but is missing in the 'Sent' data sample. Marked optional.
  isRead?: boolean;

  // 'isAcknowledged' is not in the raw object root in your data,
  // but likely derived or present in specific views.
  isAcknowledged?: boolean;
}
