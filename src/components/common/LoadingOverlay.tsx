import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
  transparent?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  transparent = true,
}) => {
  if (!visible) return null;

  return (
    <View
      style={[
        styles.container,
        transparent ? styles.transparent : styles.opaque,
      ]}
    >
      <ActivityIndicator size="large" color="#602AF3" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  transparent: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  opaque: {
    backgroundColor: "white",
  },
});
