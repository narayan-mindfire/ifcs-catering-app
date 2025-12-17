import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
  activeTab: "required" | "completed";
  onTabChange: (tab: "required" | "completed") => void;
}

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View className="flex-row items-center">
    <Text className="text-text-muted text-base mr-1">{label}:</Text>
    <Text className="text-text-primary font-bold text-base">{value}</Text>
  </View>
);

export const SpotCheckHeader: React.FC<SpotCheckHeaderProps> = React.memo(
  ({ flightInfo, activeTab, onTabChange }) => {
    return (
      <View className="my-6">
        <View className="flex-row flex-wrap gap-x-6 gap-y-2 mb-6 px-1">
          <InfoItem label="Flight" value={flightInfo.flight} />
          <InfoItem label="Route" value={flightInfo.route} />
          <InfoItem label="Date" value={flightInfo.date} />
          <InfoItem label="Aircraft" value={flightInfo.aircraft} />
          <InfoItem label="AC Reg" value={flightInfo.acReg} />
          <InfoItem label="Destination" value={flightInfo.destination} />
        </View>

        {/* Tab Switcher */}
        <View className="bg-bg-tertiary rounded-full flex-row h-12 mb-6">
          <TouchableOpacity
            className={`flex-1 rounded-full justify-center items-center ${
              activeTab === "required" ? "bg-bg-secondary" : ""
            }`}
            onPress={() => onTabChange("required")}
          >
            <Text
              className={`font-medium ${
                activeTab === "required"
                  ? "text-text-primary"
                  : "text-text-muted"
              }`}
            >
              Required Checks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 rounded-full justify-center items-center ${
              activeTab === "completed" ? "bg-bg-secondary" : ""
            }`}
            onPress={() => onTabChange("completed")}
          >
            <Text
              className={`font-medium ${
                activeTab === "completed"
                  ? "text-text-primary"
                  : "text-text-muted"
              }`}
            >
              Completed Checks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Table Header Row */}
        <View className="bg-bg-tertiary rounded-t-xl flex-row px-4 py-3 border-b border-border-muted">
          <Text className="flex-[0.5] text-lg font-semibold text-text-primary">
            Code
          </Text>
          <Text className="flex-[1.5] text-lg font-semibold text-text-primary">
            Name
          </Text>
          <Text className="flex-[0.8] text-lg font-semibold text-text-primary">
            Category
          </Text>
          <View className="flex-[0.8] flex-row items-center">
            <Text className="text-lg font-semibold text-text-primary mr-1">
              Status
            </Text>
          </View>
          <Text className="flex-[0.5] text-lg font-semibold text-text-primary text-right">
            Action
          </Text>
        </View>
      </View>
    );
  },
);
SpotCheckHeader.displayName = "SpotCheckHeader";
