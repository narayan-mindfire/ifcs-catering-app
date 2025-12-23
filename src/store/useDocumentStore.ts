import { create } from "zustand";

import { downloadFileHelper } from "../components/documents/downloadHelper";
import { documentService } from "../services/documentService";
import {
  DocumentFile,
  DocumentFolder,
  FileSystemItem,
} from "../types/documents";
import { log } from "../utils/logger";

interface DocumentState {
  currentFolderId: string | null;
  breadcrumbs: { id: string; name: string }[];
  items: FileSystemItem[];
  selectedFile: DocumentFile | null;
  isLoading: boolean;
  isDownloading: boolean;
  error: string | null;

  fetchFolderContent: (folderId: string | null) => Promise<void>;
  searchDocuments: (query: string) => Promise<void>;
  selectFile: (file: DocumentFile | null) => void;
  downloadFile: (fileId: string, fileName: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set, _get) => ({
  currentFolderId: null,
  breadcrumbs: [],
  items: [],
  selectedFile: null,
  isLoading: false,
  isDownloading: false,
  error: null,

  fetchFolderContent: async (folderId: string | null) => {
    log.info("📁 [FETCH] Starting fetchFolderContent for:", folderId || "ROOT");
    set({ isLoading: true, error: null, currentFolderId: folderId });

    try {
      const foldersPromise = documentService.getFolders(folderId);

      let filesPromise: Promise<DocumentFile[]>;
      let folderDetailsPromise: Promise<DocumentFolder | null> | null = null;

      if (folderId) {
        filesPromise = documentService.getFolderFiles(folderId);
        folderDetailsPromise = documentService.getFolderDetails(folderId);
      } else {
        filesPromise = Promise.resolve([]);
      }

      const [foldersData, filesData, folderDetailsData] = await Promise.all([
        foldersPromise,
        filesPromise,
        folderDetailsPromise ? folderDetailsPromise : Promise.resolve(null),
      ]);

      const folders: FileSystemItem[] = foldersData.map((f) => ({
        type: "folder" as const,
        data: f,
      }));

      const files: FileSystemItem[] = filesData.map((f) => ({
        type: "file" as const,
        data: f,
      }));

      let breadcrumbs: { id: string; name: string }[] = [];
      if (folderDetailsData && folderDetailsData.hierarchy) {
        breadcrumbs = folderDetailsData.hierarchy.map((h: any) => ({
          id: h.id,
          name: h.name,
        }));

        if (breadcrumbs[breadcrumbs.length - 1]?.id !== folderDetailsData.id) {
          breadcrumbs.push({
            id: folderDetailsData.id,
            name: folderDetailsData.name,
          });
        }
      }

      set({
        items: [...folders, ...files],
        breadcrumbs,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("[ERROR] Fetch Documents Error:", err);
      set({
        error: err.message || "Failed to load documents",
        isLoading: false,
        items: [],
      });
    }
  },

  searchDocuments: async (query: string) => {
    log.info("[SEARCH] Starting global search for:", query);
    set({ isLoading: true, error: null });

    try {
      const [foldersData, filesData] = await Promise.all([
        documentService.getFolders(null, query),
        documentService.searchFiles(query),
      ]);

      const folders: FileSystemItem[] = foldersData.map((f) => ({
        type: "folder" as const,
        data: f,
      }));

      const files: FileSystemItem[] = filesData.map((f) => ({
        type: "file" as const,
        data: f,
      }));

      set({
        items: [...folders, ...files],
        breadcrumbs: [{ id: "search-results", name: "Search Results" }],
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("[ERROR] Search Error:", err);
      set({
        error: "Failed to perform search",
        isLoading: false,
        items: [],
      });
    }
  },

  selectFile: (file) => {
    set({ selectedFile: file });
  },

  downloadFile: async (fileId, fileName) => {
    set({ isDownloading: true });
    try {
      // 1. Get the signed URL from your API
      const url = await documentService.getDownloadUrl(fileId);

      if (!url) {
        throw new Error("Failed to retrieve download URL");
      }

      log.info("[STORE] URL Fetched, starting file download...");

      // 2. TRIGGER THE HELPER
      // This was missing in your original code!
      const success = await downloadFileHelper(url, fileName);

      if (!success) {
        throw new Error("File system download failed");
      }
    } catch (err: any) {
      console.error("[ERROR] Download workflow failed:", err);
      set({ error: "Download failed" });
    } finally {
      set({ isDownloading: false });
    }
  },
}));
