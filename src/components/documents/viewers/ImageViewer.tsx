import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { RotateRightIcon } from "../../../assets/icons";
import { DocumentFile } from "../../../types/documents";
import { ViewerHeader } from "./ViewerHeader";

interface ViewerProps {
  file: DocumentFile;
  onDownload: () => void;
  isDownloading: boolean;
}

export const ImageViewer: React.FC<ViewerProps> = ({
  file,
  onDownload,
  isDownloading,
}) => {
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);

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
