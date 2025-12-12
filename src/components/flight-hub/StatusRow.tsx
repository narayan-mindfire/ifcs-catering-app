import React from "react";
import { View, Text } from "react-native";
import { LockIcon, StringIcon, CheckIcon } from "../../assets/icons";

interface StatusRowProps {
  isLocked: boolean;
  isSealed: boolean;
  isPrepared: boolean;
  lockRequired: boolean;
}

export const StatusRow: React.FC<StatusRowProps> = ({
  isLocked,
  isSealed,
  isPrepared,
  lockRequired,
}) => {
  const statuses = [
    { label: "Locked", icon: LockIcon, isActive: isLocked },
    { label: "Sealed", icon: StringIcon, isActive: isSealed },
    { label: "Prepared", icon: CheckIcon, isActive: isPrepared },
  ];

  return (
    <View className="flex-row justify-between gap-2 mt-4">
      {statuses.map((status, idx) => (
        <View
          key={idx}
          className={`flex-1 flex-row items-center justify-between border border-border-muted rounded-full px-3 py-2 bg-bg-tertiary`}
        >
          <View className="flex-row items-center gap-2">
            {typeof status.icon === "function" ? (
              // 1. Create a wrapper View here to isolate the Icon context
              <View className="relative items-center justify-center">
                {status.label === "Locked" && !lockRequired && (
                  <View
                    className="absolute h-[2px] bg-red-500"
                    style={{
                      // 2. Center the line and make it slightly wider than the icon
                      width: "140%",
                      top: "50%",
                      transform: [
                        { translateY: -1 }, // Offset half the height (2px) to center perfectly
                        { rotate: "-45deg" },
                      ],
                      zIndex: 10,
                    }}
                  />
                )}
                <status.icon width={16} height={16} />
              </View>
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
