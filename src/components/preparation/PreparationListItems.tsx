import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import {
  BoxIcon,
  BoxIconTrue,
  CheckIcon,
  CheckIconTrue,
  DeliveryIcon,
  DeliveryIconTrue,
  InfoIcon,
  LockOpenIcon,
  QrIcon,
  StringIcon,
  StringIconTrue,
} from "../../assets/icons";
import { PreparationItem } from "../../types/preparations";

interface PreparationListItemProps {
  item: PreparationItem;
  isUpdating: boolean;
  onOpenPdf: (item: PreparationItem) => void;
  onPreparedAction: (item: PreparationItem) => void;
  onSealAction: (item: PreparationItem) => void;
  onAssemblyAction: (item: PreparationItem) => void;
  onLoadAction: (item: PreparationItem) => void;
  onOpenDetailModal: (item: PreparationItem) => void;
}

export const PreparationListItem: React.FC<PreparationListItemProps> =
  // eslint-disable-next-line react/display-name
  React.memo(
    ({
      item,
      isUpdating,
      onOpenPdf,
      onPreparedAction,
      onSealAction,
      onAssemblyAction,
      onLoadAction,
      onOpenDetailModal,
    }) => {
      const isPrepared = !!item.isContentPrepared;
      const isSealed = !!item.sealTagNumber && item.sealTagNumber !== "";
      const isAssembled = item.assemblyProcessFlag === "true";
      const isLoaded = item.loadedTruckFlag === "true";

      const isLockActive = item.isLockRequired && isAssembled;
      const isSealActive = item.isSealRequired && isAssembled;
      const { PreparedIcon, SealIcon, AssemblyIcon, LoadIcon } = useMemo(() => {
        return {
          PreparedIcon: isPrepared ? BoxIconTrue : BoxIcon,
          SealIcon: isSealed ? StringIconTrue : StringIcon,
          AssemblyIcon: isAssembled ? CheckIconTrue : CheckIcon,
          LoadIcon: isLoaded ? DeliveryIconTrue : DeliveryIcon,
        };
      }, [isPrepared, isSealed, isAssembled, isLoaded]);

      return (
        <View className="flex-row items-center px-4 py-2 border-b border-bg-tertiary bg-bg-surface">
          <View className="flex-[2] justify-center">
            <Text className="text-lg text-text-primary font-semibold">
              {item.stowage || item.position || "N/A"}
            </Text>
          </View>
          <View className="flex-[3] justify-center">
            <Text className="text-lg text-text-primary">
              {item.carrier || item.name || item.nameDisplay || "N/A"}
            </Text>
          </View>
          <View className="flex-[4] flex-row justify-end items-center gap-5">
            <TouchableOpacity onPress={() => onOpenPdf(item)}>
              <QrIcon height={30} width={30} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onPreparedAction(item)}
              disabled={isUpdating}
            >
              <PreparedIcon height={30} width={30} />
            </TouchableOpacity>

            {/* Seal Action */}
            <TouchableOpacity
              onPress={() => onSealAction(item)}
              // Disabled if updating OR if seal is not required
              disabled={isUpdating || !item.isSealRequired}
            >
              <View style={{ position: "relative" }}>
                <SealIcon
                  height={30}
                  width={30}
                  color={isSealActive ? "#008000" : "#9CA3AF"}
                  style={{ opacity: isSealActive ? 1 : 0.6 }}
                />
                {!item.isSealRequired && (
                  <View
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 0,
                      right: 0,
                      height: 2,
                      backgroundColor: "#EF4444",
                      transform: [{ rotate: "-45deg" }],
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* Lock Action (Currently display only) */}
            <TouchableOpacity
              disabled={true}
              // If you ever attach an onPress, remember to use:
              // disabled={true || !item.isLockRequired}
            >
              <View style={{ position: "relative" }}>
                <LockOpenIcon
                  height={30}
                  width={30}
                  color={isLockActive ? "#008000" : "#9CA3AF"}
                  style={{ opacity: isLockActive ? 1 : 0.6 }}
                />
                {!item.isLockRequired && (
                  <View
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 0,
                      right: 0,
                      height: 2,
                      backgroundColor: "#EF4444",
                      transform: [{ rotate: "-45deg" }],
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onAssemblyAction(item)}
              disabled={isUpdating}
            >
              <AssemblyIcon height={30} width={30} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onLoadAction(item)}
              disabled={isUpdating}
            >
              <LoadIcon height={30} width={30} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onOpenDetailModal(item)}>
              <InfoIcon height={30} width={30} />
            </TouchableOpacity>
          </View>
        </View>
      );
    },
  );
