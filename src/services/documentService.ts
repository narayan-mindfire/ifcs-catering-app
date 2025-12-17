import apiClient from "../api/axiosClient";
import { DocumentFolder, DocumentFile } from "../types/documents";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}

export const documentService = {
  getFolders: async (
    parentId?: string | null,
    search?: string,
  ): Promise<DocumentFolder[]> => {
    const params: Record<string, any> = {
      limit: search ? 50 : 100,
      offset: 0,
    };

    if (parentId) {
      params.parentId = parentId;
    }
    if (search) {
      params.name = search;
    }

    const response = await apiClient.get<ApiResponse<DocumentFolder[]>>(
      "/documents/folders",
      { params },
    );
    return response.data.data || [];
  },

  getFolderFiles: async (folderId: string): Promise<DocumentFile[]> => {
    const response = await apiClient.get<ApiResponse<DocumentFile[]>>(
      `/documents/folders/${folderId}/files`,
      {
        params: { limit: 100 },
      },
    );
    return response.data.data || [];
  },

  getFolderDetails: async (folderId: string): Promise<DocumentFolder> => {
    const response = await apiClient.get<ApiResponse<DocumentFolder>>(
      `/documents/folders/${folderId}`,
    );
    return response.data.data;
  },

  searchFiles: async (query: string): Promise<DocumentFile[]> => {
    const response = await apiClient.get<ApiResponse<DocumentFile[]>>(
      "/documents/files",
      {
        params: { name: query, limit: 50 },
      },
    );
    return response.data.data || [];
  },

  getDownloadUrl: async (fileId: string): Promise<string> => {
    const response = await apiClient.get(`/documents/files/${fileId}/download`);
    return response.data.data.url;
  },
};
