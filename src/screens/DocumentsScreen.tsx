import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import Pdf from "react-native-pdf";
import { Video, ResizeMode } from "expo-av";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { useDocumentStore } from "../store/useDocumentStore";
import { DocumentFile, FileSystemItem } from "../types/documents";

import { BreadCrumb } from "../components/common/BreadCrumbs";

import {
  PdfIcon,
  FolderIcon,
  FilterIcon,
  UploadIcon,
  DownloadIcon,
  PrintIcon,
  ThreeDotsIcon,
  RotateRightIcon,
  ImageThinIcon,
  VideoThinIcon,
} from "../assets/icons";

const getActualMimeType = (file: DocumentFile): string => {
  const urlExtension = file.url.split(".").pop()?.toLowerCase().split("?")[0];

  const extensionMimeMap: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    svg: "image/svg+xml",
    pdf: "application/pdf",
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    webm: "video/webm",
    mkv: "video/x-matroska",
    m4v: "video/x-m4v",
  };

  if (urlExtension && extensionMimeMap[urlExtension]) {
    return extensionMimeMap[urlExtension];
  }

  return file.mimeType;
};

const getFileType = (mimeType: string): "pdf" | "image" | "video" | "other" => {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "other";
};

const FileSystemListItem: React.FC<{
  item: FileSystemItem;
  isSelected: boolean;
  onPress: () => void;
}> = ({ item, isSelected, onPress }) => {
  const isFolder = item.type === "folder";
  const displayName = item.data.name;
  const iconColor = isSelected ? "#602AF3" : "#A09CAB";

  const getFileIcon = () => {
    if (isFolder)
      return <FolderIcon color={iconColor} height={24} width={24} />;

    const actualMimeType = getActualMimeType(item.data as DocumentFile);
    const fileType = getFileType(actualMimeType);
    console.log("FILE TYPE: ", fileType);
    switch (fileType) {
      case "pdf":
        return <PdfIcon color={iconColor} />;
      case "image":
        return <ImageThinIcon color={iconColor} width={24} height={24} />;
      case "video":
        return <VideoThinIcon color={iconColor} />;
      default:
        return <PdfIcon color={iconColor} />;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center py-3 px-4 rounded-xl mb-2 border ${
        isSelected
          ? "bg-bg-accent/30 border-border-accent"
          : "bg-bg-quaternary border-transparent"
      }`}
    >
      {getFileIcon()}
      <View className="flex-1 ml-3">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={`text-base font-medium ${
            isSelected ? "text-bg-button" : "text-text-secondary"
          }`}
        >
          {displayName}
        </Text>
        {isFolder && "filesCount" in item.data && (
          <Text className="text-xs text-text-tertiary mt-0.5">
            {item.data.filesCount || 0} items
          </Text>
        )}
      </View>
      <View className="w-5 items-center">
        {isSelected && !isFolder && (
          <Text className="text-lg text-bg-button font-semibold">›</Text>
        )}
        {isFolder && (
          <Text className="text-lg text-text-tertiary font-semibold">›</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const DocumentList: React.FC<{
  items: FileSystemItem[];
  selectedFile: DocumentFile | null;
  onSelectItem: (item: FileSystemItem) => void;
  onNavigateUp: () => void;
  isLoading: boolean;
  currentFolderId: string | null;
  searchQuery: string;
  onSearchChange: (text: string) => void;
}> = ({
  items,
  selectedFile,
  onSelectItem,
  onNavigateUp,
  isLoading,
  currentFolderId,
  searchQuery,
  onSearchChange,
}) => {
  const folders = items.filter((item) => item.type === "folder");
  const files = items.filter((item) => item.type === "file");

  const isSearching = searchQuery.length > 0;

  return (
    <View className="w-80 bg-bg-surface p-4 rounded-xl h-full shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-text-primary">
          Documents ({items.length})
        </Text>
        {currentFolderId && !isSearching && (
          <TouchableOpacity
            onPress={onNavigateUp}
            className="py-1 px-3 rounded-lg bg-bg-tertiary"
          >
            <Text className="text-sm text-text-secondary font-medium">
              ← Back
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row items-center bg-bg-tertiary rounded-lg px-2 mb-3 h-10">
        <TextInput
          className="flex-1 h-full text-base text-text-primary mr-2"
          placeholder="Search..."
          placeholderTextColor="#A09CAB"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        <TouchableOpacity className="p-2">
          <FilterIcon width={15} height={15} />
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          <UploadIcon />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#602AF3" />
          <Text className="text-text-tertiary mt-2">
            {isSearching ? "Searching..." : "Loading..."}
          </Text>
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-text-tertiary text-center px-4">
            {isSearching
              ? `No results found for "${searchQuery}"`
              : "This folder is empty"}
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {folders.length > 0 && (
            <View className="mb-2">
              <Text className="text-xs text-text-tertiary font-semibold mb-2 px-1">
                FOLDERS ({folders.length})
              </Text>
              {folders.map((item) => (
                <FileSystemListItem
                  key={item.data.id}
                  item={item}
                  isSelected={false}
                  onPress={() => onSelectItem(item)}
                />
              ))}
            </View>
          )}

          {files.length > 0 && (
            <View>
              <Text className="text-xs text-text-tertiary font-semibold mb-2 px-1">
                FILES ({files.length})
              </Text>
              {files.map((item) => (
                <FileSystemListItem
                  key={item.data.id}
                  item={item}
                  isSelected={
                    selectedFile?.id === item.data.id && item.type === "file"
                  }
                  onPress={() => onSelectItem(item)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const ImageViewer: React.FC<{
  file: DocumentFile;
  onDownload: () => void;
  isDownloading: boolean;
}> = ({ file, onDownload, isDownloading }) => {
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <View className="flex-1 bg-bg-surface rounded-xl overflow-hidden border border-border-muted ml-5">
      <View className="flex-row justify-between items-center px-5 py-3 border-b border-border-muted bg-bg-quaternary">
        <View className="flex-1 mr-4">
          <Text
            className="text-xl font-semibold text-text-primary"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {file.name}
          </Text>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleZoomOut}
            className="p-2 mx-0.5 bg-bg-surface border border-border-muted rounded-lg justify-center items-center"
          >
            <Text className="text-text-secondary font-bold">-</Text>
          </TouchableOpacity>
          <Text className="text-base text-text-secondary font-medium mx-2">
            {Math.round(scale * 100)}%
          </Text>
          <TouchableOpacity
            onPress={handleZoomIn}
            className="p-2 mx-0.5 bg-bg-surface border border-border-muted rounded-lg justify-center items-center"
          >
            <Text className="text-text-secondary font-bold">+</Text>
          </TouchableOpacity>

          <View className="w-px h-6 bg-border-secondary mx-3" />

          <TouchableOpacity
            onPress={handleRotate}
            className="p-2 bg-bg-surface border border-border-muted rounded-lg justify-center items-center"
          >
            <RotateRightIcon color="#4F4B58" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center ml-4 gap-2">
          <TouchableOpacity
            onPress={onDownload}
            disabled={isDownloading}
            className="p-2"
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color="#4F4B58" />
            ) : (
              <DownloadIcon color="#4F4B58" />
            )}
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <PrintIcon color="#4F4B58" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <ThreeDotsIcon color="#4F4B58" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        className="flex-1 bg-bg-tertiary"
      >
        <Image
          source={{ uri: file.url }}
          style={{
            width: Dimensions.get("window").width * 0.6 * scale,
            height: Dimensions.get("window").height * 0.7 * scale,
            transform: [{ rotate: `${rotation}deg` }],
          }}
          resizeMode="contain"
        />
      </ScrollView>
    </View>
  );
};

const VideoViewer: React.FC<{
  file: DocumentFile;
  onDownload: () => void;
  isDownloading: boolean;
}> = ({ file, onDownload, isDownloading }) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  console.log(status);

  return (
    <View className="flex-1 bg-bg-surface rounded-xl overflow-hidden border border-border-muted ml-5">
      <View className="flex-row justify-between items-center px-5 py-3 border-b border-border-muted bg-bg-quaternary">
        <View className="flex-1 mr-4">
          <Text
            className="text-xl font-semibold text-text-primary"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {file.name}
          </Text>
        </View>

        <View className="flex-row items-center ml-4 gap-2">
          <TouchableOpacity
            onPress={onDownload}
            disabled={isDownloading}
            className="p-2"
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color="#4F4B58" />
            ) : (
              <DownloadIcon color="#4F4B58" />
            )}
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <ThreeDotsIcon color="#4F4B58" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 bg-bg-tertiary justify-center items-center">
        <Video
          ref={videoRef}
          source={{ uri: file.url }}
          style={{
            width: Dimensions.get("window").width * 0.7,
            height: Dimensions.get("window").height * 0.7,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status: any) => setStatus(() => status)}
        />
      </View>
    </View>
  );
};

const PdfViewer: React.FC<{
  file: DocumentFile;
  onDownload: () => void;
  isDownloading: boolean;
}> = ({ file, onDownload, isDownloading }) => {
  const pdfRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(0);
    setScale(1.0);
  }, [file]);

  const handlePrevPage = () => {
    if (pdfRef.current && currentPage > 1) {
      const newPage = currentPage - 1;
      pdfRef.current.setPage(newPage);
      setCurrentPage(newPage);
    }
  };

  const handleNextPage = () => {
    if (pdfRef.current && currentPage < totalPages) {
      const newPage = currentPage + 1;
      pdfRef.current.setPage(newPage);
      setCurrentPage(newPage);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  return (
    <View className="flex-1 bg-bg-surface rounded-xl overflow-hidden border border-border-muted ml-5">
      <View className="flex-row justify-between items-center px-5 py-3 border-b border-border-muted bg-bg-quaternary">
        <View className="flex-1 mr-4">
          <Text
            className="text-xl font-semibold text-text-primary"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {file.name}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="flex-row items-center mr-3 bg-bg-surface border border-border-muted rounded-lg px-2 py-1">
            <Text className="text-base text-text-secondary">Page:</Text>
            <Text className="text-base font-semibold text-text-primary mx-1">
              {currentPage}
            </Text>
            <Text className="text-base text-text-secondary">/</Text>
            <Text className="text-base font-semibold text-text-primary mx-1">
              {totalPages || "--"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handlePrevPage}
            disabled={currentPage <= 1}
            className={`p-2 mx-0.5 bg-bg-surface border border-border-muted rounded-lg justify-center items-center ${currentPage <= 1 ? "opacity-50" : ""}`}
          >
            <Text className="text-text-secondary font-bold">{"<"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNextPage}
            disabled={currentPage >= totalPages}
            className={`p-2 mx-0.5 bg-bg-surface border border-border-muted rounded-lg justify-center items-center ${currentPage >= totalPages ? "opacity-50" : ""}`}
          >
            <Text className="text-text-secondary font-bold">{">"}</Text>
          </TouchableOpacity>

          <View className="w-px h-6 bg-border-secondary mx-3" />

          <TouchableOpacity
            onPress={handleZoomOut}
            className="p-2 mx-0.5 bg-bg-surface border border-border-muted rounded-lg justify-center items-center"
          >
            <Text className="text-text-secondary font-bold">-</Text>
          </TouchableOpacity>
          <Text className="text-base text-text-secondary font-medium mx-2">
            {Math.round(scale * 100)}%
          </Text>
          <TouchableOpacity
            onPress={handleZoomIn}
            className="p-2 mx-0.5 bg-bg-surface border border-border-muted rounded-lg justify-center items-center"
          >
            <Text className="text-text-secondary font-bold">+</Text>
          </TouchableOpacity>

          <View className="w-px h-6 bg-border-secondary mx-3" />

          <TouchableOpacity className="p-2 bg-bg-surface border border-border-muted rounded-lg justify-center items-center">
            <RotateRightIcon color="#4F4B58" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center ml-4 gap-2">
          <TouchableOpacity
            onPress={onDownload}
            disabled={isDownloading}
            className="p-2"
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color="#4F4B58" />
            ) : (
              <DownloadIcon color="#4F4B58" />
            )}
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <PrintIcon color="#4F4B58" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <ThreeDotsIcon color="#4F4B58" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 bg-bg-tertiary">
        <Pdf
          ref={pdfRef}
          source={{ uri: file.url, cache: true }}
          scale={scale}
          minScale={0.5}
          maxScale={3.0}
          onLoadComplete={(numberOfPages) => {
            setTotalPages(numberOfPages);
          }}
          onPageChanged={(page) => {
            setCurrentPage(page);
          }}
          onScaleChanged={(newScale) => {
            setScale(newScale);
          }}
          onError={(error) => {
            console.error("PDF load error", error);
          }}
          style={{ flex: 1, width: "100%", height: "100%" }}
        />
      </View>
    </View>
  );
};

const MediaViewer: React.FC<{
  file: DocumentFile | null;
  onDownload: () => void;
  isDownloading: boolean;
}> = ({ file, onDownload, isDownloading }) => {
  if (!file) {
    return (
      <View className="flex-1 bg-bg-surface rounded-xl justify-center items-center border border-border-muted ml-5">
        <Text className="text-text-tertiary text-base">
          Select a document to view
        </Text>
      </View>
    );
  }

  const actualMimeType = getActualMimeType(file);
  const fileType = getFileType(actualMimeType);

  switch (fileType) {
    case "pdf":
      return (
        <PdfViewer
          file={file}
          onDownload={onDownload}
          isDownloading={isDownloading}
        />
      );
    case "image":
      return (
        <ImageViewer
          file={file}
          onDownload={onDownload}
          isDownloading={isDownloading}
        />
      );
    case "video":
      return (
        <VideoViewer
          file={file}
          onDownload={onDownload}
          isDownloading={isDownloading}
        />
      );
    default:
      return (
        <View className="flex-1 bg-bg-surface rounded-xl justify-center items-center border border-border-muted ml-5">
          <Text className="text-text-tertiary text-base mb-2">
            Preview not available for this file type
          </Text>
          <Text className="text-text-tertiary text-sm">
            Declared type: {file.mimeType}
          </Text>
          <Text className="text-text-tertiary text-sm mb-4">
            Detected type: {actualMimeType}
          </Text>
          <TouchableOpacity
            onPress={onDownload}
            disabled={isDownloading}
            className="mt-4 bg-bg-button px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">
              {isDownloading ? "Downloading..." : "Download File"}
            </Text>
          </TouchableOpacity>
        </View>
      );
  }
};

// --- MAIN DOCUMENTS SCREEN ---
type DocumentsScreenRouteProp = RouteProp<RootStackParamList, "Documents">;
interface DocumentsScreenProps {
  route: DocumentsScreenRouteProp;
  navigation: any;
}

const DocumentsScreen: React.FC<DocumentsScreenProps> = ({
  route,
  navigation,
}) => {
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
  } = useDocumentStore();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchFolderContent(null);
  }, [fetchFolderContent]);

  useEffect(() => {
    if (debouncedSearchTimer.current) {
      clearTimeout(debouncedSearchTimer.current);
    }

    if (searchQuery.trim().length > 0) {
      debouncedSearchTimer.current = setTimeout(() => {
        searchDocuments(searchQuery);
      }, 500);
    } else if (
      searchQuery === "" &&
      items.length > 0 &&
      breadcrumbs[0]?.id === "search-results"
    ) {
      fetchFolderContent(null);
    }

    return () => {
      if (debouncedSearchTimer.current) {
        clearTimeout(debouncedSearchTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSelectItem = (item: FileSystemItem) => {
    if (item.type === "folder") {
      setSearchQuery("");
      fetchFolderContent(item.data.id);
      selectFile(null);
    } else {
      selectFile(item.data as DocumentFile);
    }
  };

  const handleNavigateUp = () => {
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
  };

  const handleDownload = async () => {
    if (selectedFile) {
      await downloadFile(selectedFile.id, selectedFile.name);
    }
  };

  const breadcrumbItems = [
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
    breadcrumbItems.push({
      label: selectedFile.name,
      onPress: () => {},
    });
  }

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
          items={items}
          selectedFile={selectedFile}
          onSelectItem={handleSelectItem}
          onNavigateUp={handleNavigateUp}
          isLoading={isLoading}
          currentFolderId={currentFolderId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <MediaViewer
          file={selectedFile}
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />
      </View>
    </View>
  );
};

export default DocumentsScreen;
