import { create } from "zustand";
import {
  DocumentFolder,
  DocumentFile,
  FileSystemItem,
} from "../types/documents";
import { documentService } from "../services/documentService";

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

export const useDocumentStore = create<DocumentState>((set, get) => ({
  currentFolderId: null,
  breadcrumbs: [],
  items: [],
  selectedFile: null,
  isLoading: false,
  isDownloading: false,
  error: null,

  fetchFolderContent: async (folderId: string | null) => {
    console.log(
      "📁 [FETCH] Starting fetchFolderContent for:",
      folderId || "ROOT",
    );
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

        // Ensure current folder is in breadcrumbs
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
    console.log("[SEARCH] Starting global search for:", query);
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
      const url = await documentService.getDownloadUrl(fileId);
      console.log("[SUCCESS] Download URL:", url);
      set({ isDownloading: false });
      // Note: The original code returned the URL, but the store return type is Promise<void>.
      // If the component expects the URL, we might need to adjust the interface or component logic.
      // Assuming component handles the download trigger if the URL is returned.
      return url as any;
    } catch (err: any) {
      console.error("[ERROR] Download failed:", err);
      set({ isDownloading: false, error: "Download failed" });
    }
  },
}));
