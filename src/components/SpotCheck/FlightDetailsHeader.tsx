import React from "react";
import { Text, View } from "react-native";

interface FlightInfo {
  flight: string;
  route: string;
  date: string;
  aircraft: string;
  acReg: string;
  destination: string;
  galley?: string;
  stowage?: string;
  carrier?: string;
}

interface FlightInfoHeaderProps {
  flightInfo: FlightInfo;
}

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View className="flex-row items-center mr-4 mb-0">
    <Text className="text-text-muted text-base mr-1">{label}:</Text>
    <Text className="text-text-primary font-semibold text-base">{value}</Text>
  </View>
);

export const FlightInfoHeader: React.FC<FlightInfoHeaderProps> = React.memo(
  ({ flightInfo }) => {
    return (
      <View className="bg-white px-6 py-0.5 border-b border-gray-200">
        <View className="flex-row flex-wrap">
          {/* First Row */}
          <InfoItem label="Flight" value={flightInfo.flight} />
          <InfoItem label="Route" value={flightInfo.route} />
          <InfoItem label="Date" value={flightInfo.date} />
          <InfoItem label="Aircraft" value={flightInfo.aircraft} />
          <InfoItem label="AC Reg" value={flightInfo.acReg} />
          <InfoItem label="Dest" value={flightInfo.destination} />

          {/* Divider */}
          <View className="w-full h-px bg-gray-100 my-2" />

          {/* Second Row */}
          <InfoItem label="Galley" value={flightInfo.galley || "N/A"} />
          <InfoItem label="Stowage" value={flightInfo.stowage || "N/A"} />
          <InfoItem label="Carrier" value={flightInfo.carrier || "N/A"} />
        </View>
      </View>
    );
  },
);

FlightInfoHeader.displayName = "FlightInfoHeader";
