// Create a new file: /components/FlightRow.tsx
import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Flight } from "../../const/flightsData";
import { ActionIcon, ArrowIcon } from "../../assets/icons";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";

interface Props {
  flight: Flight;
  navigation: NavigationProp<RootStackParamList>;
}

export const FlightRow: React.FC<Props> = ({ flight, navigation }) => {
  const logoUrl = `https://content.airhex.com/content/logos/airlines_${flight.airlineCode}_100_100_s.png`;

  const handlePress = () => {
    console.log("navigation initiated")
    navigation.navigate('FlightDetails', {
      flightId: flight.flightNumber,
      route: `${flight.departure.code}-${flight.arrival.code}`, // Example: MCT-JED
      date: flight.date,
    });
  };

  return (
    <View style={styles.rowContainer}>
      {/* Airline */}
      <View style={[styles.cell, { flex: 6, alignItems: "flex-start" }]}>
        <Image
          source={{ uri: logoUrl }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Route */}
      <View style={[styles.cell, { flex: 12 }]}>
        <Text style={styles.routeText}>{flight.route}</Text>
      </View>

      {/* Flight # */}
      <View style={[styles.cell, { flex: 8 }]}>
        <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
      </View>

      {/* Type */}
      <View style={[styles.cell, { flex: 3 }]}>
        <Text style={styles.regularText}>{flight.flightType}</Text>
      </View>

      {/* Date */}
      <View style={[styles.cell, { flex: 6 }]}>
        <Text style={styles.regularText}>{flight.date}</Text>
      </View>

      {/* Departure */}
      <View style={[styles.cell, { flex: 6 }]}>
        <Text style={styles.statusText}>{flight.departure.status}</Text>
        <Text style={styles.timeText}>{flight.departure.time}</Text>
        <Text style={styles.codeText}>{flight.departure.code}</Text>
      </View>

      {/* Arrival */}
      <View style={[styles.cell, { flex: 6 }]}>
        <Text style={styles.statusText}>{flight.arrival.status}</Text>
        <Text style={styles.timeText}>{flight.arrival.time}</Text>
        <Text style={styles.codeText}>{flight.arrival.code}</Text>
      </View>

      {/* Status */}
      <View style={[styles.cell, styles.rightBorderCell, { flex: 6 }]}>
        <Text style={styles.regularText}>{flight.statusText}</Text>
      </View>

      {/* AC Type/Reg */}
      <View style={[styles.cell, styles.rightBorderCell, { flex: 10 }]}>
        <Text style={styles.regularText}>{flight.aircraft.type}</Text>
        <Text style={styles.acRegText}>{flight.aircraft.reg}</Text>
      </View>

      {/* Ground */}
      <View style={[styles.cell, styles.rightBorderCell, { flex: 5 }]}>
        <Text style={styles.regularText}>{flight.groundTime}</Text>
      </View>

      {/* PAX Total */}
      <View
        style={[
          styles.cell,
          styles.rightBorderCell,
          { flex: 5, alignItems: "center" },
        ]}
      >
        <Text style={styles.paxText}>{flight.pax || ""}</Text>
      </View>

      {/* Spot */}
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
    alignItems: "stretch", // Changed from "center" to "stretch" for full height borders
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#7b7979ff",
    paddingHorizontal: 10,
    minHeight: 65,
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  rightBorderCell: {
    borderRightWidth: 1,
    borderRightColor: "#7b7979ff",
    marginRight: 4, // Added margin to separate border from next cell
  },
  logo: {
    width: 30,
    height: 30,
  },
  routeText: {
    fontSize: 14,
    color: "#333",
  },
  flightNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  regularText: {
    fontSize: 14,
    color: "#333",
  },
  statusText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  timeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  codeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00529b", // Blue color for airport code
  },
  acRegText: {
    fontSize: 13,
    color: "#555",
  },
  paxText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
  },
});
