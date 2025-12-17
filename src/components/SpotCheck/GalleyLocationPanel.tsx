import React, { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface GalleyLocationPanelProps {
  selectedGalley: string;
  onSelectGalley: (galley: string) => void;
}

const GalleyButton = React.memo(
  ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-lg border ${
        selected
          ? "bg-[#5046e5]/10 border-[#5046e5]"
          : "bg-gray-100 border-gray-200"
      }`}
    >
      <Text
        className={`font-medium ${
          selected ? "text-[#5046e5]" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  ),
);
GalleyButton.displayName = "GalleyButton";

export const GalleyLocationPanel: React.FC<GalleyLocationPanelProps> =
  React.memo(({ selectedGalley, onSelectGalley }) => {
    const handleSelect = useCallback(
      (galley: string) => () => onSelectGalley(galley),
      [onSelectGalley],
    );

    return (
      <View className="flex-[0.8] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <Text className="text-lg font-medium text-text-primary mb-6">
          Galley Locations in Aircraft
        </Text>
        <View className="flex-1 relative items-center">
          <View className="absolute inset-0 items-center justify-center opacity-10">
            <View className="w-20 h-full bg-gray-300 rounded-full" />
          </View>
          <View className="w-full h-full justify-between py-4 px-2">
            <View className="flex-row justify-between w-full mb-10">
              <GalleyButton
                label="G100"
                selected={selectedGalley === "G100"}
                onPress={handleSelect("G100")}
              />
              <GalleyButton
                label="G200"
                selected={selectedGalley === "G200"}
                onPress={handleSelect("G200")}
              />
            </View>
            <View className="flex-row justify-between w-full mt-auto mb-20">
              <GalleyButton
                label="G300"
                selected={selectedGalley === "G300"}
                onPress={handleSelect("G300")}
              />
              <GalleyButton
                label="G400"
                selected={selectedGalley === "G400"}
                onPress={handleSelect("G400")}
              />
            </View>
            <View className="flex-row justify-center gap-4">
              <GalleyButton
                label="Bulk"
                selected={selectedGalley === "Bulk"}
                onPress={handleSelect("Bulk")}
              />
              <GalleyButton
                label="Belly"
                selected={selectedGalley === "Belly"}
                onPress={handleSelect("Belly")}
              />
            </View>
          </View>
        </View>
      </View>
    );
  });
GalleyLocationPanel.displayName = "GalleyLocationPanel";
