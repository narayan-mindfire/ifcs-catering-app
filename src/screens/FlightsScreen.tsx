import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { BreadCrumb } from "../components/common/BreadCrumbs";
import { FlightRow } from "../components/flight-list/FlightRow";
import { FlightListHeader } from "../components/flight-list/FlightListHeader";
import { useFlightStore } from "../store/useFlightStore";
import { Flight } from "../types/flight";

type FlightsScreenRouteProp = RouteProp<RootStackParamList, "Flights">;
type FlightsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Flights"
>;

interface Props {
  route: FlightsScreenRouteProp;
  navigation: FlightsScreenNavigationProp;
}

const FlightsScreen: React.FC<Props> = ({ navigation }) => {
  const { flightGroups, isLoading, error, fetchFlights } = useFlightStore();

  const [dateFilter, setDateFilter] = useState("");
  const [flightNumFilter, setFlightNumFilter] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [airlineFilter, setAirlineFilter] = useState("");

  useEffect(() => {
    fetchFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanedFlightGroups = useMemo(() => {
    const idsInPairs = new Set<string>();
    flightGroups.forEach((group) => {
      if (group.length > 1) {
        group.forEach((flight) => idsInPairs.add(flight.id));
      }
    });

    return flightGroups.filter((group) => {
      if (group.length > 1) return true;
      const singleFlightId = group[0].id;
      return !idsInPairs.has(singleFlightId);
    });
  }, [flightGroups]);

  const filteredData = useMemo(() => {
    if (!dateFilter && !flightNumFilter && !airlineFilter)
      return cleanedFlightGroups;

    return cleanedFlightGroups.filter((group) => {
      return group.some((flight) => {
        const fullFlightNum = `${flight.airline?.code || "WY"}${flight.flightNumber}`;
        const matchesNum = flightNumFilter
          ? fullFlightNum.toLowerCase().includes(flightNumFilter.toLowerCase())
          : true;

        const matchesDate = dateFilter
          ? flight.scheduledDeparture.startsWith(dateFilter)
          : true;

        const matchesAirline = airlineFilter
          ? flight.airline?.name
              ?.toLowerCase()
              .includes(airlineFilter.toLowerCase()) ||
            flight.airline?.code
              ?.toLowerCase()
              .includes(airlineFilter.toLowerCase())
          : true;

        return matchesNum && matchesDate && matchesAirline;
      });
    });
  }, [cleanedFlightGroups, dateFilter, flightNumFilter, airlineFilter]);

  const renderFlightGroup = ({ item: group }: { item: Flight[] }) => {
    const isPaired = group.length > 1;
    return (
      <View style={styles.groupContainer}>
        {group.map((flight, index) => (
          <FlightRow
            key={flight.id}
            flight={flight}
            navigation={navigation}
            isLastInGroup={index === group.length - 1}
            isFirstInGroup={index === 0}
            isPaired={isPaired}
            flightGroup={group} // Add this line
          />
        ))}
      </View>
    );
  };

  const breadcrumbItems = [
    { label: "Dashboard", onPress: () => navigation.navigate("Dashboard") },
    { label: "Flights" },
  ];

  if (isLoading && flightGroups.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00529b" />
      </SafeAreaView>
    );
  }

  if (error && flightGroups.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BreadCrumb items={breadcrumbItems} />

      <View style={styles.filterContainer}>
        <View>
          <Text style={{ color: "#333" }}>station</Text>
          <Text
            style={{ textAlign: "center", fontWeight: "600", fontSize: 48 }}
          >
            YUL
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.filterInputWrapper}>
            <TextInput
              style={styles.filterInput}
              placeholder="Date"
              placeholderTextColor="#999"
              value={dateFilter}
              onChangeText={setDateFilter}
            />
          </View>

          {/* <View style={styles.filterInputWrapper}>
          <TextInput
            style={styles.filterInput}
            placeholder="Airline"
            placeholderTextColor="#999"
            value={airlineFilter}
            onChangeText={setAirlineFilter}
          />
        </View> */}

          <View style={styles.filterInputWrapper}>
            <TextInput
              style={styles.filterInput}
              placeholder="Flight #"
              placeholderTextColor="#999"
              value={flightNumFilter}
              onChangeText={setFlightNumFilter}
            />
          </View>
        </View>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={filteredData}
        renderItem={renderFlightGroup}
        keyExtractor={(group, index) => group[0]?.id || index.toString()}
        ListHeaderComponent={<FlightListHeader />}
        stickyHeaderIndices={[0]}
        onRefresh={fetchFlights}
        refreshing={isLoading}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.center}>
              <Text style={{ marginTop: 20, color: "#888", fontSize: 16 }}>
                No flights found matching filters.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default FlightsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  groupContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#7b7979ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: "#f5f5f5",
  },
  filterInputWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    width: 140,
    height: 45,
    justifyContent: "center",
  },
  filterInput: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
    height: "100%",
  },
});
