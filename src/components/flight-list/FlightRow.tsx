import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
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

  const rowStyle = [styles.rowContainer, !isLastInGroup && styles.attachedRow];

  return (
    <View style={rowStyle}>
      <View style={[styles.cell, { flex: 6, alignItems: "flex-start" }]}>
        {AirlineIcon ? (
          <AirlineIcon width={50} height={50} />
        ) : (
          <Text style={{ fontSize: 14 }}>N/A</Text>
        )}
      </View>

      <View style={[styles.cell, { flex: 12 }]}>
        <Text style={styles.routeText}>{getRouteDisplay()}</Text>
      </View>

      <View style={[styles.cell, { flex: 8 }]}>
        <Text style={styles.flightNumber}>
          {flight.airline?.designator}
          {flight.flightNumber}
        </Text>
      </View>

      <View style={[styles.cell, { flex: 3 }]}>
        <Text style={styles.regularText}>{flight.flightTypeIataCode}</Text>
      </View>

      <View style={[styles.cell, { flex: 7 }]}>
        <Text style={styles.regularText}>
          {formatDate(flight.scheduledDeparture)}
        </Text>
      </View>

      <View style={[styles.cell, { flex: 7 }]}>
        <Text style={styles.statusText}>STD</Text>
        <Text style={styles.timeText}>
          {formatTime(flight.scheduledDeparture)}
        </Text>
        <Text style={styles.codeText}>{flight.departureDestination}</Text>
      </View>

      <View style={[styles.cell, { flex: 7 }]}>
        <Text style={styles.statusText}>STA</Text>
        <Text style={styles.timeText}>
          {formatTime(flight.scheduledArrival)}
        </Text>
        <Text style={styles.codeText}>{flight.arrivalDestination}</Text>
      </View>

      <View style={[styles.cell, styles.rightBorderCell, { flex: 7 }]}>
        <Text
          style={[
            styles.regularText,
            { color: flight.isCancelled ? "red" : "#333" },
          ]}
        >
          {flight.isCancelled ? "Cancelled" : flight.status}
        </Text>
      </View>

      <View style={[styles.cell, styles.rightBorderCell, { flex: 10 }]}>
        <Text style={[styles.regularText, { textAlign: "center" }]}>
          {flight.aircraft?.type || "-"}
        </Text>
        <Text style={[styles.acRegText, { textAlign: "center" }]}>
          {flight.aircraft?.registration || "-"}
        </Text>
      </View>
      <View
        style={[
          styles.cell,
          styles.rightBorderCell,
          { flex: 5, alignItems: "center" },
        ]}
      >
        <Text style={[styles.paxText, { textAlign: "center" }]}>
          {flight.passengers?.totalCount ?? "-"}
        </Text>
      </View>

      <View style={[styles.cell, { flex: 4, alignItems: "center" }]}>
        <Pressable onPress={handlePress}>
          <ArrowIcon width={24} height={24} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#7b7979ff",
    paddingHorizontal: 10,
    minHeight: 70,
  },
  attachedRow: {
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  rightBorderCell: {
    borderRightWidth: 1,
    borderRightColor: "#7b7979ff",
    marginRight: 4,
  },
  routeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  flightNumber: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  regularText: {
    fontSize: 16,
    color: "#333",
  },
  statusText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  timeText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  codeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00529b",
  },
  acRegText: {
    fontSize: 14,
    color: "#555",
  },
  paxText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000",
  },
});
