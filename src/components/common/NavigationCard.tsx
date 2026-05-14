import { BlurView } from "expo-blur";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { RedirectIcon } from "../../assets/icons";

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
      className="relative rounded-xl p-[15px] w-[48%] aspect-[1.5] overflow-hidden justify-start border border-white/20 bg-black/5"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <BlurView
        intensity={20}
        tint="dark"
        className="absolute inset-0 rounded-xl"
      />

      <View className="absolute top-2.5 right-3">
        <RedirectIcon fill="white" fillOpacity={0.7} width={20} height={20} />
      </View>

      <View className="items-start relative z-10">
        <IconComponent width={36} height={36} fill="white" className="mb-1" />
        <View className="flex-row items-baseline mt-2">
          <Text className="text-xl md:text-2xl text-white font-medium">
            {title}
          </Text>
          {count && (
            <Text className="text-xl md:text-2xl text-white/80 ml-2">
              ({count})
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
