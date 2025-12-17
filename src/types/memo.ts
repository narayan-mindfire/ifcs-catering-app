export type MemoTab = "Inbox" | "Acknowledged By Me";

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
  acknowledgedAt: Date | null;
  isAcknowledge: boolean;
}

export interface MemoSender {
  id: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  // Role isn't in your user schema explicitly, mapping 'type' if available, else generic
  role?: string;
}

export interface Memo {
  id: string;
  subject: string;
  note: string; // Mapped from backend 'note' to UI 'content'
  priority: number; // 1, 2, 3
  status: "Draft" | "Sent";
  flightId: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;

  // Joins
  sender?: MemoSender;
  attachments?: MemoAttachment[];
  recipients?: MemoRecipient[];

  // UI Helpers (derived properties)
  isAcknowledged?: boolean; // Derived from API logic
  isRead?: boolean; // New property to track read/unread status
}
