import React, { useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { DocumentFile } from "../../../types/documents";
import { ViewerHeader } from "./ViewerHeader";

interface ViewerProps {
  file: DocumentFile;
  onDownload: () => void;
  isDownloading: boolean;
}

export const VideoViewer: React.FC<ViewerProps> = ({
  file,
  onDownload,
  isDownloading,
}) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  console.log(status);

  return (
    <View className="flex-1 bg-bg-surface rounded-xl overflow-hidden border border-border-muted ml-5">
      <ViewerHeader
        title={file.name}
        onDownload={onDownload}
        isDownloading={isDownloading}
      />
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
          onPlaybackStatusUpdate={(newStatus) => setStatus(newStatus)}
        />
      </View>
    </View>
  );
};
