import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { DownloadIcon, PrintIcon, ThreeDotsIcon } from "../../../assets/icons";

interface ViewerHeaderProps {
  title: string;
  onDownload: () => void;
  isDownloading: boolean;
  children?: React.ReactNode;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  title,
  onDownload,
  isDownloading,
  children,
}) => (
  <View className="flex-row justify-between items-center px-5 py-3 border-b border-border-muted bg-bg-quaternary">
    <View className="flex-1 mr-4">
      <Text
        className="text-xl font-semibold text-text-primary"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </View>

    <View className="flex-row items-center">{children}</View>

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
);
