import { Memo, MemoPriority } from "../types/memo";

const CURRENT_USER_ID = "user-123";

const getDateDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const MOCK_MEMOS: Memo[] = [
  {
    id: "m-1",
    flightId: "fl-101",
    subject: "URGENT: Flight Safety Protocol Update v2.1",
    content:
      "All crew members must review the attached safety protocol revisions immediately. Changes affect pre-flight checks for the Boeing 737 fleet. Failure to acknowledge will result in suspension.",
    sender: { id: "u-2", name: "Shitanshu", role: "Flight Ops Manager" },
    createdAt: getDateDaysAgo(0),
    updatedAt: getDateDaysAgo(0),
    isRead: false,
    isImportant: true,
    isDraft: false,
    isAcknowledged: false,
    requiresAcknowledgement: true,
    priority: "High",
    attachments: [
      {
        id: "a-1",
        name: "Safety_Protocol_v2.1.pdf",
        size: "2.4 MB",
        type: "pdf",
        url: "#",
      },
      {
        id: "a-2",
        name: "Summary_Changes.docx",
        size: "150 KB",
        type: "doc",
        url: "#",
      },
    ],
  },
  // --- INBOX (Medium, Read) ---
  {
    id: "m-2",
    flightId: "fl-101",
    subject: "Weekly Catering Menu Adjustment",
    content:
      "Please note that the vegetarian option for sector A has been changed from Pasta to Grilled Vegetables due to supplier shortages.",
    sender: { id: "u-3", name: "John Doe", role: "Catering Head" },
    createdAt: getDateDaysAgo(1),
    updatedAt: getDateDaysAgo(1),
    isRead: true,
    isImportant: false,
    isDraft: false,
    isAcknowledged: false,
    requiresAcknowledgement: false,
    priority: "Medium",
    attachments: [],
  },
  {
    id: "m-3",
    flightId: "fl-101",
    subject: "Lost and Found: Blue Scarf",
    content:
      "A blue scarf was found in the crew lounge. Please claim it at the front desk.",
    sender: { id: "u-4", name: "Jane Smith", role: "Ground Staff" },
    createdAt: getDateDaysAgo(2),
    updatedAt: getDateDaysAgo(2),
    isRead: false,
    isImportant: false,
    isDraft: false,
    isAcknowledged: false,
    requiresAcknowledgement: false,
    priority: "Low",
    attachments: [],
  },
  {
    id: "m-4",
    flightId: "fl-101",
    subject: "Q4 Performance Review Schedule",
    content: "The schedule for Q4 reviews is out. Please check your slots.",
    sender: { id: "u-5", name: "HR Department", role: "Human Resources" },
    createdAt: getDateDaysAgo(5),
    updatedAt: getDateDaysAgo(5),
    isRead: true,
    isImportant: true,
    isDraft: false,
    isAcknowledged: true,
    requiresAcknowledgement: true,
    priority: "Medium",
    attachments: [
      {
        id: "a-3",
        name: "Schedule.xlsx",
        size: "45 KB",
        type: "excel",
        url: "#",
      },
    ],
  },
  {
    id: "m-5",
    flightId: "fl-101",
    subject: "Incident Report: Seat 14A",
    content:
      "Drafting report regarding the malfunction of the recline mechanism...",
    sender: { id: CURRENT_USER_ID, name: "Me", role: "Senior Cabin Crew" },
    createdAt: getDateDaysAgo(0),
    updatedAt: getDateDaysAgo(0),
    isRead: true,
    isImportant: false,
    isDraft: true,
    isAcknowledged: false,
    requiresAcknowledgement: false,
    priority: "High",
    attachments: [],
  },
  {
    id: "m-6",
    flightId: "fl-101",
    subject: "Request for Leave - Approved?",
    content: "Just following up on my leave request for next month.",
    sender: { id: CURRENT_USER_ID, name: "Me", role: "Senior Cabin Crew" },
    createdAt: getDateDaysAgo(3),
    updatedAt: getDateDaysAgo(3),
    isRead: true,
    isImportant: false,
    isDraft: false,
    isAcknowledged: false,
    requiresAcknowledgement: false,
    priority: "Low",
    attachments: [],
  },
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `m-fill-${i}`,
    flightId: "fl-101",
    subject: `General Update #${i + 100}`,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    sender: { id: "u-2", name: "Shitanshu", role: "Flight Ops Manager" },
    createdAt: getDateDaysAgo(i + 5),
    updatedAt: getDateDaysAgo(i + 5),
    isRead: i % 3 === 0,
    isImportant: i % 5 === 0,
    isDraft: false,
    isAcknowledged: false,
    requiresAcknowledgement: false,
    priority: (i % 3 === 0
      ? "High"
      : i % 2 === 0
        ? "Medium"
        : "Low") as MemoPriority,
    attachments: [],
  })),
];
