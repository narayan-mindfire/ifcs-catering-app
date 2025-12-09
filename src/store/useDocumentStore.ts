import { create } from "zustand";
import apiClient from "../api/axiosClient";
import {
  DocumentFolder,
  DocumentFile,
  FileSystemItem,
} from "../types/documents";

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
      const folderParams: Record<string, any> = {
        limit: 100,
        offset: 0,
      };

      if (folderId) {
        folderParams.parentId = folderId;
      }

      const foldersPromise = apiClient.get("/documents/folders", {
        params: folderParams,
      });

      let filesPromise: Promise<any>;
      let folderDetailsPromise: Promise<any> | null = null;

      if (folderId) {
        filesPromise = apiClient.get(`/documents/folders/${folderId}/files`, {
          params: { limit: 100 },
        });

        folderDetailsPromise = apiClient.get(`/documents/folders/${folderId}`);
      } else {
        filesPromise = Promise.resolve({ data: { data: [] } });
      }

      const promises = folderDetailsPromise
        ? [foldersPromise, filesPromise, folderDetailsPromise]
        : [foldersPromise, filesPromise];

      const results = await Promise.all(promises);

      const foldersRes = results[0];
      const filesRes = results[1];
      const folderDetailsRes = folderId ? results[2] : null;

      const folders: FileSystemItem[] = (foldersRes.data.data || []).map(
        (f: DocumentFolder) => ({
          type: "folder" as const,
          data: f,
        }),
      );

      const files: FileSystemItem[] = (filesRes.data.data || []).map(
        (f: DocumentFile) => ({
          type: "file" as const,
          data: f,
        }),
      );

      let breadcrumbs: { id: string; name: string }[] = [];
      if (folderDetailsRes?.data?.data?.hierarchy) {
        breadcrumbs = folderDetailsRes.data.data.hierarchy.map(
          (h: DocumentFolder) => ({
            id: h.id,
            name: h.name,
          }),
        );
        const currentFolder = folderDetailsRes.data.data;
        if (breadcrumbs[breadcrumbs.length - 1]?.id !== currentFolder.id) {
          breadcrumbs.push({ id: currentFolder.id, name: currentFolder.name });
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
        error: err.response?.data?.message || "Failed to load documents",
        isLoading: false,
        items: [],
      });
    }
  },

  searchDocuments: async (query: string) => {
    console.log("[SEARCH] Starting global search for:", query);
    set({ isLoading: true, error: null });

    try {
      const folderPromise = apiClient.get("/documents/folders", {
        params: { name: query, limit: 50 },
      });

      const filePromise = apiClient.get("/documents/files", {
        params: { name: query, limit: 50 },
      });

      const [folderRes, fileRes] = await Promise.all([
        folderPromise,
        filePromise,
      ]);

      const folders: FileSystemItem[] = (folderRes.data.data || []).map(
        (f: DocumentFolder) => ({
          type: "folder" as const,
          data: f,
        }),
      );

      const files: FileSystemItem[] = (fileRes.data.data || []).map(
        (f: DocumentFile) => ({
          type: "file" as const,
          data: f,
        }),
      );

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
      const response = await apiClient.get(
        `/documents/files/${fileId}/download`,
      );
      const { url } = response.data.data;
      console.log("[SUCCESS] Download URL:", url);
      set({ isDownloading: false });
      return url;
    } catch (err: any) {
      console.error("[ERROR] Download failed:", err);
      set({ isDownloading: false, error: "Download failed" });
    }
  },
}));
