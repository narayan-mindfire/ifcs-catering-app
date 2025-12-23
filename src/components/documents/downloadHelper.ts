import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export const downloadFileHelper = async (
  url: string,
  fileName: string,
): Promise<boolean> => {
  try {
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileUri = `${FileSystem.documentDirectory}${cleanFileName}`;

    const downloadRes = await FileSystem.downloadAsync(url, fileUri);

    if (downloadRes.status !== 200) {
      throw new Error(`Download failed with status ${downloadRes.status}`);
    }
    const canShare = await Sharing.isAvailableAsync();

    if (canShare) {
      await Sharing.shareAsync(downloadRes.uri, {
        UTI: "com.adobe.pdf",
        mimeType: "application/pdf",
      });
      return true;
    } else {
      Alert.alert("Error", "Sharing is not available on this device");
      return false;
    }
  } catch (error) {
    console.error("Download helper error:", error);
    Alert.alert("Download Error", "Could not download file.");
    return false;
  }
};
