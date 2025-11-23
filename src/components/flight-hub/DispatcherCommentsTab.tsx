import React from "react";
import { View, Text } from "react-native";

const DispatcherCommentsTab: React.FC = () => {
  return (
    <View className="bg-bg-surface rounded-2xl border border-border-muted p-6 items-center">
      <Text className="text-lg text-text-tertiary">
        No dispatcher comments available.
      </Text>
    </View>
  );
};

export default DispatcherCommentsTab;
