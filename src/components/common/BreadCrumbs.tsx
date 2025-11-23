import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface GenericBreadcrumbProps {
  items: BreadcrumbItem[];
}

export const BreadCrumb: React.FC<GenericBreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View className="flex-row items-center px-6 py-3 bg-bg-surface w-full border-b border-b-[#e1e8ed]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const hasAction = !!item.onPress && !isLast;

        if (isLast) {
          return (
            <React.Fragment key={index}>
              <Text className="text-[22px] text-[#3a3939] font-bold">
                {item.label}
              </Text>
            </React.Fragment>
          );
        }

        const itemContent = (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            disabled={!hasAction}
            className="mx-1"
          >
            <Text
              className={`text-lg ${
                hasAction
                  ? "text-[#6e6d6dff] font-medium"
                  : "text-[#232222ff] font-normal"
              }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );

        const separator = !isLast && (
          <Text className="text-lg text-[#999999] mx-2">›</Text>
        );

        return (
          <React.Fragment key={index}>
            {itemContent}
            {separator}
          </React.Fragment>
        );
      })}
    </View>
  );
};
