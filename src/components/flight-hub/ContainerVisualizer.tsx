import React, { useState, useEffect } from "react";
import { View, Image, Pressable, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { PackingStandardContainer } from "../../types/preparations";

interface DrawerItemProps {
  isOpen: boolean;
  positionTop: number;
  originalIndex: number;
  imageUrl?: string | null;
  label?: string;
  onPress: () => void;
}

const DrawerItem: React.FC<DrawerItemProps> = ({
  isOpen,
  positionTop,
  originalIndex,
  imageUrl,
  label,
  onPress,
}) => {
  const translateX = useSharedValue(isOpen ? 0 : -15);

  useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : -15, {
      duration: 200,
      easing: Easing.linear,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={{
        position: "absolute",
        top: `${isOpen ? positionTop - 1 : positionTop}%`,
        left: "32%",
        width: isOpen ? "94%" : "79%",
        height: 40,
        zIndex: isOpen ? 100 : 10,
      }}
    >
      <Animated.View style={[{ width: "100%", height: "100%" }, animatedStyle]}>
        <Image
          source={imageUrl ? { uri: imageUrl } : undefined}
          className="w-full h-full"
          resizeMode="contain"
        />
        {label && (
          <View
            className={`absolute bg-black/50 px-1 rounded ${
              isOpen ? "top-[40%] left-[42%]" : "top-[30%] left-[10%]"
            }`}
          >
            <Text className="text-white text-[8px] font-bold">{label}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

interface ContainerProps {
  cabinetFrameImg?: string | null;
  drawersData: PackingStandardContainer[];
  numberOfDrawers?: number;
  defaultOpenDrawer?: number | null;
  onDrawerClick: (drawerIndex: number | null) => void;
}

export const ContainerVisualizer: React.FC<ContainerProps> = ({
  cabinetFrameImg,
  drawersData = [],
  numberOfDrawers = 0,
  defaultOpenDrawer = 0,
  onDrawerClick,
}) => {
  const [openDrawerIndex, setOpenDrawerIndex] = useState<number | null>(
    defaultOpenDrawer,
  );

  // Sync prop changes
  useEffect(() => {
    setOpenDrawerIndex(defaultOpenDrawer);
  }, [defaultOpenDrawer]);

  let drawerPositions = [40, 58];

  if (numberOfDrawers > 2) {
    const start = 22;
    const end = 62;
    const spacing = (end - start) / (numberOfDrawers - 1);
    drawerPositions = Array.from(
      { length: numberOfDrawers },
      (_, i) => start + spacing * i,
    );
  }

  const drawers = drawersData.slice(0, numberOfDrawers);
  const reversedDrawers = [...drawers].reverse();
  const reversedPositions = [...drawerPositions].reverse();

  return (
    <View className="relative w-[180px] h-[250px] items-center justify-center">
      <Image
        source={cabinetFrameImg ? { uri: cabinetFrameImg } : undefined}
        className="h-full w-full"
        resizeMode="contain"
      />

      {reversedDrawers.map((drawer, index) => {
        const originalIndex = numberOfDrawers - 1 - index;
        const isOpen = openDrawerIndex === originalIndex;
        const positionTop = reversedPositions[index];

        return (
          <DrawerItem
            key={drawer.id} // Use ID instead of index for better React keys
            isOpen={isOpen}
            positionTop={positionTop}
            originalIndex={originalIndex}
            // Updated property access for new PackingStandardContainer type
            imageUrl={
              isOpen
                ? drawer.equipmentItem?.pictureOpen
                : drawer.equipmentItem?.pictureClosed
            }
            label={drawer.name}
            onPress={() => {
              const newIndex = isOpen ? null : originalIndex;
              setOpenDrawerIndex(newIndex);
              onDrawerClick(newIndex);
            }}
          />
        );
      })}
    </View>
  );
};
