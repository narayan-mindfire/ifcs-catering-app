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

import { DownloadIcon, PrintIcon } from "../../../assets/icons";

interface ViewerHeaderProps {
  title: string;
  onDownload: () => void;
  isDownloading: boolean;
  fileUrl?: string;
  children?: React.ReactNode;
  showPrint?: boolean;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  title,
  onDownload,
  isDownloading,
  fileUrl,
  children,
  showPrint = true,
}) => {
  const handlePrint = async () => {
    try {
      if (!fileUrl) {
        Alert.alert("Error", "No file URL available for printing");
        return;
      }

      if (Platform.OS !== "web") {
        await Print.printAsync({
          uri: fileUrl,
        });
      } else {
        window.print();
      }
    } catch (error: any) {
      console.error("Print error:", error);
      // Suppress error alert if it's likely a user cancellation or benign issue
      if (
        error?.message?.toLowerCase().includes("cancel") ||
        error?.message?.toLowerCase().includes("dismiss") ||
        error?.message?.toLowerCase().includes("printing did not complete")
      ) {
        return;
      }
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
        {showPrint && (
          <TouchableOpacity className="p-2" onPress={handlePrint}>
            <PrintIcon color="#4F4B58" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
