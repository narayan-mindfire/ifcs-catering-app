import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Pdf from "react-native-pdf";

import { RotateRightIcon } from "@/assets/icons";
import { DocumentFile } from "@/types/documents";
import { log } from "@/utils/logger";

import { ViewerHeader } from "./ViewerHeader";

interface ViewerProps {
  file: DocumentFile;
  onDownload: () => void;
  isDownloading: boolean;
}

export const PdfViewer: React.FC<ViewerProps> = ({
  file,
  onDownload,
  isDownloading,
}) => {
  const pdfRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
    setTotalPages(0);
    setScale(1.0);
    setRotation(0);
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

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3.0));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <View className="flex-1 bg-bg-surface rounded-xl overflow-hidden border border-border-muted ml-5">
      <ViewerHeader
        title={file.name}
        tags={file.tags}
        onDownload={onDownload}
        isDownloading={isDownloading}
        fileUrl={file.url}
      >
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
          className={`p-2 mx-0.5 bg-bg-surface border border-border-muted rounded-lg justify-center items-center ${
            currentPage <= 1 ? "opacity-50" : ""
          }`}
        >
          <Text className="text-text-secondary font-bold">{"<"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNextPage}
          disabled={currentPage >= totalPages}
          className={`p-2 mx-0.5 bg-bg-surface border border-border-muted rounded-lg justify-center items-center ${
            currentPage >= totalPages ? "opacity-50" : ""
          }`}
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

        <TouchableOpacity
          onPress={handleRotate}
          className="p-2 bg-bg-surface border border-border-muted rounded-lg justify-center items-center"
        >
          <RotateRightIcon color="#4F4B58" />
        </TouchableOpacity>
      </ViewerHeader>

      <View className="flex-1 bg-bg-tertiary justify-center items-center overflow-hidden">
        {/* FIX APPLIED:
           1. Removed `horizontal` prop.
           2. Added `justify-center items-center` to parent View to keep PDF centered when rotated.
           3. Simplified style.
        */}
        <Pdf
          ref={pdfRef}
          source={{ uri: file.url, cache: true }}
          scale={scale}
          minScale={0.5}
          maxScale={3.0}
          onLoadComplete={(numberOfPages) => setTotalPages(numberOfPages)}
          onPageChanged={(page) => setCurrentPage(page)}
          onScaleChanged={(newScale) => setScale(newScale)}
          onError={(error) => log.error("PDF load error", error)}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            transform: [{ rotate: `${rotation}deg` }],
          }}
        />
      </View>
    </View>
  );
};
