import { Audio } from "expo-av";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

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
  useEffect(() => {
    const enableAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          interruptionModeIOS: 1,
          interruptionModeAndroid: 1,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error("Failed to set audio mode", error);
      }
    };

    enableAudio();
  }, []);

  // 2. Initialize the Modern Player
  const player = useVideoPlayer(file.url, (playerInstance) => {
    playerInstance.loop = false;
    playerInstance.play(); // Auto-play when loaded
  });

  return (
    <View className="flex-1 bg-bg-surface rounded-xl overflow-hidden border border-border-muted ml-5">
      <ViewerHeader
        title={file.name}
        onDownload={onDownload}
        isDownloading={isDownloading}
        fileUrl={file.url}
        showPrint={false}
      />
      <View className="flex-1 bg-bg-tertiary justify-center items-center">
        <VideoView
          player={player}
          style={styles.video}
          allowsFullscreen
          allowsPictureInPicture
          nativeControls={true}
          contentFit="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  video: {
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").height * 0.7,
  },
});
