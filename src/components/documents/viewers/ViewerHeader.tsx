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

import { DownloadIcon, PrintIcon } from "@/assets/icons";
import { Tag } from "@/types/documents";
import { log } from "@/utils/logger";

interface ViewerHeaderProps {
  title: string;
  tags?: Tag[];
  onDownload: () => void;
  isDownloading: boolean;
  fileUrl?: string;
  children?: React.ReactNode;
  showPrint?: boolean;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  title,
  tags,
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
      log.error("Print error:", error);
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
        {tags && tags.length > 0 && (
          <View className="flex-row flex-wrap mb-1">
            {tags.map((tag) => (
              <View
                key={tag.id}
                className="bg-bg-accent/70 rounded-md px-1.5 py-0.5 mr-1 mb-1 border border-bg-accent/20"
              >
                <Text className="text-[9px] text-text-muted font-bold uppercase">
                  {tag.name}
                </Text>
              </View>
            ))}
          </View>
        )}
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
