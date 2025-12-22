import React, { memo, useMemo, useCallback } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Flight } from "../../types/flight";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { ArrowIcon } from "../../assets/icons";
import { formatDate, formatTimeWithOffset } from "../../utils/dateFormatter";
import { EmairatesIcon } from "../../assets/logos";

interface Props {
  flight: Flight;
  navigation: NavigationProp<RootStackParamList>;
  isLastInGroup: boolean;
  isFirstInGroup: boolean;
  isPaired: boolean;
  flightGroup?: Flight[];
}

// Memoized component to prevent unnecessary re-renders
export const FlightRow: React.FC<Props> = memo(
  ({
    flight,
    navigation,
    isLastInGroup,
    isFirstInGroup,
    isPaired,
    flightGroup = [],
  }) => {
    // Memoize timezone extraction
    const { depOffset, arrOffset } = useMemo(
      () => ({
        depOffset: flight.departureStation?.timezone || "+00:00",
        arrOffset: flight.arrivalStation?.timezone || "+00:00",
      }),
      [flight.departureStation?.timezone, flight.arrivalStation?.timezone],
    );

    // Memoize route display logic
    const routeText = useMemo(() => {
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
    }, [
      isPaired,
      flightGroup,
      isFirstInGroup,
      flight.pairRoute,
      flight.departureDestination,
      flight.arrivalDestination,
    ]);

    // Memoize time display calculations
    const departureData = useMemo(() => {
      if (flight.actualDepartureUtc) {
        return {
          label: "Actual",
          time: flight.actualDepartureUtc,
          colorClass: "text-green-600",
        };
      }
      if (flight.estimatedDepartureUtc) {
        return {
          label: "Estimated",
          time: flight.estimatedDepartureUtc,
          colorClass: "text-orange-500",
        };
      }
      return {
        label: "Scheduled",
        time: flight.scheduledDepartureUtc,
        colorClass: "text-text-muted",
      };
    }, [
      flight.actualDepartureUtc,
      flight.estimatedDepartureUtc,
      flight.scheduledDepartureUtc,
    ]);

    const arrivalData = useMemo(() => {
      if (flight.actualArrivalUtc) {
        return {
          label: "Actual",
          time: flight.actualArrivalUtc,
          colorClass: "text-green-600",
        };
      }
      if (flight.estimatedArrivalUtc) {
        return {
          label: "Estimated",
          time: flight.estimatedArrivalUtc,
          colorClass: "text-orange-500",
        };
      }
      return {
        label: "Scheduled",
        time: flight.scheduledArrivalUtc,
        colorClass: "text-text-muted",
      };
    }, [
      flight.actualArrivalUtc,
      flight.estimatedArrivalUtc,
      flight.scheduledArrivalUtc,
    ]);

    // Memoize formatted times
    const departureTime = useMemo(
      () => formatTimeWithOffset(departureData.time, depOffset),
      [departureData.time, depOffset],
    );

    const arrivalTime = useMemo(
      () => formatTimeWithOffset(arrivalData.time, arrOffset),
      [arrivalData.time, arrOffset],
    );

    const formattedDate = useMemo(
      () =>
        formatDate(flight.scheduledDeparture).split(" ").slice(0, 2).join(" "),
      [flight.scheduledDeparture],
    );

    // Memoize press handler
    const handlePress = useCallback(() => {
      navigation.navigate("FlightDetails", {
        flightNumber: flight.airline?.designator + flight.flightNumber,
        flightId: flight.id,
        route: routeText,
        date: flight.scheduledDeparture,
      });
    }, [
      navigation,
      flight.airline?.designator,
      flight.flightNumber,
      flight.id,
      routeText,
      flight.scheduledDeparture,
    ]);

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
          <Text className="text-lg text-text-primary font-semibold">
            {flight.departureDestination} - {flight.arrivalDestination}
          </Text>
        </View>

        <View className="flex-[8] py-2.5 px-1 justify-center">
          <Text className="text-[17px] font-semibold text-black">
            {flight.airline?.designator}
            {flight.flightNumber}
          </Text>
        </View>

        <View className="flex-[3] py-2.5 px-1 justify-center">
          <Text className="text-lg text-text-primary">
            {flight.flightTypeIataCode}
          </Text>
        </View>

        <View className="flex-[7] py-2.5 px-1 justify-center">
          <Text className="text-lg text-text-primary">{formattedDate}</Text>
        </View>

        {/* --- DEPARTURE COLUMN --- */}
        <View className="flex-[7] py-2.5 px-1 justify-center">
          <Text
            className={`text-xs mb-0.5 uppercase ${departureData.colorClass}`}
          >
            {departureData.label}
          </Text>
          <Text className="text-[17px] font-semibold text-black">
            {departureTime}
          </Text>
          <Text className="text-lg font-semibold text-bg-button">
            {flight.departureDestination}
          </Text>
        </View>

        {/* --- ARRIVAL COLUMN --- */}
        <View className="flex-[7] py-2.5 px-1 justify-center">
          <Text
            className={`text-xs mb-0.5 uppercase ${arrivalData.colorClass}`}
          >
            {arrivalData.label}
          </Text>
          <Text className="text-[17px] font-semibold text-black">
            {arrivalTime}
          </Text>
          <Text className="text-lg font-semibold text-bg-button">
            {flight.arrivalDestination}{" "}
            <Text className="text-lg font-semibold text-green-500">
              {flight.gate?.stand}
            </Text>
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
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo
    // Only re-render if these specific props change
    return (
      prevProps.flight.id === nextProps.flight.id &&
      prevProps.isLastInGroup === nextProps.isLastInGroup &&
      prevProps.isFirstInGroup === nextProps.isFirstInGroup &&
      prevProps.isPaired === nextProps.isPaired &&
      prevProps.flight.status === nextProps.flight.status &&
      prevProps.flight.estimatedDepartureUtc ===
        nextProps.flight.estimatedDepartureUtc &&
      prevProps.flight.estimatedArrivalUtc ===
        nextProps.flight.estimatedArrivalUtc &&
      prevProps.flight.actualDepartureUtc ===
        nextProps.flight.actualDepartureUtc &&
      prevProps.flight.actualArrivalUtc === nextProps.flight.actualArrivalUtc
    );
  },
);
FlightRow.displayName = "FlightRow";
