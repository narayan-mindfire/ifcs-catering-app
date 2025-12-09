export interface DocumentFolder {
  id: string;
  name: string;
  parentId: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
  hierarchy?: DocumentFolder[];
  filesCount?: number;
}

export interface DocumentFile {
  id: string;
  folderId: string;
  name: string;
  url: string;
  fileSize: string;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export type FileSystemItem =
  | { type: "folder"; data: DocumentFolder }
  | { type: "file"; data: DocumentFile };
