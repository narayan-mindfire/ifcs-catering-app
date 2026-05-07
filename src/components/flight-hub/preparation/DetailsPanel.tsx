import React from "react";
import { Text, View } from "react-native";

interface DetailsPanelProps {
  galleyPosition?: string | null;
  door?: string | null;
  position?: string | null;
  equipment?: string | null;
  activeDrawerEquipmentItemName?: string | null;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({
  galleyPosition,
  door,
  position,
  equipment,
  activeDrawerEquipmentItemName,
}) => {
  return (
    <View className="bg-bg-surface rounded-xl p-4 mt-4 border border-border-muted flex-row gap-4">
      <View className="flex-1 gap-y-3">
        <View>
          <Text className="text-text-secondary text-xs">Galley</Text>
          <Text className="text-text-primary font-bold">
            {galleyPosition || "N/A"}
          </Text>
        </View>
        <View>
          <Text className="text-text-secondary text-xs">Door</Text>
          <Text className="text-text-primary font-bold">{door || "N/A"}</Text>
        </View>
        <View>
          <Text className="text-text-secondary text-xs">Position</Text>
          <Text className="text-text-primary font-bold">
            {position || "N/A"}
          </Text>
        </View>
      </View>
      <View className="flex-1">
        <View>
          <Text className="text-text-secondary text-xs">Equipment</Text>
          <Text className="text-text-primary font-bold">
            {equipment || "N/A"}
          </Text>
        </View>
      </View>
      <View className="flex-1">
        <View>
          <Text className="text-text-secondary text-xs">Name</Text>
          <Text className="text-text-primary font-bold">
            {activeDrawerEquipmentItemName || "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );
};
