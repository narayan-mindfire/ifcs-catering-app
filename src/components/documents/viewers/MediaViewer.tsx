import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { NoMemoIcon } from "@/assets/icons";
import { DocumentFile } from "@/types/documents";

import { ImageViewer } from "./ImageViewer";
import { PdfViewer } from "./PdfViewer";
import { VideoViewer } from "./VideoViewer";

interface ViewerProps {
  file: DocumentFile | null;
  onDownload: () => void;
  isDownloading: boolean;
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

export const MediaViewer: React.FC<ViewerProps> = ({
  file,
  onDownload,
  isDownloading,
}) => {
  if (!file) {
    return (
      <View className="flex-1 bg-bg-surface rounded-xl justify-center items-center border border-border-muted ml-5">
        <NoMemoIcon />
        <Text className="text-text-tertiary mt-5 text-base">
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
