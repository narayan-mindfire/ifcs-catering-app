export type MemoPriority = "High" | "Medium" | "Low";

export type Memo = {
  id: string;
  flightId: string;

  subject: string;
  content: string;

  sender: {
    id: string;
    name: string;
    role: string;
  };

  createdAt: string;
  updatedAt: string;

  isRead: boolean;
  isImportant: boolean;
  isDraft: boolean;

  isAcknowledged: boolean;
  requiresAcknowledgement: boolean;

  priority: MemoPriority;

  attachments: {
    id: string;
    name: string;
    size: string;
    type: string;
    url: string;
  }[];
};
