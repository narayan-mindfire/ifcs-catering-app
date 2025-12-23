import * as Print from "expo-print";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { DownloadIcon, PrintIcon, ThreeDotsIcon } from "../../../assets/icons";

interface ViewerHeaderProps {
  title: string;
  onDownload: () => void;
  isDownloading: boolean;
  fileUrl?: string;
  children?: React.ReactNode;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  title,
  onDownload,
  isDownloading,
  fileUrl,
  children,
}) => {
  const handlePrint = async () => {
    try {
      if (!fileUrl) {
        Alert.alert("Error", "No file URL available for printing");
        return;
      }

      // Print functionality is mainly for mobile
      if (Platform.OS !== "web") {
        await Print.printAsync({
          uri: fileUrl,
        });
      } else {
        // For web, open print dialog
        window.print();
      }
    } catch (error) {
      console.error("Print error:", error);
      Alert.alert("Print Error", "Failed to print the document");
    }
  };

  return (
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
        <TouchableOpacity className="p-2" onPress={handlePrint}>
          <PrintIcon color="#4F4B58" />
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          <ThreeDotsIcon color="#4F4B58" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
