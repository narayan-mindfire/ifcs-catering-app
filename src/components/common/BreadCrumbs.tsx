import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface BreadcrumbItem {
  label: string;
  onPress?: () => void;
}

interface GenericBreadcrumbProps {
  items: BreadcrumbItem[];
  /**
   * Optional custom handler for the back button.
   * If not provided, it defaults to navigation.goBack()
   */
  onBackPress?: () => void;
}

export const BreadCrumb: React.FC<GenericBreadcrumbProps> = ({
  items,
  onBackPress,
}) => {
  const navigation = useNavigation();

  if (!items || items.length === 0) {
    return null;
  }

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  return (
    <View className="flex-row items-center px-6 py-3 bg-bg-surface w-full border-b border-b-[#e1e8ed]">
      {/* Back Button Section */}
      <TouchableOpacity
        onPress={handleBack}
        className="mr-4 pr-4 border-r border-[#e1e8ed]"
        activeOpacity={0.7}
      >
        {/* You can replace this Text with an Icon, e.g., <ChevronLeft size={24} color="#3a3939" /> */}
        <Text className="text-[22px] text-[#3a3939] font-bold">←</Text>
      </TouchableOpacity>

      {/* Breadcrumb Items */}
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
