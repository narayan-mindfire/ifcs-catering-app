import React, { useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
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
  navigation: FlightsScreenNavigationProp;
  route: FlightsScreenRouteProp;
}

const FlightsScreen: React.FC<Props> = ({ navigation }) => {
  const { flightGroups, isLoading, error, fetchFlights } = useFlightStore();

  // --- State ---
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [flightNumFilter, setFlightNumFilter] = useState("");
  const [airlineFilter] = useState("");

  useEffect(() => {
    fetchFlights();
  }, []);

  // --- Helpers ---
  const formatDateToISO = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    // For Android, close picker after selection
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "set" && date) {
        setSelectedDate(date);
      }
    } else {
      // For iOS, update date immediately
      if (date) {
        setSelectedDate(date);
      }
    }
  };

  const clearDate = () => {
    setSelectedDate(null);
    setShowDatePicker(false);
  };

  const confirmDateIOS = () => {
    setShowDatePicker(false);
  };

  // --- Filter Logic ---
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
    if (!selectedDate && !flightNumFilter && !airlineFilter)
      return cleanedFlightGroups;

    const dateString = selectedDate ? formatDateToISO(selectedDate) : "";

    return cleanedFlightGroups.filter((group) => {
      return group.some((flight) => {
        const fullFlightNum = `${flight.airline?.code || "WY"}${flight.flightNumber}`;
        const matchesNum = flightNumFilter
          ? fullFlightNum.toLowerCase().includes(flightNumFilter.toLowerCase())
          : true;

        const matchesDate = selectedDate
          ? flight.scheduledDeparture.startsWith(dateString)
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
  }, [cleanedFlightGroups, selectedDate, flightNumFilter, airlineFilter]);

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
          <Text style={styles.stationCode}>YUL</Text>
        </View>
        <View style={styles.filtersRight}>
          <Pressable
            style={styles.filterInputWrapper}
            onPress={() => setShowDatePicker(!showDatePicker)}
          >
            <Text
              style={[styles.filterText, !selectedDate && { color: "#999" }]}
            >
              {selectedDate ? formatDateToISO(selectedDate) : "Date"}
            </Text>
            {selectedDate && (
              <Pressable onPress={clearDate} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>✕</Text>
              </Pressable>
            )}
          </Pressable>

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

      {showDatePicker && (
        <View style={styles.datePickerContainer}>
          <View style={styles.datePickerWrapper}>
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onDateChange}
              style={styles.datePicker}
            />
            {Platform.OS === "ios" && (
              <View style={styles.datePickerButtons}>
                <Pressable
                  style={[styles.dateButton, styles.cancelButton]}
                  onPress={clearDate}
                >
                  <Text style={styles.cancelButtonText}>Clear</Text>
                </Pressable>
                <Pressable
                  style={[styles.dateButton, styles.confirmButton]}
                  onPress={confirmDateIOS}
                >
                  <Text style={styles.confirmButtonText}>Done</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      )}

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
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
  },
  stationLabel: {
    color: "#555",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: -4,
  },
  stationCode: {
    fontWeight: "800",
    fontSize: 36,
    color: "#333",
  },
  filtersRight: {
    flexDirection: "row",
    gap: 10,
  },
  filterInputWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    width: 140,
    height: 45,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  filterInput: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
    height: "100%",
    flex: 1,
  },
  filterText: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: 10,
    height: "100%",
    justifyContent: "center",
  },
  clearButtonText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "bold",
  },
  // --- DATE PICKER STYLES ---
  datePickerContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 300,
  },
  datePicker: {
    width: "100%",
    height: Platform.OS === "ios" ? 350 : "auto",
  },
  datePickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#00529b",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
