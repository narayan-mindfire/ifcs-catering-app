import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { CartProps, PackingStandardContainer } from "@/types/preparations";

interface DrawerProps {
  isOpen: boolean;
  onClick: () => void;
  drawer?: PackingStandardContainer;
  position: { top: number };
  drawerName?: string;
}

function Drawer({
  isOpen,
  onClick,
  position,
  drawer,
  drawerName,
}: DrawerProps) {
  const imageUrl = isOpen
    ? drawer?.equipmentItem?.pictureOpen
    : drawer?.equipmentItem?.pictureClosed;

  const translateX = useSharedValue(isOpen ? 0 : -15);

  useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : -15, {
      duration: 220,
      easing: Easing.out(Easing.ease),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onClick}
      style={{
        position: "absolute",
        left: "29.5%",
        top: `${position.top + 12}%`,
        zIndex: isOpen ? 10 : 5,
        width: isOpen ? "68%" : "72%",
        height: "8%",
        transform: [{ translateX: isOpen ? -70 * 0.6 : -49 * 0.6 }],
      }}
      className="justify-center items-center"
    >
      <Animated.View
        style={[
          {
            width: "100%",
            height: "100%",
            transform: [{ scale: 0.75 }],
          },
          animatedStyle,
        ]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
            alt={drawerName || "drawer"}
          />
        ) : (
          <View className="w-full h-full bg-gray-300 rounded-sm border border-gray-400" />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

export const OvenVisualizer: React.FC<CartProps> = ({
  cabinetFrameImg,
  drawers = [],
  numberOfDrawers = 0,
  defaultOpenDrawer = 0,
  onDrawerClick,
}) => {
  const [openDrawerIndex, setOpenDrawerIndex] = useState<number | null>(
    defaultOpenDrawer,
  );

  useEffect(() => {
    setOpenDrawerIndex(defaultOpenDrawer);
  }, [defaultOpenDrawer]);

  const drawerPositions = [
    { top: 5.5 },
    { top: 13.5 },
    { top: 21.5 },
    { top: 29.5 },
    { top: 37.5 },
    { top: 45 },
    { top: 53.5 },
    { top: 61.5 },
  ];

  const reversedDrawers = [...drawers].reverse();
  const reversedPositions = [...drawerPositions].reverse();

  return (
    <View className="relative w-[300px] h-[400px] justify-center items-center mx-auto">
      <View className="relative w-full h-full justify-center items-center">
        {cabinetFrameImg && (
          <Image
            source={{ uri: cabinetFrameImg }}
            className="w-[70%] h-[95%]"
            resizeMode="contain"
          />
        )}

        {reversedDrawers.map((drawer, index) => {
          const actualCount = drawers.length;
          const originalIndex = actualCount - 1 - index;
          const calcIndex =
            numberOfDrawers > 0 ? numberOfDrawers - 1 - index : originalIndex;

          const pos = reversedPositions[index] || { top: 0 };

          return (
            <Drawer
              key={drawer.id}
              isOpen={openDrawerIndex === calcIndex}
              onClick={() => {
                const newIndex =
                  openDrawerIndex === calcIndex ? null : calcIndex;
                setOpenDrawerIndex(newIndex);
                onDrawerClick(newIndex, newIndex !== null ? drawer : null);
              }}
              drawer={drawer}
              position={pos}
              drawerName={drawer.name}
            />
          );
        })}
      </View>
    </View>
  );
};
