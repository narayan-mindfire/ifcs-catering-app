import { BlurView } from "expo-blur";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { RedirectIcon } from "../../assets/icons";

const { width } = Dimensions.get("window");

const isLargeScreen = width > 1024;
const titleFontSize = isLargeScreen ? 24 : 20;
const countFontSize = isLargeScreen ? 24 : 20;

interface NavigationCardProps {
  title: string;
  IconComponent: React.FC<SvgProps>;
  count?: string;
  onPress: () => void;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
  title,
  IconComponent,
  count,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="rounded-xl p-[15px] w-[48%] aspect-[1.5] overflow-hidden justify-start border border-[#ffffff7c] bg-[#0000000d]"
      onPress={onPress}
    >
      <BlurView
        intensity={20}
        tint="dark"
        className="absolute inset-0 rounded-xl"
      />
      <RedirectIcon
        style={{ position: "absolute", top: 10, right: 15 }}
        fill="rgba(255, 255, 255, 0.7)"
        width={24}
        height={24}
      />
      <View className="items-start">
        <IconComponent width={40} height={40} style={{ marginBottom: 4 }} />
        <View className="flex-row items-baseline mt-2">
          <Text
            className="font-medium text-white"
            style={{ fontSize: titleFontSize }}
          >
            {title}
          </Text>
          {count && (
            <Text
              className="text-white ml-[6px]"
              style={{ fontSize: countFontSize }}
            >
              ({count})
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
