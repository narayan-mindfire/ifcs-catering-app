import React from "react";
import { Text, View } from "react-native";

export interface CompletedCheckItem {
  id: string;
  flight: string;
  route: string;
  departure: string;
  galley: string;
  stowage: string;
  category: string;
  carrier: string;
  name: string;
  info: string;
  time: string;
  status: "Pass" | "Fail";
}

interface Props {
  item: CompletedCheckItem;
  isLastItem: boolean;
}

export const CompletedCheckListItem: React.FC<Props> = React.memo(
  ({ item, isLastItem }) => {
    const rowStyle = isLastItem
      ? "rounded-b-xl border-b-0"
      : "border-b border-border-muted";

    const statusColor =
      item.status === "Pass" ? "text-green-500" : "text-red-500";

    return (
      <View
        className={`flex-row px-4 py-4 bg-bg-surface items-center ${rowStyle}`}
      >
        <Text className="flex-[0.7] text-base text-text-secondary">
          {item.flight}
        </Text>
        <Text className="flex-[0.8] text-base text-text-secondary">
          {item.route}
        </Text>
        <Text className="flex-[0.8] text-base text-text-secondary">
          {item.departure}
        </Text>
        <Text className="flex-[0.5] text-center text-base text-text-secondary">
          {item.galley}
        </Text>
        <Text className="flex-[0.6] text-base text-text-secondary">
          {item.stowage}
        </Text>
        <Text className="flex-[1.5] text-base text-text-secondary font-medium pr-2">
          {item.category}
        </Text>
        <Text className="flex-[1] text-base text-text-secondary">
          {item.carrier}
        </Text>
        <Text
          className={`flex-[0.6] text-base font-bold text-right ${statusColor}`}
        >
          {item.status}
        </Text>
      </View>
    );
  },
);
CompletedCheckListItem.displayName = "CompletedCheckListItem";
