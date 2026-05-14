import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { RedirectDarkIcon } from "@/assets/icons";

interface CheckItem {
  id: string;
  code: string;
  name: string;
  category: string;
  status: string;
}

interface SpotCheckListItemProps {
  item: CheckItem;
  isLastItem: boolean;
  onPress: (item: CheckItem) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "text-orange-400";
    case "Passed":
      return "text-green-500";
    case "Failed":
      return "text-red-500";
    default:
      return "text-text-muted";
  }
};

export const SpotCheckListItem: React.FC<SpotCheckListItemProps> = React.memo(
  ({ item, isLastItem, onPress }) => {
    const rowStyle = isLastItem
      ? "rounded-b-xl border-b-0"
      : "border-b border-border-muted";

    return (
      <View
        className={`flex-row px-4 py-4 bg-bg-surface items-center ${rowStyle}`}
      >
        <Text className="flex-[1.2] text-base text-text-secondary">
          {item.code}
        </Text>
        <Text className="flex-[0.8] text-left text-base text-text-secondary font-medium">
          {item.name}
        </Text>
        <Text className="flex-[0.8] text-base text-text-secondary">
          {item.category}
        </Text>
        <Text
          className={`flex-[0.8] text-base font-medium ${getStatusColor(
            item.status,
          )}`}
        >
          {item.status}
        </Text>
        <View className="flex-[0.5] items-end">
          <TouchableOpacity onPress={() => onPress(item)}>
            <RedirectDarkIcon width={25} height={25} />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);
SpotCheckListItem.displayName = "SpotCheckListItem";
