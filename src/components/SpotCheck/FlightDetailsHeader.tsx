import React from "react";
import { Text, View } from "react-native";

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = React.memo(({ label, value }) => (
  <View className="flex-row items-center">
    <Text className="text-text-muted text-base mr-1">{label}:</Text>
    <Text className="text-text-primary font-bold text-base">{value}</Text>
  </View>
));
InfoItem.displayName = "InfoItem";

interface FlightInfoHeaderProps {
  flightInfo: {
    flight: string;
    route: string;
    date: string;
    aircraft: string;
    acReg: string;
    destination: string;
  };
}

export const FlightInfoHeader: React.FC<FlightInfoHeaderProps> = React.memo(
  ({ flightInfo }) => {
    return (
      <View className="px-6 py-2">
        <View className="flex-row flex-wrap gap-x-6 gap-y-2 mb-4">
          <InfoItem label="Flight" value={flightInfo.flight} />
          <InfoItem label="Route" value={flightInfo.route} />
          <InfoItem label="Date" value={flightInfo.date} />
          <InfoItem label="Aircraft" value={flightInfo.aircraft} />
          <InfoItem label="AC Reg" value={flightInfo.acReg} />
          <InfoItem label="Destination" value={flightInfo.destination} />
        </View>
      </View>
    );
  },
);
FlightInfoHeader.displayName = "FlightInfoHeader";
