import React from "react";
import { View, Text, Pressable } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Flight } from "../../types/flight";
import { RootStackParamList } from "../../../App";
import { ArrowIcon } from "../../assets/icons";
import { formatDate, formatTime } from "../../utils/dateFormatter";
import { airlineIcons } from "../../assets/icons/airline";

interface Props {
  flight: Flight;
  navigation: NavigationProp<RootStackParamList>;
  isLastInGroup: boolean;
  isFirstInGroup: boolean;
  isPaired: boolean;
  flightGroup?: Flight[];
}

export const FlightRow: React.FC<Props> = ({
  flight,
  navigation,
  isLastInGroup,
  isFirstInGroup,
  isPaired,
  flightGroup = [],
}) => {
  const airlineCode = flight.airline?.code || "WY";
  const AirlineIcon = airlineIcons[airlineCode];

  const handlePress = () => {
    navigation.navigate("FlightDetails", {
      flightId: flight.flightNumber,
      route: flight.pairRoute,
      date: flight.scheduledDeparture,
    });
  };

  const getRouteDisplay = () => {
    if (isPaired && isFirstInGroup && flightGroup.length === 2) {
      // Build complete route from both flights
      const flight1 = flightGroup[0]; // First leg
      const flight2 = flightGroup[1]; // Return leg

      // Extract routes: SIN-DXB and DXB-SIN becomes SIN-DXB-SIN
      return `${flight1.departureDestination}-${flight1.arrivalDestination}-${flight2.arrivalDestination}`;
    }

    if (isPaired && !isFirstInGroup) {
      return "";
    }

    return (
      flight.pairRoute ||
      `${flight.departureDestination}-${flight.arrivalDestination}`
    );
  };

  return (
    <View
      className={`flex-row items-stretch bg-bg-surface px-2.5 min-h-[70px] ${
        !isLastInGroup
          ? "border-b-0 border-b-transparent"
          : "border-b border-border-secondary"
      }`}
    >
      <View className="flex-[6] py-2.5 px-1 justify-center items-start">
        {AirlineIcon ? (
          <AirlineIcon width={50} height={50} />
        ) : (
          <Text className="text-sm">N/A</Text>
        )}
      </View>

      <View className="flex-[12] py-2.5 px-1 justify-center">
        <Text className="text-base text-text-primary font-semibold">
          {getRouteDisplay()}
        </Text>
      </View>

      <View className="flex-[8] py-2.5 px-1 justify-center">
        <Text className="text-[17px] font-semibold text-black">
          {flight.airline?.designator}
          {flight.flightNumber}
        </Text>
      </View>

      <View className="flex-[3] py-2.5 px-1 justify-center">
        <Text className="text-base text-text-primary">
          {flight.flightTypeIataCode}
        </Text>
      </View>

      <View className="flex-[7] py-2.5 px-1 justify-center">
        <Text className="text-base text-text-primary">
          {formatDate(flight.scheduledDeparture)}
        </Text>
      </View>

      <View className="flex-[7] py-2.5 px-1 justify-center">
        <Text className="text-xs text-text-muted mb-0.5 uppercase">STD</Text>
        <Text className="text-[17px] font-semibold text-black">
          {formatTime(flight.scheduledDeparture)}
        </Text>
        <Text className="text-base font-semibold text-bg-button">
          {flight.departureDestination}
        </Text>
      </View>

      <View className="flex-[7] py-2.5 px-1 justify-center">
        <Text className="text-xs text-text-muted mb-0.5 uppercase">STA</Text>
        <Text className="text-[17px] font-semibold text-black">
          {formatTime(flight.scheduledArrival)}
        </Text>
        <Text className="text-base font-semibold text-bg-button">
          {flight.arrivalDestination}
        </Text>
      </View>

      <View className="flex-[7] py-2.5 px-1 justify-center border-r border-border-secondary mr-1">
        <Text
          className="text-base"
          style={{ color: flight.isCancelled ? "red" : "#333" }}
        >
          {flight.isCancelled ? "Cancelled" : flight.status}
        </Text>
      </View>

      <View className="flex-[10] py-2.5 px-1 justify-center border-r border-border-secondary mr-1">
        <Text className="text-base text-text-primary text-center">
          {flight.aircraft?.type || "-"}
        </Text>
        <Text className="text-sm text-text-secondary text-center">
          {flight.aircraft?.registration || "-"}
        </Text>
      </View>

      <View className="flex-[5] py-2.5 px-1 justify-center items-center border-r border-border-secondary mr-1">
        <Text className="text-[17px] font-medium text-black text-center">
          {flight.passengers?.totalCount ?? "-"}
        </Text>
      </View>

      <View className="flex-[4] py-2.5 px-1 justify-center items-center">
        <Pressable onPress={handlePress}>
          <ArrowIcon width={24} height={24} />
        </Pressable>
      </View>
    </View>
  );
};
