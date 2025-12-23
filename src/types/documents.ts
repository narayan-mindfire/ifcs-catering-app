// src/types/documents.ts

export interface DocumentFile {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size?: number;
  createdAt?: string;
  modifiedAt?: string;
}

// Add this missing interface
export interface DocumentFolder {
  id: string;
  name: string;
  parentId: string | null;
  hierarchy?: { id: string; name: string }[];
  createdAt?: string;
  modifiedAt?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  itemCount?: number;
  createdAt?: string;
  modifiedAt?: string;
}

export interface FileSystemItem {
  type: "file" | "folder";
  data: DocumentFile | FolderItem;
}
