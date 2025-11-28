// src/types/memo.ts

export type MemoPriority = "High" | "Medium" | "Low";
export type MemoTab = "Inbox" | "Draft" | "Acknowledged By Me" | "Sent";

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "image" | "excel" | "doc";
  url: string; // Mock url
}

export interface Sender {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Memo {
  id: string;
  flightId: string; // To link memo to specific flight context
  subject: string;
  content: string;
  sender: Sender;

  // Timestamps
  createdAt: string; // ISO String
  updatedAt: string; // ISO String

  // Status flags (Specific to the current user viewing it)
  isRead: boolean;
  isImportant: boolean;
  isDraft: boolean;
  isAcknowledged: boolean;
  requiresAcknowledgement: boolean;

  priority: MemoPriority;
  attachments: Attachment[];
}

// API Response wrapper
export interface MemoApiResponse {
  success: boolean;
  data: Memo[];
  total: number;
}
