import React, { useEffect, useState, useMemo } from "react";
import {
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
import { formatDate } from "../utils/dateFormatter";

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
  const renderCount = React.useRef(0);
  renderCount.current = renderCount.current + 1;

  console.log(`FlightsScreen rendered: ${renderCount.current} times`);
  const { flightGroups, isLoading, error, fetchFlights } = useFlightStore();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [flightNumFilter, setFlightNumFilter] = useState("");
  const [airlineFilter] = useState("");

  useEffect(() => {
    fetchFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDateToISO = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "set" && date) {
        setSelectedDate(date);
      }
    } else {
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
        console.log("SELECTED DATE: ", selectedDate);
        console.log("DATE STRING: ", dateString);
        const matchesDate = selectedDate
          ? (flight.scheduledDeparture?.startsWith(dateString) ?? false)
          : true;

        console.log("MATCHES DATE: ", matchesDate);

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
      <View className="mb-4 bg-bg-surface border-t border-border-secondary shadow-sm">
        {group.map((flight, index) => (
          <FlightRow
            key={flight.id}
            flight={flight}
            navigation={navigation}
            isLastInGroup={index === group.length - 1}
            isFirstInGroup={index === 0}
            isPaired={isPaired}
            flightGroup={group}
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
      <SafeAreaView className="flex-1 bg-bg-tertiary justify-center items-center">
        <ActivityIndicator size="large" color="#00529b" />
      </SafeAreaView>
    );
  }

  if (error && flightGroups.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-bg-tertiary justify-center items-center">
        <Text className="text-red-500 text-base">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-tertiary">
      <BreadCrumb items={breadcrumbItems} />

      <View className="flex-row justify-between items-end px-4 py-3 bg-bg-tertiary">
        <View>
          <Text className="font-extrabold text-4xl text-text-primary">YUL</Text>
        </View>
        <View className="flex-row gap-2.5">
          <Pressable
            className="bg-bg-surface rounded-lg border border-border-secondary w-[140px] h-[45px] justify-center flex-row items-center"
            onPress={() => setShowDatePicker(!showDatePicker)}
          >
            <Text
              className={`px-2.5 text-base flex-1 ${
                selectedDate ? "text-text-primary" : "text-text-tertiary"
              }`}
            >
              {selectedDate ? formatDate(String(selectedDate)) : "Date"}
            </Text>
            {selectedDate && (
              <Pressable
                onPress={clearDate}
                className="px-2.5 h-full justify-center"
              >
                <Text className="text-sm text-text-tertiary font-bold">✕</Text>
              </Pressable>
            )}
          </Pressable>

          <View className="bg-bg-surface rounded-lg border border-border-secondary w-[140px] h-[45px] justify-center flex-row items-center">
            <TextInput
              className="px-2.5 text-base text-text-primary h-full flex-1"
              placeholder="Flight #"
              placeholderTextColor="#999"
              value={flightNumFilter}
              onChangeText={setFlightNumFilter}
            />
          </View>
        </View>
      </View>

      {showDatePicker && (
        <View className="bg-black/50 absolute top-0 left-0 right-0 bottom-0 z-[1000] justify-center items-center">
          <View className="bg-bg-surface rounded-xl p-4 shadow-lg min-w-[300px]">
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onDateChange}
              accentColor="#602AF3"
              textColor="#602AF3"
              style={{
                width: "100%",
                height: Platform.OS === "ios" ? 350 : "auto",
              }}
            />
            {Platform.OS === "ios" && (
              <View className="flex-row justify-between mt-4 gap-3">
                <Pressable
                  className="flex-1 py-3 rounded-lg items-center bg-bg-tertiary"
                  onPress={clearDate}
                >
                  <Text className="text-text-primary text-base font-semibold">
                    Clear
                  </Text>
                </Pressable>
                <Pressable
                  className="flex-1 py-3 rounded-lg items-center bg-bg-button"
                  onPress={confirmDateIOS}
                >
                  <Text className="text-text-surface text-base font-semibold">
                    Done
                  </Text>
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
            <View className="justify-center items-center">
              <Text className="mt-5 text-text-muted text-base">
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
