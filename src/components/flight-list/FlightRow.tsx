import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Flight } from "../../types/flight";
import { RootStackParamList } from "../../../App";
import { ArrowIcon } from "../../assets/icons";
import { formatDate, formatTime } from "../../utils/dateFormatter";

interface Props {
  flight: Flight;
  navigation: NavigationProp<RootStackParamList>;
  isLastInGroup: boolean;
  isFirstInGroup: boolean;
  isPaired: boolean;
}

export const FlightRow: React.FC<Props> = ({
  flight,
  navigation,
  isLastInGroup,
  isFirstInGroup,
  isPaired,
}) => {
  const airlineCode = flight.airline?.code || "WY";
  const logoUrl = `https://content.airhex.com/content/logos/airlines_${airlineCode}_100_100_s.png`;

  const handlePress = () => {
    navigation.navigate("FlightDetails", {
      flightId: flight.flightNumber,
      route: flight.pairRoute,
      date: flight.scheduledDeparture,
    });
  };

  const getRouteDisplay = () => {
    if (isPaired) {
      if (isFirstInGroup) {
        return flight.pairRoute;
      } else {
        return "";
      }
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
        <Image
          source={{ uri: logoUrl }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.cell, { flex: 12 }]}>
        <Text style={styles.routeText}>{getRouteDisplay()}</Text>
      </View>

      <View style={[styles.cell, { flex: 8 }]}>
        <Text style={styles.flightNumber}>
          {flight.airline?.code}
          {flight.flightNumber}
        </Text>
      </View>

      <View style={[styles.cell, { flex: 3 }]}>
        <Text style={styles.regularText}>
          {flight.direction === "Outbound" ? "O" : "I"}
        </Text>
      </View>

      <View style={[styles.cell, { flex: 6 }]}>
        <Text style={styles.regularText}>
          {formatDate(flight.scheduledDeparture)}
        </Text>
      </View>

      <View style={[styles.cell, { flex: 6 }]}>
        <Text style={styles.statusText}>STD</Text>
        <Text style={styles.timeText}>
          {formatTime(flight.scheduledDeparture)}
        </Text>
        <Text style={styles.codeText}>{flight.departureDestination}</Text>
      </View>

      <View style={[styles.cell, { flex: 6 }]}>
        <Text style={styles.statusText}>STA</Text>
        <Text style={styles.timeText}>
          {formatTime(flight.scheduledArrival)}
        </Text>
        <Text style={styles.codeText}>{flight.arrivalDestination}</Text>
      </View>

      <View style={[styles.cell, styles.rightBorderCell, { flex: 6 }]}>
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
        <Text style={styles.regularText}>{flight.aircraft?.type || "-"}</Text>
        <Text style={styles.acRegText}>
          {flight.aircraft?.registration || "-"}
        </Text>
      </View>

      <View style={[styles.cell, styles.rightBorderCell, { flex: 5 }]}>
        <Text style={styles.regularText}>
          {flight.cutoffTime ? formatTime(flight.cutoffTime) : "-"}
        </Text>
      </View>

      <View
        style={[
          styles.cell,
          styles.rightBorderCell,
          { flex: 5, alignItems: "center" },
        ]}
      >
        <Text style={styles.paxText}>
          {flight.paxCounts?.totalCount ?? "-"}
        </Text>
      </View>

      {/* Arrow */}
      <View style={[styles.cell, { flex: 4, alignItems: "center" }]}>
        <Pressable onPress={handlePress}>
          <ArrowIcon />
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
    minHeight: 65,
  },
  attachedRow: {
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  rightBorderCell: {
    borderRightWidth: 1,
    borderRightColor: "#7b7979ff",
    marginRight: 4,
  },
  logo: { width: 30, height: 30 },
  routeText: { fontSize: 14, color: "#333", fontWeight: "600" },
  flightNumber: { fontSize: 15, fontWeight: "600", color: "#000" },
  regularText: { fontSize: 14, color: "#333" },
  statusText: {
    fontSize: 10,
    color: "#888",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  timeText: { fontSize: 15, fontWeight: "600", color: "#000" },
  codeText: { fontSize: 14, fontWeight: "600", color: "#00529b" },
  acRegText: { fontSize: 13, color: "#555" },
  paxText: { fontSize: 15, fontWeight: "500", color: "#000" },
});
