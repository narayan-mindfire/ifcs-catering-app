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
  acknowledgedAt: string | null;
  isAcknowledge: boolean;
  isRead: boolean;
}

export interface MemoSender {
  id: string;
  firstName: string;
  lastName: string;
  picture: string | null;
}

export interface MemoVersion {
  id: string;
  version: string;
  createdAt: string;
}

export interface Memo {
  id: string;
  groupId: string;
  version: string;
  subject: string;
  note: string;
  priority: number; // 1, 2, 3
  status: MemoStatus;
  flightId: string | null;
  memoHeaders?: string[];
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;

  versions?: MemoVersion[];

  // Joins
  sender?: MemoSender;
  attachments?: MemoAttachment[];
  recipients?: MemoRecipient[];
  isRead?: boolean;

  isAcknowledged?: boolean;
}
