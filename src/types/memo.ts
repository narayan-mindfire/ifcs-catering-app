// src/types/memo.ts
export type MemoTab = "Inbox" | "Draft" | "Acknowledged By Me" | "Sent";

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: "pdf" | "image" | "excel";
  size: string;
}

export interface Memo {
  id: string;
  sender: User;
  recipients: User[]; // Added recipients
  flightNumber?: string; // Added flight
  subject: string;
  content: string;
  priority: "Low" | "Medium" | "High";
  isRead: boolean;
  isImportant: boolean;
  isDraft: boolean;
  isAcknowledged: boolean;
  requiresAcknowledgement: boolean;
  createdAt: string;
  attachments: Attachment[];
}
