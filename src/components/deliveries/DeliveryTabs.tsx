import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export type TabType =
  | "dispatcher"
  | "preparers"
  | "security"
  | "driver"
  | "crew";

interface TabButtonProps {
  title: string;
  active: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = React.memo(
  ({ title, active, onPress }) => (
    <Pressable
      onPress={onPress}
      className={`py-2.5 px-5 rounded-[20px] ${
        active ? "bg-bg-accent border-bg-button border-[0.5px]" : ""
      }`}
    >
      <Text
        className={`text-lg ${
          active ? "text-text-primary font-semibold" : "text-text-secondary"
        }`}
      >
        {title}
      </Text>
    </Pressable>
  ),
);

TabButton.displayName = "TabButton";

interface DeliveryTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const DeliveryTabs: React.FC<DeliveryTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View className="p-4 pb-0 bg-bg-surface h-[60px] w-auto">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          backgroundColor: "#f0f0f0",
          borderRadius: 25,
          padding: 1,
          alignItems: "center",
          minWidth: "100%",
          justifyContent: "space-between",
        }}
      >
        <TabButton
          title="Security Seals"
          active={activeTab === "preparers"}
          onPress={() => onTabChange("preparers")}
        />
        <TabButton
          title="Security Declaration"
          active={activeTab === "security"}
          onPress={() => onTabChange("security")}
        />
        <TabButton
          title="Driver Declaration"
          active={activeTab === "driver"}
          onPress={() => onTabChange("driver")}
        />
        <TabButton
          title="Crew Declaration"
          active={activeTab === "crew"}
          onPress={() => onTabChange("crew")}
        />
      </ScrollView>
    </View>
  );
};
