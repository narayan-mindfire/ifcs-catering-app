// src/types/documents.ts

export interface DocumentFile {
  id: string;
  name: string;
  department?: string;
  tags?: Tag[];
  url: string;
  mimeType: string;
  size?: number;
  createdAt?: string;
  modifiedAt?: string;
}

export interface Tag {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
// Add this missing interface
export interface DocumentFolder {
  id: string;
  name: string;
  parentId: string | null;
  filesCount?: number;
  color?: string;
  createdBy?: string;
  updatedBy?: string;
  createdByUserName?: string;
  updatedByUserName?: string;
  hierarchy?: { id: string; name: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  filesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FileSystemItem {
  type: "file" | "folder";
  data: DocumentFile | FolderItem;
}
