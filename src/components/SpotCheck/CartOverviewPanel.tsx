import React from "react";
import { Text, View } from "react-native";

interface CartOverviewPanelProps {
  title: string;
}

export const CartOverviewPanel: React.FC<CartOverviewPanelProps> = React.memo(
  ({ title }) => {
    return (
      <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 justify-between">
        <Text className="text-lg font-medium text-text-primary mb-4">
          {title} | G200 | F2001
        </Text>
        <View className="flex-1 items-center justify-center">
          <View className="w-48 h-32 bg-gray-200 border-2 border-gray-300 rounded-lg items-center justify-center">
            <Text className="text-gray-400">Cart Image</Text>
          </View>
        </View>
      </View>
    );
  },
);
CartOverviewPanel.displayName = "CartOverviewPanel";
