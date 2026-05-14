import React from "react";
import { Text, View } from "react-native";

import { QrIcon } from "@/assets/icons";
import { AppButton } from "@/components/common/AppButton";

interface FlightInfo {
  flight: string;
  route: string;
  date: string;
  aircraft: string;
  acReg: string;
  destination: string;
}

interface SpotCheckHeaderProps {
  flightInfo: FlightInfo;
  onScanPress: () => void;
}

export const SpotCheckHeader: React.FC<SpotCheckHeaderProps> = React.memo(
  ({ onScanPress }) => {
    return (
      <View className="my-6">
        {/* Top Section: Flight Info & Scan Button */}
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-1 flex-row flex-wrap gap-x-6 gap-y-2 px-1">
            <Text className="font-rubik text-3xl font-[500]">
              COMPLETE CHECKS
            </Text>
          </View>

          <View className="ml-2">
            <AppButton
              title="Scan Code"
              onPress={onScanPress}
              type="accent"
              IconComponent={<QrIcon width={20} height={20} />}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
              }}
              textStyle={{ fontSize: 14, color: "black" }}
            />
          </View>
        </View>

        {/* Table Header Row (Completed Checks Columns Only) */}
        <View className="bg-bg-tertiary rounded-t-xl flex-row px-4 py-3 border-b border-border-muted">
          <Text className="flex-[0.7] text-lg font-semibold text-text-primary">
            Flight
          </Text>
          <Text className="flex-[0.8] text-lg font-semibold text-text-primary">
            Route
          </Text>
          <Text className="flex-[0.8] text-lg font-semibold text-text-primary">
            Departure
          </Text>
          <Text className="flex-[0.5] text-lg font-semibold text-text-primary">
            Galley
          </Text>
          <Text className="flex-[0.6] text-lg font-semibold text-text-primary">
            Stowage
          </Text>
          <Text className="flex-[1.5] text-lg font-semibold text-text-primary">
            Category
          </Text>
          <Text className="flex-[1] text-lg font-semibold text-text-primary">
            Carrier
          </Text>
          <Text className="flex-[0.6] text-lg font-semibold text-text-primary text-right">
            Status
          </Text>
        </View>
      </View>
    );
  },
);
SpotCheckHeader.displayName = "SpotCheckHeader";
