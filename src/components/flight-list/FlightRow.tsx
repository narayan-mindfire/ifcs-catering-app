import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Flight } from "../../types/flight";
import { RootStackParamList } from "../../../App";
import { ArrowIcon } from "../../assets/icons";
import { formatDate, formatTime } from "../../utils/dateFormatter";
// import { airlineIcons } from "../../assets/icons/airline";
import { EmairatesIcon } from "../../assets/logos";

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
  // const airlineCode = flight.airline?.code || "WY";
  // const AirlineIcon = airlineIcons[airlineCode];

  const handlePress = () => {
    navigation.navigate("FlightDetails", {
      flightNumber: flight.flightNumber,
      flightId: flight.id,
      route: flight.pairRoute ?? "",
      date: flight.scheduledDeparture,
    });
  };

  const getRouteDisplay = () => {
    if (isPaired && flightGroup.length > 1) {
      if (isFirstInGroup) {
        const firstLeg = flightGroup[0];
        const secondLeg = flightGroup[1];
        return `${firstLeg.departureDestination}-${firstLeg.arrivalDestination}-${secondLeg.arrivalDestination}`;
      } else {
        return "";
      }
    }
    return (
      flight.pairRoute ||
      `${flight.departureDestination}-${flight.arrivalDestination}`
    );
  };

  const routeText = getRouteDisplay();

  const getTimeDisplay = (
    scheduled: string,
    estimated: string | null,
    actual: string | null,
  ) => {
    if (actual) {
      return { label: "Actual", time: actual, colorClass: "text-green-600" };
    }
    if (estimated) {
      return {
        label: "Estimated",
        time: estimated,
        colorClass: "text-orange-500",
      };
    }
    return {
      label: "Scheduled",
      time: scheduled,
      colorClass: "text-text-muted",
    };
  };

  const departureData = getTimeDisplay(
    flight.scheduledDepartureUtc,
    flight.estimatedDepartureUtc,
    flight.actualDepartureUtc,
  );

  const arrivalData = getTimeDisplay(
    flight.scheduledArrivalUtc,
    flight.estimatedArrivalUtc,
    flight.actualArrivalUtc,
  );

  return (
    <View
      className={`flex-row items-stretch bg-bg-surface px-2.5 min-h-[70px] ${
        !isLastInGroup
          ? "border-b-0 border-b-transparent"
          : "border-b border-border-secondary"
      }`}
    >
      <View className="flex-[6] py-2.5 px-1 justify-center items-start">
        {flight?.airline?.logo ? (
          <Image
            source={{ uri: flight.airline.logo }}
            style={{ width: 40, height: 40, resizeMode: "contain" }}
          />
        ) : (
          <EmairatesIcon width={50} height={50} />
        )}
      </View>

      <View className="flex-[12] py-2.5 px-1 justify-center">
        {routeText ? (
          <Text className="text-lg text-text-primary font-semibold">
            {routeText}
          </Text>
        ) : null}
      </View>

      <View className="flex-[8] py-2.5 px-1 justify-center">
        <Text className="text-[17px] font-semibold text-black">
          {flight.airline?.designator === "" || null
            ? "WY"
            : flight.airline?.designator}
          {flight.flightNumber}
        </Text>
      </View>

      <View className="flex-[3] py-2.5 px-1 justify-center">
        <Text className="text-lg text-text-primary">
          {flight.flightTypeIataCode}
        </Text>
      </View>

      <View className="flex-[7] py-2.5 px-1 justify-center">
        <Text className="text-lg text-text-primary">
          {formatDate(flight.scheduledDeparture)
            .split(" ")
            .slice(0, 2)
            .join(" ")}
        </Text>
      </View>

      {/* --- Departure Time Column --- */}
      <View className="flex-[7] py-2.5 px-1 justify-center">
        <Text
          className={`text-xs mb-0.5 uppercase ${departureData.colorClass}`}
        >
          {departureData.label}
        </Text>
        <Text className="text-[17px] font-semibold text-black">
          {formatTime(departureData.time)}
        </Text>
        <Text className="text-lg font-semibold text-bg-button">
          {flight.departureDestination}
        </Text>
      </View>

      {/* --- Arrival Time Column --- */}
      <View className="flex-[7] py-2.5 px-1 justify-center">
        <Text className={`text-xs mb-0.5 uppercase ${arrivalData.colorClass}`}>
          {arrivalData.label}
        </Text>
        <Text className="text-[17px] font-semibold text-black">
          {formatTime(arrivalData.time)}
        </Text>
        <Text className="text-lg font-semibold text-bg-button">
          {flight.arrivalDestination}
        </Text>
      </View>

      <View className="flex-[7] py-2.5 px-1 justify-center border-r border-border-secondary mr-1">
        <Text
          className="text-lg"
          style={{ color: flight.isCancelled ? "red" : "#333" }}
        >
          {flight.isCancelled ? "Cancelled" : flight.status}
        </Text>
      </View>

      <View className="flex-[10] py-2.5 px-1 justify-center border-r border-border-secondary mr-1">
        <Text className="text-lg text-text-primary text-center">
          {flight.aircraft?.type || "-"}
        </Text>
        <Text className="text-base text-text-secondary text-center">
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
