import React from "react";
import { render } from "@testing-library/react-native";
import DocumentsScreen from "../../src/screens/DocumentsScreen";
import { useDocumentStore } from "../../src/store/useDocumentStore";
import { NavigationContainer } from "@react-navigation/native";

// Mock useDocumentStore
jest.mock("../../src/store/useDocumentStore");

// Mock sub-components
jest.mock("../../src/components/common/BreadCrumbs", () => ({
  BreadCrumb: () => null,
}));
jest.mock("../../src/components/documents/DocumentList", () => ({
  DocumentList: () => null,
}));
jest.mock("../../src/components/documents/viewers/MediaViewer", () => ({
  MediaViewer: () => null,
}));

describe("DocumentsScreen", () => {
  const mockFetchFolderContent = jest.fn();
  const mockSelectFile = jest.fn();

  beforeEach(() => {
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      currentFolderId: null,
      breadcrumbs: [],
      items: [],
      selectedFile: null,
      isLoading: false,
      isDownloading: false,
      error: null,
      fetchFolderContent: mockFetchFolderContent,
      searchDocuments: jest.fn(),
      selectFile: mockSelectFile,
      downloadFile: jest.fn(),
    });
    jest.clearAllMocks();
  });

  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockRoute = {
    params: {},
  };

  it("renders correctly and fetches root folder on mount", () => {
    render(
      <NavigationContainer>
        <DocumentsScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </NavigationContainer>
    );

    expect(mockFetchFolderContent).toHaveBeenCalledWith(null);
  });

  it("shows error message when error exists in store", () => {
    (useDocumentStore as unknown as jest.Mock).mockReturnValue({
      currentFolderId: null,
      breadcrumbs: [],
      items: [],
      selectedFile: null,
      isLoading: false,
      isDownloading: false,
      error: "Failed to load documents",
      fetchFolderContent: mockFetchFolderContent,
      searchDocuments: jest.fn(),
      selectFile: mockSelectFile,
      downloadFile: jest.fn(),
    });

    const { getByText } = render(
      <NavigationContainer>
        <DocumentsScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </NavigationContainer>
    );

    expect(getByText("Failed to load documents")).toBeTruthy();
    expect(getByText("Retry")).toBeTruthy();
  });
});
