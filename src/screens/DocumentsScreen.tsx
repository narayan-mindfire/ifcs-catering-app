import { RouteProp } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { BreadCrumb } from "../components/common/BreadCrumbs";
import { DocumentList } from "../components/documents/DocumentList";
import { FilterModal } from "../components/documents/FilterModal";
import { MediaViewer } from "../components/documents/viewers/MediaViewer";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useDocumentStore } from "../store/useDocumentStore";
import { DocumentFile, FileSystemItem } from "../types/documents";

type DocumentsScreenRouteProp = RouteProp<RootStackParamList, "Documents">;

interface DocumentsScreenProps {
  route: DocumentsScreenRouteProp;
  navigation: any;
}

const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ navigation }) => {
  const {
    currentFolderId,
    breadcrumbs,
    items,
    selectedFile,
    isLoading,
    isDownloading,
    error,
    fetchFolderContent,
    searchDocuments,
    selectFile,
    downloadFile,
    tagFilter,
    fileTypeFilter,
    departmentFilter,
  } = useDocumentStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const debouncedSearchTimer = useRef<NodeJS.Timeout | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (item.type === "folder") return true;
      const file = item.data as DocumentFile;

      if (tagFilter.trim()) {
        const hasTag = file.tags?.some((t) =>
          t.name.toLowerCase().includes(tagFilter.toLowerCase()),
        );
        if (!hasTag) return false;
      }

      if (fileTypeFilter !== "all") {
        if (!file.mimeType.startsWith(fileTypeFilter)) return false;
      }

      if (departmentFilter !== "all") {
        if (departmentFilter === "unassigned") {
          if (file.department) return false;
        } else if (file.department !== departmentFilter) {
          return false;
        }
      }

      return true;
    });
  }, [items, tagFilter, fileTypeFilter, departmentFilter]);

  useEffect(() => {
    fetchFolderContent(null);
    return () => {
      selectFile(null);
    };
  }, [fetchFolderContent, selectFile]);

  useEffect(() => {
    if (debouncedSearchTimer.current) {
      clearTimeout(debouncedSearchTimer.current);
    }

    if (searchQuery.trim().length > 0) {
      debouncedSearchTimer.current = setTimeout(() => {
        searchDocuments(searchQuery);
      }, 500);
    } else if (searchQuery === "" && breadcrumbs[0]?.id === "search-results") {
      fetchFolderContent(null);
    }

    return () => {
      if (debouncedSearchTimer.current) {
        clearTimeout(debouncedSearchTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchDocuments, fetchFolderContent]);

  const handleSelectItem = useCallback(
    (item: FileSystemItem) => {
      if (item.type === "folder") {
        setSearchQuery("");
        fetchFolderContent(item.data.id);
        selectFile(null);
      } else {
        selectFile(item.data as DocumentFile);
      }
    },
    [fetchFolderContent, selectFile],
  );

  const handleNavigateUp = useCallback(() => {
    if (breadcrumbs.length > 1) {
      if (breadcrumbs[0].id === "search-results") {
        setSearchQuery("");
        fetchFolderContent(null);
      } else {
        const parentFolder = breadcrumbs[breadcrumbs.length - 2];
        fetchFolderContent(parentFolder.id);
      }
    } else {
      fetchFolderContent(null);
    }
    selectFile(null);
  }, [breadcrumbs, fetchFolderContent, selectFile]);

  const handleDownload = useCallback(async () => {
    if (selectedFile) {
      await downloadFile(selectedFile.id, selectedFile.name);
    }
  }, [selectedFile, downloadFile]);

  const breadcrumbItems = useMemo(() => {
    const items = [
      {
        label: "Dashboard",
        onPress: () => navigation.navigate("Dashboard"),
      },
      {
        label: "Documents",
        onPress: () => {
          setSearchQuery("");
          fetchFolderContent(null);
          selectFile(null);
        },
      },
      ...breadcrumbs.map((crumb: any, index: any) => ({
        label: crumb.name,
        onPress:
          index < breadcrumbs.length - 1
            ? () => {
                if (crumb.id === "search-results") return;
                setSearchQuery("");
                fetchFolderContent(crumb.id);
                selectFile(null);
              }
            : undefined,
      })),
    ];

    if (selectedFile) {
      items.push({
        label: selectedFile.name,
        onPress: undefined,
      });
    }

    return items;
  }, [breadcrumbs, navigation, selectedFile, fetchFolderContent, selectFile]);

  if (error) {
    return (
      <View className="flex-1 bg-bg-quaternary justify-center items-center">
        <Text className="text-red-500 text-lg mb-4">{error}</Text>
        <TouchableOpacity
          onPress={() => fetchFolderContent(currentFolderId)}
          className="bg-bg-button px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg-quaternary">
      <BreadCrumb items={breadcrumbItems} />
      <View className="flex-1 flex-row p-5">
        <DocumentList
          items={filteredItems}
          selectedFile={selectedFile}
          onSelectItem={handleSelectItem}
          onNavigateUp={handleNavigateUp}
          isLoading={isLoading}
          currentFolderId={currentFolderId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterPress={() => setIsFilterModalOpen(true)}
        />
        <MediaViewer
          file={selectedFile}
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />
      </View>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </View>
  );
};

export default DocumentsScreen;
