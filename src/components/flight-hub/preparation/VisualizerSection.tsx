import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import {
  PackingStandard,
  PackingStandardContainer,
} from "../../../types/preparations";
import { CartVisualizer } from "../CartVisulaizer";
import { ContainerVisualizer } from "../ContainerVisualizer";
import { OvenVisualizer } from "../OvenVisualizer";

interface VisualizerSectionProps {
  positionImage?: string | null;
  derivedEquipmentType: string;
  packingStd: PackingStandard | null | undefined;
  drawersToRender: PackingStandardContainer[];
  activeDrawerIndex: number | null;
  handleDrawerClick: (
    index: number | null,
    data: PackingStandardContainer | null,
  ) => void;
  viewMode: "front" | "rear";
  setViewMode: (mode: "front" | "rear") => void;
  setActiveDrawerIndex: (index: number | null) => void;
  hasDirectionalDrawers: boolean;
}

export const VisualizerSection: React.FC<VisualizerSectionProps> = ({
  positionImage,
  derivedEquipmentType,
  packingStd,
  drawersToRender,
  activeDrawerIndex,
  handleDrawerClick,
  viewMode,
  setViewMode,
  setActiveDrawerIndex,
  hasDirectionalDrawers,
}) => {
  return (
    <View className="flex-[2] gap-4">
      <View className="flex-1 bg-bg-surface rounded-2xl p-4 flex-row gap-4 border border-border-muted">
        <View className="flex-1 items-center justify-center">
          {positionImage ? (
            <Image
              source={{ uri: positionImage }}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <Text className="text-text-tertiary">No Position Image</Text>
          )}
        </View>
        <View className="flex-1 items-center justify-center">
          {derivedEquipmentType === "Atlas" ||
          derivedEquipmentType === "Container" ? (
            <ContainerVisualizer
              cabinetFrameImg={packingStd?.equipmentItem?.picture}
              numberOfDrawers={drawersToRender.length}
              drawersData={drawersToRender}
              defaultOpenDrawer={activeDrawerIndex}
              onDrawerClick={(idx: number | null) =>
                idx !== null && drawersToRender[idx]
                  ? handleDrawerClick(idx, drawersToRender[idx])
                  : handleDrawerClick(null, null)
              }
            />
          ) : derivedEquipmentType === "Cart" ? (
            <CartVisualizer
              cabinetFrameImg={packingStd?.equipmentItem?.picture}
              numberOfDrawers={drawersToRender.length}
              drawers={drawersToRender}
              defaultOpenDrawer={activeDrawerIndex}
              onDrawerClick={handleDrawerClick}
            />
          ) : derivedEquipmentType === "Oven" ||
            derivedEquipmentType === "Oven Insert" ? (
            <OvenVisualizer
              cabinetFrameImg={packingStd?.equipmentItem?.picture}
              numberOfDrawers={drawersToRender.length}
              drawers={drawersToRender}
              defaultOpenDrawer={activeDrawerIndex}
              onDrawerClick={handleDrawerClick}
            />
          ) : (
            <Image
              source={{
                uri: packingStd?.equipmentItem?.picture || "",
              }}
              className="w-full h-full"
              resizeMode="contain"
            />
          )}
        </View>
      </View>

      {hasDirectionalDrawers && (
        <View className="flex-row justify-center gap-4">
          <TouchableOpacity
            onPress={() => {
              setViewMode("front");
              setActiveDrawerIndex(null);
            }}
            className={`px-8 py-2 rounded-full border ${
              viewMode === "front"
                ? "bg-bg-button border-bg-button"
                : "bg-white border-border-muted"
            }`}
          >
            <Text
              className={`font-bold ${
                viewMode === "front" ? "text-white" : "text-text-tertiary"
              }`}
            >
              FRONT
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setViewMode("rear");
              setActiveDrawerIndex(null);
            }}
            className={`px-8 py-2 rounded-full border ${
              viewMode === "rear"
                ? "bg-bg-button border-bg-button"
                : "bg-white border-border-muted"
            }`}
          >
            <Text
              className={`font-bold ${
                viewMode === "rear" ? "text-white" : "text-text-tertiary"
              }`}
            >
              REAR
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
