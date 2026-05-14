import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import {
  FolderIcon,
  ImageThinIcon,
  PdfIcon,
  VideoThinIcon,
} from "@/assets/icons";
import { DocumentFile, FileSystemItem } from "@/types/documents";

interface FileSystemListItemProps {
  item: FileSystemItem;
  isSelected: boolean;
  onPress: () => void;
}

const EXTENSION_MIME_MAP: Record<string, string> = {
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

const getActualMimeType = (file: DocumentFile): string => {
  const urlExtension = file.url.split(".").pop()?.toLowerCase().split("?")[0];
  if (urlExtension && EXTENSION_MIME_MAP[urlExtension]) {
    return EXTENSION_MIME_MAP[urlExtension];
  }
  return file.mimeType;
};

const getFileType = (mimeType: string): "pdf" | "image" | "video" | "other" => {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "other";
};

// eslint-disable-next-line react/display-name
export const FileSystemListItem: React.FC<FileSystemListItemProps> = React.memo(
  ({ item, isSelected, onPress }) => {
    const isFolder = item.type === "folder";
    const displayName = item.data.name;
    const iconColor = isSelected ? "#602AF3" : "#A09CAB";

    const FileIcon = useMemo(() => {
      if (isFolder)
        return <FolderIcon color={iconColor} height={24} width={24} />;

      const actualMimeType = getActualMimeType(item.data as DocumentFile);
      const fileType = getFileType(actualMimeType);

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
    }, [isFolder, iconColor, item.data]);

    return (
      <TouchableOpacity
        onPress={onPress}
        className={`flex-row items-center py-3 px-4 rounded-xl mb-2 border ${
          isSelected
            ? "bg-bg-accent/30 border-border-accent"
            : "bg-bg-quaternary border-transparent"
        }`}
      >
        {FileIcon}
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
  },
);
