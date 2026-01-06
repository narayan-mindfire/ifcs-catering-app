import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { CheckIcon, LockIcon, StringIcon } from "../../assets/icons";

interface StatusRowProps {
  isLocked: boolean;
  isSealed: boolean;
  isPrepared: boolean;
  lockRequired: boolean;
  sealRequired: boolean;
  onPreparedPress: () => void;
  onSealedPress: () => void;
  onLockedPress: () => void;
  isUpdating?: boolean;
}

export const StatusRow: React.FC<StatusRowProps> = ({
  isLocked,
  isSealed,
  isPrepared,
  lockRequired,
  sealRequired,
  onPreparedPress,
  onSealedPress,
  onLockedPress,
  isUpdating = false,
}) => {
  const statuses = [
    {
      label: "Sealed",
      icon: StringIcon,
      isActive: isSealed,
      onPress: onSealedPress,
      disabled: !sealRequired || isUpdating,
    },
    {
      label: "Locked",
      icon: LockIcon,
      isActive: isLocked,
      onPress: onLockedPress,
      disabled: !lockRequired || isUpdating,
    },
    {
      label: "Prepared",
      icon: CheckIcon,
      isActive: isPrepared,
      onPress: onPreparedPress,
      disabled: isUpdating,
    },
  ];

  return (
    <View className="flex-row justify-between gap-2 mt-4">
      {statuses.map((status, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={status.onPress}
          disabled={status.disabled}
          activeOpacity={0.7}
          className={`flex-1 flex-row items-center justify-between border border-border-muted rounded-full px-3 py-2 ${
            status.disabled ? "bg-bg-quaternary opacity-60" : "bg-bg-tertiary"
          }`}
        >
          <View className="flex-row items-center gap-2">
            <View className="relative items-center justify-center">
              {status.disabled && !isUpdating && (
                <View
                  className="absolute h-[2px] bg-red-500"
                  style={{
                    width: "140%",
                    top: "50%",
                    transform: [{ translateY: -1 }, { rotate: "-45deg" }],
                    zIndex: 10,
                  }}
                />
              )}
              <status.icon
                width={16}
                height={16}
                color={status.disabled ? "#9CA3AF" : undefined}
              />
            </View>

            <Text
              className={`text-sm font-light ${
                status.disabled ? "text-text-tertiary" : "text-text-primary"
              }`}
            >
              {status.label}
            </Text>
          </View>

          {isUpdating ? (
            <ActivityIndicator size="small" color="#602AF3" />
          ) : (
            <View
              className={`h-4 w-4 rounded-full justify-center items-center ${
                status.isActive
                  ? "bg-green-500"
                  : "bg-bg-surface border border-text-muted"
              }`}
            >
              {status.isActive && (
                <Text className="text-white text-[10px] font-bold">✓</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};
