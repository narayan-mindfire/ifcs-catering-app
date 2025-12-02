import React from "react";
import { View, Text } from "react-native";
import { LockIcon, StringIcon, CheckIcon } from "../../assets/icons";

interface StatusRowProps {
  isLocked: boolean;
  isSealed: boolean;
  isCompleted: boolean;
}

export const StatusRow: React.FC<StatusRowProps> = ({
  isLocked,
  isSealed,
  isCompleted,
}) => {
  const statuses = [
    { label: "Locked", icon: LockIcon, isActive: isLocked },
    { label: "Sealed", icon: StringIcon, isActive: isSealed },
    { label: "Completed", icon: CheckIcon, isActive: isCompleted },
  ];

  return (
    <View className="flex-row justify-between gap-2 mt-4">
      {statuses.map((status, idx) => (
        <View
          key={idx}
          className={`flex-1 flex-row items-center justify-between border border-border-muted rounded-full px-3 py-2 bg-bg-tertiary`}
        >
          <View className="flex-row items-center gap-2">
            {/* Render Icon Component or Image */}
            {typeof status.icon === "function" ? (
              <status.icon width={16} height={16} />
            ) : null}
            <Text className="text-sm font-light text-text-primary">
              {status.label}
            </Text>
          </View>

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
        </View>
      ))}
    </View>
  );
};
